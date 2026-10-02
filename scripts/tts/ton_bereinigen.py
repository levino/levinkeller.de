"""Bereinigt eine mit Gemini-TTS erzeugte Tonspur und schreibt sie als MP3 (mono).

Aufruf: python3 ton_bereinigen.py <eingabe> <ausgabe.mp3> [bitrate]

Gemini-TTS liefert jede Vertonung mit zwei Fehlern aus:
  - am Anfang ein Knacken: rund eine Millisekunde fast voller Aussteuerung, danach Stille;
  - am Ende ein Rauschstoß: gut 100 Millisekunden breitbandiges Rauschen nahe 0 dBFS.
Werden mehrere Vertonungen aneinandergehängt, sitzen beide an jeder Abschnittsgrenze.

Außerdem schmatzt die Stimme gelegentlich kurz vor dem Einsatz und atmet hörbar zwischen Sätzen.

Das Skript sucht die ganze Datei ab (nicht nur Anfang und Ende), ersetzt gefundene Rauschstöße,
Knackser und Schmatzer durch Stille (mit kurzen Rampen), dämpft Atemzüge und Sprechpausen sanft
(Noise-Gate), blendet Anfang und Ende weich ein und aus und normalisiert die Lautheit zweistufig mit
ffmpeg-loudnorm auf ca. -16 LUFS. Die Länge bleibt gleich. Es braucht nur Python und ffmpeg (kein numpy).
Die Erkennung sucht in der ganzen Datei, weil mehrere Vertonungen aneinanderhängen."""
import json
import math
import pathlib
import re
import subprocess
import sys
import tempfile
from array import array

ABTASTRATE = 24000
FENSTER_LAENGE = ABTASTRATE // 50            # 20 ms
BLOCK_LAENGE = ABTASTRATE // 1000            # 1 ms

# Rauschstoß: mindestens drei 20-ms-Fenster am Stück, jedes lauter als -11 dBFS (Effektivwert) und breitbandig.
# Sprache erreicht in 20-ms-Fenstern höchstens etwa -8 dBFS, dann aber als Vokal (wenig Höhenanteil);
# Zischlaute sind breitbandig, bleiben aber leiser. Der Rauschstoß liegt bei -3 bis -7 dBFS.
RAUSCHEN_MINDESTPEGEL = -11.0
RAUSCHEN_HOEHENANTEIL = -4.0                 # Differenzsignal im Verhältnis zum Signal, in dB (weißes Rauschen: ca. +3)
RAUSCHEN_MINDESTFENSTER = 3
STILLE_PEGEL = -35.0                         # darunter gilt ein Nachbarfenster als still
RAUSCHEN_RAND_DAVOR = 2                      # höchstens so viele nicht stille Fenster vor dem Stoß werden mit entfernt
RAUSCHEN_RAND_DANACH = 5                     # ... und danach

# Isolierte Geräusche in Sprechpausen (Schmatzer, Klicks vor dem Einsatz): höchstens 60 ms über der Pausenschwelle,
# davor mindestens 160 ms und danach mindestens 60 ms darunter. Schwelle bezogen auf den Pegel NACH der
# Lautheitsnormalisierung.
GERAEUSCH_SCHWELLE_NACH_NORMALISIERUNG = -45.0
GERAEUSCH_HOECHSTFENSTER = 3
GERAEUSCH_STILLE_FENSTER = 8
GERAEUSCH_ABSTAND_ZUR_SPRACHE = 3

# Knacks: höchstens drei 1-ms-Blöcke über -20 dBFS; je 10 ms davor und danach mindestens 20 dB leiser
# (und unter -25 dBFS), weiter davor 20 ms und weiter danach 5 ms unter -30 dBFS, also keine Sprache.
KNACKS_MINDESTPEGEL = -20.0
KNACKS_HOECHSTBLOECKE = 3
KNACKS_NAHBEREICH_BLOECKE = 10
KNACKS_NAHBEREICH_HOECHSTPEGEL = -25.0
KNACKS_ABSTAND_ZUR_SPITZE = 20.0
KNACKS_STILLE = -30.0
KNACKS_STILLE_DAVOR_BLOECKE = 20
KNACKS_STILLE_DANACH_BLOECKE = 5

