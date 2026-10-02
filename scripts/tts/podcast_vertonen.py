"""Vertont ein Podcast-Skript (Zeilen `**SPRECHER:** Text`) als Zwei-Sprecher-Dialog mit Gemini TTS.

Aufruf (aus dem Repo-Root, ffmpeg auf dem PATH, google-genai installiert):
    python3 scripts/tts/podcast_vertonen.py media/dev-setup/podcast.de.md public/de/docs/dev-setup/podcast.mp3

Der erste Sprecher im Skript bekommt STIMMEN[0], der zweite STIMMEN[1] – in jeder Sprache dieselben.
Der Dialog wird in feste Abschnitte von BEITRAEGE_JE_ABSCHNITT Redebeiträgen geteilt, jeder einzeln
vertont und mit kurzer Pause zusammengefügt. ton_bereinigen.py entfernt danach die TTS-Artefakte an den
Abschnittsgrenzen, normalisiert auf -16 LUFS und schreibt eine MP3 (mono, 96 kbit/s).

Die Abschnitte bleiben in PODCAST_ARBEITSORDNER (Standard: .tts-arbeit/<skriptname> im Repo-Root, nicht
eingecheckt). Schon vertonte Abschnitte werden bei einem erneuten Aufruf übernommen; ändert sich der Text
eines Abschnitts, wird nur dieser neu vertont (die Datei trägt einen Hash des Texts im Namen)."""
import hashlib
import json
import os
import pathlib
import re
import subprocess
import sys
import time

from gemini_tts import MODELL, REPO_WURZEL, dialog_vertonen
from ton_bereinigen import bereinigen

STIMMEN = ["Puck", "Kore"]
BEITRAEGE_JE_ABSCHNITT = 18
PAUSE_SEKUNDEN = 0.4
PAUSE_ZWISCHEN_ANFRAGEN_SEKUNDEN = 5


def redebeitraege_lesen(skript: pathlib.Path) -> list[tuple[str, str]]:
    beitraege = []
    for zeile in skript.read_text().splitlines():
        treffer = re.match(r"^\*\*([A-ZÄÖÜ]+):\*\*\s*(.+)$", zeile.strip())
        if treffer:
            beitraege.append((treffer.group(1).capitalize(), treffer.group(2).strip()))
    return beitraege


def abschnitte_bilden(beitraege: list, groesse: int) -> list[list]:
    """Feste Blöcke, ein kurzer Rest (weniger als die halbe Größe) kommt zum letzten Abschnitt."""
    abschnitte = [beitraege[start:start + groesse] for start in range(0, len(beitraege), groesse)]
    if len(abschnitte) > 1 and len(abschnitte[-1]) < groesse / 2:
        abschnitte[-2].extend(abschnitte.pop())
    return abschnitte


def main() -> None:
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    skript, ausgabe = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
    beitraege = redebeitraege_lesen(skript)
    sprecher = list(dict.fromkeys(name for name, _ in beitraege))
    if len(sprecher) != 2:
        sys.exit(f"Genau zwei Sprecher erwartet, gefunden: {sprecher}")
    stimmen = dict(zip(sprecher, STIMMEN))
    abschnitte = abschnitte_bilden(beitraege, BEITRAEGE_JE_ABSCHNITT)
    print(f"{skript}: {len(beitraege)} Redebeiträge, {len(abschnitte)} Abschnitte, Modell {MODELL}, Stimmen {stimmen}", flush=True)

    arbeitsordner = pathlib.Path(os.environ.get("PODCAST_ARBEITSORDNER", REPO_WURZEL / ".tts-arbeit" / skript.stem))
    arbeitsordner.mkdir(parents=True, exist_ok=True)
    teildateien = []
    for nummer, abschnitt in enumerate(abschnitte, start=1):
        kennung = hashlib.sha256(json.dumps([MODELL, stimmen, abschnitt]).encode()).hexdigest()[:10]
        teildatei = arbeitsordner / f"abschnitt_{nummer:02d}_{kennung}.wav"
        print(f"Abschnitt {nummer}/{len(abschnitte)}: {len(abschnitt)} Redebeiträge", flush=True)
        if teildatei.is_file() and teildatei.stat().st_size > 0:
            print("  schon vorhanden, wird übernommen", flush=True)
        else:
            if nummer > 1:
                time.sleep(PAUSE_ZWISCHEN_ANFRAGEN_SEKUNDEN)
            dialog_vertonen(abschnitt, stimmen, teildatei)
        teildateien.append(teildatei)

    pause = arbeitsordner / "pause.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                    "-t", str(PAUSE_SEKUNDEN), "-c:a", "pcm_s16le", str(pause)], check=True)
    liste = arbeitsordner / "liste.txt"
    eintraege = []
    for index, teildatei in enumerate(teildateien):
        if index > 0:
            eintraege.append(f"file '{pause}'")
        eintraege.append(f"file '{teildatei}'")
    liste.write_text("\n".join(eintraege) + "\n")
    zusammengefuegt = arbeitsordner / "zusammengefuegt.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(liste),
                    "-ac", "1", "-c:a", "pcm_s16le", str(zusammengefuegt)], check=True)
    ausgabe.parent.mkdir(parents=True, exist_ok=True)
    bereinigen(str(zusammengefuegt), str(ausgabe), "96k")
    print(f"fertig: {ausgabe} ({len(teildateien)}/{len(abschnitte)} Abschnitte)", flush=True)


if __name__ == "__main__":
    main()
