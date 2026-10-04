# Rätselblock – Hinweise für Claude Code

Dieses Unterprojekt ist unabhängig vom Astro-Teil des Repos (eigenes Python/Typst-Tooling,
kein npm). Die Root-`CLAUDE.md` (Biome, Astro) betrifft es nicht.

## Worum es geht

Ein druckbarer A4-Rätselblock für Levins Tochter: **8 Jahre, hochbegabt, rechnet sicher
(auch × und ÷, Einmaleins, Zahlen bis ~100+), kann aber noch nicht lesen.** Daraus folgen die
Grundregeln, an die sich jede Änderung halten muss:

1. **Kein Text in Rätseln.** Nur Zahlen, Rechenzeichen, Formen, Farben. Regeln liest ein
   Erwachsener vor (`rules` im Typ), die Erklärseite zeigt ein gelöstes Beispiel.
2. **Genau eine Lösung**, geprüft per vollständigem Solver (`count_solutions`, meist SAT via pysat
   oder Backtracking), plus **ohne Raten lösbar**: die meisten Generatoren haben einen
   Logiklöser, der die Stufe bestimmt.
3. **Wirklich fordernd:** „schwer“ soll knifflig sein (mehrschrittiges Denken), nicht nur größer.
4. **Druckbar:** A4, auch schwarz-weiß verständlich (Farbe nie die einzige Information),
   Zellen groß genug zum Hineinschreiben (≥ ~12 mm).
5. Formen werden in Typst gezeichnet (`style.typ`), keine Emoji/Symbolfonts.

## Setup

```bash
cd raetselblock
pip install -r requirements.txt          # in Cloud-Sessions ggf. --break-system-packages
python3 build.py && python3 verify.py
```

Zum visuellen Prüfen (unbedingt machen nach Layout-Änderungen):

```bash
pdftoppm -r 50 -png pdf/raetselblock.pdf /tmp/p    # PNGs dann mit dem Read-Tool ansehen
```

## Arbeitsweise

- Schnittstelle je Rätselart: `CONTRACT.md` (verbindlich). Generator in `generators/<typ>.py`,
  Renderer in `typst/types/<typ>.typ`. Neue Art = beide Dateien + Eintrag in `CHAPTERS` in `build.py`.
- `build.py` erzeugt `data/block.json` und `typst/registry.typ` (beide generiert, nicht eingecheckt).
- Für parallele/teilweise Builds `--tag` nutzen, dann landen Daten in `data/block-<tag>.json`.
- Alles ist deterministisch über `--seed` (Standard 2026). Generatoren dürfen nur den übergebenen
  `rng` nutzen.
- Nach jeder Generator-Änderung: `python3 verify.py` muss 100 % eindeutig melden.
- Das eingecheckte `pdf/raetselblock.pdf` ist die aktuelle Druckversion – nach Änderungen neu bauen
  und mit committen. Test-PDFs mit `--out out/…` bauen, `out/` wird nicht committet.
- Python-Stil: einfache Module, Standardbibliothek + pysat. Typst-Version 0.15 (`curve`, `sys.inputs`).

## Stand und offene Ideen

Erledigt: 14 Rätselarten, 108 Rätsel + 14 Beispiele, 50 Seiten (Seed 2026), alle verifiziert.

Bekannte Schwächen / nächste Schritte:
- **Zahlenpfad mittel** unterscheidet sich von leicht vor allem durch Größe, kaum durch neue Logik.
- **Kreuzsummen leicht** hat wenig Muster-Vielfalt (nur 6 gültige Muster bei 4×4 und Streifen ≤ 3).
- **Bilderrätsel**: Pool mit 16 handgezeichneten Motiven (`generators/bilderraetsel.py`) – bei neuen
  Seeds wiederholen sich Motive. Neue Motive müssen der Line-Solver vollständig lösen können.
- **Rechenkäfige**: Stufen nach nötigen Techniken, nicht von Hand durchgelöst – ggf. Feinschliff.
- Ideen: „Mach die 24“, Zahlendreiecke, ein zweiter Block mit anderem Seed, ein Wochenblatt-Modus
  (jede Seite ein Mix), Einbindung als Download-Seite auf levinkeller.de.
- Rückmeldung der Tochter einarbeiten: welche Arten machen Spaß, wo ist es zu leicht/zu schwer?
  Die Anzahlen je Stufe stehen in `CHAPTERS` in `build.py`.

Hintergrund: Auslöser war ein „Verbinden“-Rätsel (Seite 45) aus einem gekauften Rätselbuch, das nach
Prüfung mit dem Solver unter der Regel „alle Kästchen nutzen“ **keine** Lösung hat (mindestens ein
Feld bleibt frei).