RAMPE_SEKUNDEN = 0.005
EINBLENDEN_SEKUNDEN = 0.04
AUSBLENDEN_SEKUNDEN = 0.05

# Noise-Gate für Sprechpausen, Schwelle bezogen auf den Pegel NACH der Lautheitsnormalisierung.
GATE_SCHWELLE_NACH_NORMALISIERUNG = -50.0
GATE_DAEMPFUNG_DB = -15.0
GATE_HALTEFENSTER = 3                        # 60 ms vor und nach jedem lauten Fenster bleibt offen

# Atemzüge zwischen zwei Sätzen (Gemini setzt hörbares Einatmen, -30 bis -40 dBFS): gedämpft, nicht entfernt.
ATEM_SPRACHSCHWELLE_NACH_NORMALISIERUNG = -24.0
ATEM_MINDESTPAUSE_FENSTER = 8                # 160 ms
ATEM_ABSTAND_FENSTER = 2                     # 40 ms Abstand zur Sprache
ATEM_HOEHENANTEIL_UNTEN = -8.0
ATEM_HOEHENANTEIL_OBEN = 2.0
ATEM_DAEMPFUNG_DB = -15.0

ZIEL_LAUTHEIT = -16.0
ZIEL_SPITZE = -2.0                           # Reserve, weil die MP3-Kodierung Spitzen um 1-2 dB anhebt
ZIEL_LAUTHEITSBEREICH = 11.0
BEGRENZER_GRENZE_DB = -3.5


def dezibel(leistung: float) -> float:
    return 10 * math.log10(max(leistung, 1e-12))


def ton_laden(pfad: str) -> array:
    rohdaten = subprocess.run(["ffmpeg", "-v", "error", "-i", str(pfad), "-ac", "1", "-ar", str(ABTASTRATE),
                               "-f", "f32le", "-"], capture_output=True, check=True).stdout
    ton = array("f")
    ton.frombytes(rohdaten)
    return ton


def fenster_messen(ton: array) -> tuple[list[float], list[float]]:
    """Effektivpegel (dBFS) und Höhenanteil (Differenzsignal minus Signal, dB) je 20-ms-Fenster."""
    pegel, hoehenanteil = [], []
    for fensteranfang in range(0, len(ton) - FENSTER_LAENGE + 1, FENSTER_LAENGE):
        fenster = ton[fensteranfang:fensteranfang + FENSTER_LAENGE]
        leistung = sum(wert * wert for wert in fenster) / FENSTER_LAENGE
        differenzleistung = sum((fenster[index] - fenster[index - 1]) ** 2 for index in range(1, FENSTER_LAENGE)) / FENSTER_LAENGE
        pegel.append(dezibel(leistung))
        hoehenanteil.append(dezibel(differenzleistung) - dezibel(leistung))
    return pegel, hoehenanteil


def rauschstoesse_finden(pegel: list[float], hoehenanteil: list[float]) -> list[tuple[int, int]]:
    """Liefert (erstes Fenster, Fenster nach dem Ende) je Rauschstoß, schon um stille Nachbarfenster erweitert."""
    fundstellen = []
    fensteranzahl = len(pegel)
    index = 0
    while index < fensteranzahl:
        if pegel[index] > RAUSCHEN_MINDESTPEGEL and hoehenanteil[index] > RAUSCHEN_HOEHENANTEIL:
            anfang = index
            while index < fensteranzahl and pegel[index] > RAUSCHEN_MINDESTPEGEL and hoehenanteil[index] > RAUSCHEN_HOEHENANTEIL:
                index += 1
            ende = index
            if ende - anfang >= RAUSCHEN_MINDESTFENSTER:
                # Ein- und Ausschwingen des Stoßes liegt in den Nachbarfenstern (das letzte Stück ist weniger
                # breitbandig). Alles Nicht-Stille direkt davor (höchstens 40 ms) und danach (höchstens 100 ms) gehört
                # dazu, außerdem je ein stilles Fenster. Vor dem Stoß liegt in der Praxis immer die Endstille.
                untergrenze = fundstellen[-1][1] if fundstellen else 0
                schritte = 0
                while anfang > untergrenze and pegel[anfang - 1] >= STILLE_PEGEL and schritte < RAUSCHEN_RAND_DAVOR:
                    anfang -= 1
                    schritte += 1
                if anfang > untergrenze and pegel[anfang - 1] < STILLE_PEGEL:
                    anfang -= 1
                schritte = 0
                while ende < fensteranzahl and pegel[ende] >= STILLE_PEGEL and schritte < RAUSCHEN_RAND_DANACH:
                    ende += 1
                    schritte += 1
                if ende < fensteranzahl and pegel[ende] < STILLE_PEGEL:
                    ende += 1
                index = ende
                fundstellen.append((anfang, ende))
        else:
            index += 1
    return fundstellen


