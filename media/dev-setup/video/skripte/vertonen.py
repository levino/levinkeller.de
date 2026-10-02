"""Vertont das Erklärvideo Szene für Szene mit Gemini TTS (eine Stimme) und misst die Längen.

Aufruf (im Ordner media/dev-setup/video/, ffmpeg auf dem PATH, google-genai installiert):
  python3 skripte/vertonen.py de en          # fehlende oder geänderte Szenen beider Sprachen vertonen
  python3 skripte/vertonen.py en 3 7         # Szene 3 und 7 (EN) neu, auch wenn sich nichts geändert hat
  python3 skripte/vertonen.py de --alle      # alle Szenen neu

Quelle ist skript.<sprache>.md (jede Überschrift `## <Nummer>` eine Szene, Zeilen mit `>` = Bildbeschreibung).
Stimme, Modell und Stil stehen in stimme.json. Ergebnis:
  stimme-roh/<sprache>/szene-NN-<hash>.wav   TTS-Original (nicht eingecheckt; Hash über Text, Stimme, Stil, Modell)
  public/stimme/<sprache>/szene-NN.mp3       bereinigt mit scripts/tts/ton_bereinigen.py
  src/daten/szenen.<sprache>.json            Titel, Text und Sprechdauer je Szene – daraus rechnet der Zeitplan
Der API-Key wird von scripts/tts/gemini_tts.py zur Laufzeit aus der .env im Repo-Root gelesen und nie ausgegeben.
"""
import hashlib
import json
import os
import pathlib
import re
import sys
import time

videoOrdner = pathlib.Path(__file__).resolve().parents[1]
repoWurzel = videoOrdner.parents[2]
einstellungen = json.loads((videoOrdner / "stimme.json").read_text(encoding="utf-8"))
os.environ.setdefault("TTS_MODEL", einstellungen["modell"])
sys.path.insert(0, str(repoWurzel / "scripts" / "tts"))
from gemini_tts import text_vertonen  # noqa: E402
from ton_bereinigen import ABTASTRATE, bereinigen, ton_laden  # noqa: E402


def szenen_lesen(sprache: str) -> list[dict]:
    szenen = []
    for block in re.split(r"^## ", (videoOrdner / f"skript.{sprache}.md").read_text(encoding="utf-8"), flags=re.M)[1:]:
        kopf, *zeilen = block.splitlines()
        treffer = re.match(r"(\d+)\s*·\s*(.+)", kopf)
        if not treffer:
            continue
        text = " ".join(zeile.strip() for zeile in zeilen if zeile.strip() and not zeile.startswith(">"))
        szenen.append({"nummer": int(treffer.group(1)), "titel": treffer.group(2).strip(), "text": text})
    return szenen


def vertone_sprache(sprache: str, nummern: set[int], alleNeu: bool) -> None:
    rohOrdner = videoOrdner / "stimme-roh" / sprache
    zielOrdner = videoOrdner / "public" / "stimme" / sprache
    rohOrdner.mkdir(parents=True, exist_ok=True)
    zielOrdner.mkdir(parents=True, exist_ok=True)
    stil = einstellungen["stilAnweisung"][sprache]
    ergebnis = []
    for szene in szenen_lesen(sprache):
        nummer = szene["nummer"]
        auftrag = f"[{stil}]\n\n{szene['text']}"
        kennung = hashlib.sha256(json.dumps([einstellungen["modell"], einstellungen["stimme"], auftrag]).encode()).hexdigest()[:10]
        rohDatei = rohOrdner / f"szene-{nummer:02d}-{kennung}.wav"
        zielDatei = zielOrdner / f"szene-{nummer:02d}.mp3"
        neu = alleNeu or nummer in nummern or not rohDatei.is_file()
        if neu:
            # Gemini spricht dieselbe Szene mal zügig, mal schleppend. Zu langsame Takes werden neu gewürfelt,
            # behalten wird der schnellste (höchstens einstellungen["hoechstVersuche"] Anläufe).
            woerter = len(szene["text"].split())
            mindestRate = einstellungen["mindestWorteProSekunde"][sprache]
            besteRate = 0.0
            for versuch in range(1, einstellungen["hoechstVersuche"] + 1):
                print(f"[{sprache}] Szene {nummer}: vertonen (Versuch {versuch})", flush=True)
                kandidat = rohDatei.with_suffix(".kandidat.wav")
                rate = woerter / text_vertonen(auftrag, einstellungen["stimme"], kandidat)
                print(f"[{sprache}] Szene {nummer}: {rate:.2f} Wörter/s", flush=True)
                if rate > besteRate:
                    besteRate = rate
                    kandidat.replace(rohDatei)
                time.sleep(3)
                if besteRate >= mindestRate:
                    break
        if neu or not zielDatei.is_file():
            bereinigen(str(rohDatei), str(zielDatei), "96k")
        dauer = round(len(ton_laden(str(zielDatei))) / ABTASTRATE, 3)
        ergebnis.append({**szene, "dauer": dauer})
        print(f"[{sprache}] Szene {nummer}: {dauer:.2f} s", flush=True)
    datei = videoOrdner / "src" / "daten" / f"szenen.{sprache}.json"
    datei.write_text(json.dumps(ergebnis, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[{sprache}] Sprechzeit gesamt: {sum(szene['dauer'] for szene in ergebnis):.1f} s", flush=True)


if __name__ == "__main__":
    argumente = sys.argv[1:]
    sprachen = [argument for argument in argumente if argument in ("de", "en")] or ["de", "en"]
    nummern = {int(argument) for argument in argumente if argument.isdigit()}
    for sprache in sprachen:
        vertone_sprache(sprache, nummern, "--alle" in argumente)
