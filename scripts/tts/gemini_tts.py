"""Zwei-Sprecher-Vertonung mit Gemini TTS (Paket google-genai).

Der API-Schlüssel (GEMINI_API_KEY) wird zur Laufzeit aus der .env im Repo-Root gelesen
und nie ausgegeben. Modell über TTS_MODEL änderbar."""
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import time

from google import genai
from google.genai import errors, types

REPO_WURZEL = pathlib.Path(__file__).resolve().parents[2]
ENV_DATEI = REPO_WURZEL / ".env"
MODELL = os.environ.get("TTS_MODEL", "gemini-3.8-flash-tts")
MAXIMALE_VERSUCHE = 6


def client_bauen() -> genai.Client:
    if not ENV_DATEI.is_file():
        sys.exit(f"{ENV_DATEI} fehlt")
    eintraege = dict(re.findall(r"^(\w+)=(.*)$", ENV_DATEI.read_text(), re.M))
    if "GEMINI_API_KEY" not in eintraege:
        sys.exit(f"GEMINI_API_KEY nicht in {ENV_DATEI}")
    return genai.Client(api_key=eintraege["GEMINI_API_KEY"].strip().strip('"').strip("'"))


def konfiguration(stimmen: dict[str, str]) -> types.GenerateContentConfig:
    return types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
                types.SpeakerVoiceConfig(speaker=sprecher, voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=stimme)))
                for sprecher, stimme in stimmen.items()])))


def dialog_vertonen(beitraege: list[tuple[str, str]], stimmen: dict[str, str], ausgabe: pathlib.Path) -> float:
    """Vertont eine Folge von (Sprecher, Text), schreibt eine WAV (mono) und gibt die Dauer in Sekunden zurück.
    Wiederholt bei Fehlern mit wachsender Wartezeit (Rate-Limits, 5xx, Netz)."""
    client = client_bauen()
    teile = [types.Part(text=text, speech_metadata=types.SpeechMetadata(speaker=sprecher)) for sprecher, text in beitraege]
    for versuch in range(1, MAXIMALE_VERSUCHE + 1):
        try:
            antwort = client.models.generate_content(model=MODELL, contents=[types.Content(role="user", parts=teile)],
                                                     config=konfiguration(stimmen))
            audio = antwort.candidates[0].content.parts[0].inline_data
            if not audio or not audio.data:
                raise ValueError("Antwort ohne Audiodaten")
            break
        except (errors.APIError, ValueError, AttributeError, IndexError, TypeError, ConnectionError, TimeoutError) as fehler:
            meldung = str(fehler)[:300]
            if versuch == MAXIMALE_VERSUCHE:
                sys.exit(f"Vertonung endgültig fehlgeschlagen: {meldung}")
            wartezeit = 20 * 2 ** (versuch - 1)
            print(f"  Versuch {versuch} fehlgeschlagen ({meldung}), neuer Versuch in {wartezeit} s", flush=True)
            time.sleep(wartezeit)
    treffer = re.search(r"rate=(\d+)", audio.mime_type or "")
    abtastrate = int(treffer.group(1)) if treffer else 24000
    with tempfile.NamedTemporaryFile(suffix=".pcm") as pcm_datei:
        pcm_datei.write(audio.data)
        pcm_datei.flush()
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", str(abtastrate), "-ac", "1",
                        "-i", pcm_datei.name, "-ac", "1", "-ar", "24000", "-c:a", "pcm_s16le", str(ausgabe)], check=True)
    dauer = len(audio.data) / 2 / abtastrate
    print(f"  {ausgabe.name}: {dauer:.1f} s, {antwort.usage_metadata.total_token_count if antwort.usage_metadata else '?'} Tokens",
          flush=True)
    return dauer