def knackse_finden(ton: array) -> list[tuple[int, int]]:
    """Liefert (erster Abtastwert, Abtastwert nach dem Ende) je Knacks, auf 1 ms genau."""
    blockspitzen = []
    for blockanfang in range(0, len(ton) - BLOCK_LAENGE + 1, BLOCK_LAENGE):
        spitze = max(abs(wert) for wert in ton[blockanfang:blockanfang + BLOCK_LAENGE])
        blockspitzen.append(20 * math.log10(max(spitze, 1e-9)))
    fundstellen = []
    blockanzahl = len(blockspitzen)
    index = 0
    while index < blockanzahl:
        if blockspitzen[index] > KNACKS_MINDESTPEGEL:
            anfang = index
            while index < blockanzahl and blockspitzen[index] > KNACKS_MINDESTPEGEL:
                index += 1
            ende = index
            spitze = max(blockspitzen[anfang:ende])
            # Nahbereich (je 10 ms): mindestens 20 dB unter der Spitze. Hier liegt nach MP3-Kodierung das
            # verschmierte Vor- und Nachecho des Knackses, es wird mit entfernt.
            nah_grenze = min(KNACKS_NAHBEREICH_HOECHSTPEGEL, spitze - KNACKS_ABSTAND_ZUR_SPITZE)
            nah_davor = blockspitzen[max(0, anfang - KNACKS_NAHBEREICH_BLOECKE):anfang]
            nah_danach = blockspitzen[ende:ende + KNACKS_NAHBEREICH_BLOECKE]
            # Weiter weg (davor 20 ms, danach 5 ms): leise, also keine Sprache.
            fern_davor = blockspitzen[max(0, anfang - KNACKS_NAHBEREICH_BLOECKE - KNACKS_STILLE_DAVOR_BLOECKE):
                                      max(0, anfang - KNACKS_NAHBEREICH_BLOECKE)]
            fern_danach = blockspitzen[ende + KNACKS_NAHBEREICH_BLOECKE:ende + KNACKS_NAHBEREICH_BLOECKE + KNACKS_STILLE_DANACH_BLOECKE]
            if (ende - anfang <= KNACKS_HOECHSTBLOECKE
                    and all(wert < nah_grenze for wert in nah_davor + nah_danach)
                    and all(wert < KNACKS_STILLE for wert in fern_davor + fern_danach)):
                fundstellen.append((max(0, anfang - KNACKS_NAHBEREICH_BLOECKE) * BLOCK_LAENGE,
                                    min(blockanzahl, ende + KNACKS_NAHBEREICH_BLOECKE) * BLOCK_LAENGE))
        else:
            index += 1
    return fundstellen


def isolierte_geraeusche_finden(pegel: list[float], schwelle: float) -> list[tuple[int, int]]:
    """Liefert (erstes Fenster, Fenster nach dem Ende) je kurzem Geräusch, das allein in einer Sprechpause steht."""
    fundstellen = []
    fensteranzahl = len(pegel)
    index = 0
    while index < fensteranzahl:
        if pegel[index] >= schwelle:
            anfang = index
            while index < fensteranzahl and pegel[index] >= schwelle:
                index += 1
            ende = index
            davor = pegel[max(0, anfang - GERAEUSCH_STILLE_FENSTER):anfang]
            danach = pegel[ende:ende + GERAEUSCH_ABSTAND_ZUR_SPRACHE]
            # Davor lange Stille, danach mindestens ein kurzer Abstand: typischer Schmatzer vor dem Einsatz.
            # Umgekehrt (kurz nach Sprache) wird nichts entfernt, das könnte ein auslautendes „t“ oder „k“ sein.
            if (ende - anfang <= GERAEUSCH_HOECHSTFENSTER
                    and len(davor) == GERAEUSCH_STILLE_FENSTER and len(danach) == GERAEUSCH_ABSTAND_ZUR_SPRACHE
                    and all(wert < schwelle for wert in davor + danach)):
                fundstellen.append((anfang - 1, ende + 1))
        else:
            index += 1
    return fundstellen


def stille_einsetzen(ton: array, anfang: int, ende: int) -> None:
    """Setzt [anfang, ende) auf null und blendet davor und danach kurz aus bzw. ein."""
    rampe = int(RAMPE_SEKUNDEN * ABTASTRATE)
    for index in range(anfang, ende):
        ton[index] = 0.0
    for schritt in range(rampe):
        faktor = schritt / rampe
        if anfang - rampe + schritt >= 0:
            ton[anfang - rampe + schritt] *= 1.0 - faktor
        if ende + schritt < len(ton):
            ton[ende + schritt] *= faktor


def noise_gate_verstaerkungen(pegel: list[float], schwelle: float) -> list[float]:
    """Verstärkung je Fenster: gedämpft unter der Schwelle, sofern im Umkreis von GATE_HALTEFENSTER kein lautes
    Fenster liegt, sonst 1."""
    laut = [wert >= schwelle for wert in pegel]
    daempfung = 10 ** (GATE_DAEMPFUNG_DB / 20)
    verstaerkung = []
    for index in range(len(pegel)):
        umgebung = laut[max(0, index - GATE_HALTEFENSTER):index + GATE_HALTEFENSTER + 1]
        verstaerkung.append(1.0 if any(umgebung) else daempfung)
    return verstaerkung


def atemzuege_daempfen(pegel: list[float], hoehenanteil: list[float], verstaerkung: list[float],
                       versatz_normalisierung: float) -> list[tuple[int, int]]:
    """Dämpft hörbare Atemzüge in Sprechpausen um ATEM_DAEMPFUNG_DB (trägt die Dämpfung in verstaerkung ein).
    Sprechpause: mindestens 160 ms ohne Fenster über der Sprachschwelle. Darin gilt als Atemzug, was über der
    Pausenschwelle liegt und rauschartig ist (Höhenanteil zwischen -8 und +2 dB: kein Vokal, kein scharfes „s“).
    Zur Sprache bleiben je 40 ms Abstand, damit kein Ausklang und kein Einsatz angeschnitten wird."""
    sprachschwelle = ATEM_SPRACHSCHWELLE_NACH_NORMALISIERUNG - versatz_normalisierung
    pausenschwelle = GERAEUSCH_SCHWELLE_NACH_NORMALISIERUNG - versatz_normalisierung
    daempfung = 10 ** (ATEM_DAEMPFUNG_DB / 20)
    fundstellen = []
    fensteranzahl = len(pegel)
    index = 0
    while index < fensteranzahl:
        if pegel[index] <= sprachschwelle:
            anfang = index
            while index < fensteranzahl and pegel[index] <= sprachschwelle:
                index += 1
            ende = index
            if ende - anfang < ATEM_MINDESTPAUSE_FENSTER:
                continue
            atemfenster = [nummer for nummer in range(anfang + ATEM_ABSTAND_FENSTER, ende - ATEM_ABSTAND_FENSTER)
                           if pegel[nummer] > pausenschwelle and ATEM_HOEHENANTEIL_UNTEN < hoehenanteil[nummer] < ATEM_HOEHENANTEIL_OBEN]
            for nummer in atemfenster:
                verstaerkung[nummer] = min(verstaerkung[nummer], daempfung)
            if atemfenster:
                fundstellen.append((atemfenster[0], atemfenster[-1] + 1))
        else:
            index += 1
    return fundstellen


def verstaerkungen_anwenden(ton: array, verstaerkung: list[float]) -> int:
    """Wendet eine Verstärkung je Fenster an; Übergänge laufen als lineare Rampe über ein Fenster.
    Gibt die Zahl gedämpfter Fenster zurück."""
    fensteranzahl = len(verstaerkung)
    for index in range(fensteranzahl):
        vorher = verstaerkung[index - 1] if index > 0 else verstaerkung[index]
        jetzt = verstaerkung[index]
        if vorher == 1.0 and jetzt == 1.0:
            continue
        fensteranfang = index * FENSTER_LAENGE
        for schritt in range(FENSTER_LAENGE):
            ton[fensteranfang + schritt] *= vorher + (jetzt - vorher) * schritt / FENSTER_LAENGE
    rest_anfang = fensteranzahl * FENSTER_LAENGE
    if fensteranzahl and verstaerkung[-1] != 1.0:
        for index in range(rest_anfang, len(ton)):
            ton[index] *= verstaerkung[-1]
    return sum(1 for wert in verstaerkung if wert != 1.0)


def ein_und_ausblenden(ton: array) -> None:
    einblenden = int(EINBLENDEN_SEKUNDEN * ABTASTRATE)
    ausblenden = int(AUSBLENDEN_SEKUNDEN * ABTASTRATE)
    for schritt in range(min(einblenden, len(ton))):
        ton[schritt] *= schritt / einblenden
    for schritt in range(min(ausblenden, len(ton))):
        ton[len(ton) - 1 - schritt] *= schritt / ausblenden


def lautheit_messen(pcm_pfad: str, filterkette: str) -> dict:
    ergebnis = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(ABTASTRATE), "-ac", "1", "-i", pcm_pfad,
                               "-af", f"{filterkette}loudnorm=I={ZIEL_LAUTHEIT}:TP={ZIEL_SPITZE}:LRA={ZIEL_LAUTHEITSBEREICH}:print_format=json",
                               "-f", "null", "-"], capture_output=True, text=True, check=True).stderr
    return json.loads(re.findall(r"\{[^{}]*\}", ergebnis)[-1])


def normalisieren_und_speichern(pcm_pfad: str, ausgabe: str, bitrate: str) -> dict:
    """Zweistufige Lautheitsnormalisierung. Vorher wird grob auf die Ziellautheit verstärkt und mit einem Begrenzer
    abgefangen, damit loudnorm linear arbeiten kann (keine Pumpeffekte durch den dynamischen Modus)."""
    vormessung = lautheit_messen(pcm_pfad, "")
    grobe_verstaerkung = ZIEL_LAUTHEIT - float(vormessung["input_i"])
    begrenzer = 10 ** (BEGRENZER_GRENZE_DB / 20)
    vorstufe = f"volume={grobe_verstaerkung:.2f}dB,alimiter=limit={begrenzer:.4f}:attack=5:release=50:level=false,"
    messung = lautheit_messen(pcm_pfad, vorstufe)
    zweiter_durchgang = (f"{vorstufe}loudnorm=I={ZIEL_LAUTHEIT}:TP={ZIEL_SPITZE}:LRA={ZIEL_LAUTHEITSBEREICH}"
                         f":measured_I={messung['input_i']}:measured_TP={messung['input_tp']}"
                         f":measured_LRA={messung['input_lra']}:measured_thresh={messung['input_thresh']}"
                         f":offset={messung['target_offset']}:linear=true:print_format=json,aresample={ABTASTRATE}")
    ergebnis = subprocess.run(["ffmpeg", "-hide_banner", "-y", "-f", "f32le", "-ar", str(ABTASTRATE), "-ac", "1", "-i", pcm_pfad,
                               "-af", zweiter_durchgang, "-ac", "1", "-ar", str(ABTASTRATE), "-b:a", bitrate, ausgabe],
                              capture_output=True, text=True, check=True).stderr
    zweite_messung = json.loads(re.findall(r"\{[^{}]*\}", ergebnis)[-1])
    return {"vorher_lautheit": vormessung["input_i"], "vorher_spitze": vormessung["input_tp"],
            "grobe_verstaerkung_db": round(grobe_verstaerkung, 2), "normalisierung": zweite_messung.get("normalization_type"),
            "nachher_lautheit": zweite_messung.get("output_i"), "nachher_spitze": zweite_messung.get("output_tp")}


def bereinigen(eingabe: str, ausgabe: str, bitrate: str = "96k") -> dict:
    ton = ton_laden(eingabe)
    pegel, hoehenanteil = fenster_messen(ton)
    fenstersekunden = FENSTER_LAENGE / ABTASTRATE

    rauschstoesse = rauschstoesse_finden(pegel, hoehenanteil)
    for erstes_fenster, fenster_danach in rauschstoesse:
        stille_einsetzen(ton, erstes_fenster * FENSTER_LAENGE, min(len(ton), fenster_danach * FENSTER_LAENGE))
        print(f"Rauschstoß {erstes_fenster * fenstersekunden:9.2f} s bis {fenster_danach * fenstersekunden:9.2f} s "
              f"(Spitze {max(pegel[erstes_fenster:fenster_danach]):5.1f} dBFS) -> Stille")

    knackse = knackse_finden(ton)
    for anfang, ende in knackse:
        spitze = max(abs(wert) for wert in ton[anfang:ende])
        stille_einsetzen(ton, anfang, ende)
        print(f"Knacks     {anfang / ABTASTRATE:9.3f} s bis {ende / ABTASTRATE:9.3f} s "
              f"(Spitze {20 * math.log10(max(spitze, 1e-9)):5.1f} dBFS) -> Stille")

    with tempfile.TemporaryDirectory() as arbeitsordner:
        pcm_pfad = str(pathlib.Path(arbeitsordner) / "ton.f32")
        pathlib.Path(pcm_pfad).write_bytes(ton.tobytes())
        verstaerkung_normalisierung = ZIEL_LAUTHEIT - float(lautheit_messen(pcm_pfad, "")["input_i"])
        gate_schwelle = GATE_SCHWELLE_NACH_NORMALISIERUNG - verstaerkung_normalisierung
        pegel_bereinigt, hoehenanteil_bereinigt = fenster_messen(ton)
        geraeusche = isolierte_geraeusche_finden(pegel_bereinigt, GERAEUSCH_SCHWELLE_NACH_NORMALISIERUNG - verstaerkung_normalisierung)
        for erstes_fenster, fenster_danach in geraeusche:
            print(f"Geräusch   {erstes_fenster * fenstersekunden:9.2f} s bis {fenster_danach * fenstersekunden:9.2f} s "
                  f"(Pegel {max(pegel_bereinigt[erstes_fenster:fenster_danach]):5.1f} dBFS) -> Stille")
            stille_einsetzen(ton, erstes_fenster * FENSTER_LAENGE, fenster_danach * FENSTER_LAENGE)
            for index in range(erstes_fenster, fenster_danach):
                pegel_bereinigt[index] = -120.0
        verstaerkung = noise_gate_verstaerkungen(pegel_bereinigt, gate_schwelle)
        atemzuege = atemzuege_daempfen(pegel_bereinigt, hoehenanteil_bereinigt, verstaerkung, verstaerkung_normalisierung)
        print(f"Atemzüge in Sprechpausen: {len(atemzuege)} um {-ATEM_DAEMPFUNG_DB:.0f} dB gedämpft")
        gedaempfte_fenster = verstaerkungen_anwenden(ton, verstaerkung)
        ein_und_ausblenden(ton)
        pathlib.Path(pcm_pfad).write_bytes(ton.tobytes())
        bericht = normalisieren_und_speichern(pcm_pfad, ausgabe, bitrate)

    bericht.update({"rauschstoesse": [(round(anfang * fenstersekunden, 2), round(ende * fenstersekunden, 2)) for anfang, ende in rauschstoesse],
                    "knackse": [(round(anfang / ABTASTRATE, 3), round(ende / ABTASTRATE, 3)) for anfang, ende in knackse],
                    "geraeusche": [(round(anfang * fenstersekunden, 2), round(ende * fenstersekunden, 2)) for anfang, ende in geraeusche],
                    "atemzuege_gedaempft": len(atemzuege),
                    "gate_schwelle_eingang_dbfs": round(gate_schwelle, 1),
                    "gedaempfte_sekunden": round(gedaempfte_fenster * fenstersekunden, 1)})
    print(json.dumps(bericht, ensure_ascii=False))
    return bericht


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    bereinigen(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "96k")
