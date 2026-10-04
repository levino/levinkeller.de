# Rätselblock

Ein druckbarer A4-Rätselblock für Kinder, komplett generiert: Python erzeugt die Rätsel
(jedes per Solver auf **genau eine Lösung** geprüft und ohne Raten lösbar), Typst setzt sie als PDF.

Aktueller Stand: 14 Rätselarten, 108 Rätsel plus je ein Beispiel, 50 Seiten mit Lösungsteil.
Fertiges PDF: [`pdf/raetselblock.pdf`](pdf/raetselblock.pdf)

## Rätselarten

| # | Kapitel | Prinzip | Stufen (leicht → schwer) |
|---|---------|---------|--------------------------|
| 1 | Zahlenmauern | Stein = Summe/Produkt der zwei darunter | 4 Reihen + → 5 Reihen + / 4 Reihen × |
| 2 | Verbinden | Arukone/Numberlink, alle Felder nutzen | 6×6 → 8×8 |
| 3 | Rechenkäfige | KenKen, + − × ÷ | 4×4 → 6×6 |
| 4 | Kronen | Queens/Star Battle | 5×5 → 8×8 |
| 5 | Symbolrätsel | Formen stehen für Zahlen | 3 Formen + − → 4 Formen, Gleichungssysteme |
| 6 | Zahlenpfad | Zip: ein Pfad durch alle Felder, Zahlen in Reihenfolge | 5×5 → 7×7 mit Wänden |
| 7 | Kreuzrechnen | 3×3 Gleichungsgitter, Ziffern 1–9 | + − → + − × ÷ |
| 8 | Sonne & Mond | Tango/Binairo | 6×6, immer weniger Vorgaben |
| 9 | Sudoku | klassisch | 6×6 → 9×9 |
| 10 | Zauberquadrate | magische Quadrate | 3×3 → 4×4 |
| 11 | Größer – Kleiner | Futoshiki | 4×4 → 6×6 |
| 12 | Kreuzsummen | Kakuro | 4×4 → 6×6 Innenbereich |
| 13 | Brücken | Hashi | 7×7 → 10×10 |
| 14 | Bilderrätsel | Nonogramm mit Motiv | 10×10 → 15×15 |

Jedes Kapitel startet mit einer Erklärseite: Regeln zum Vorlesen plus ein gelöstes Beispiel
(Rätsel → Lösung), damit es auch Kinder verstehen, die noch nicht lesen können.
Die Schwierigkeit steht als 1–3 Sterne an jedem Rätsel; vorne gibt es eine „Geschafft!“-Seite zum Ausmalen.

## Bauen

```bash
cd raetselblock
pip install -r requirements.txt     # python-sat, typst
python3 build.py                    # -> pdf/raetselblock.pdf
python3 verify.py                   # prüft alle Rätsel unabhängig auf Eindeutigkeit
```

- `python3 build.py --seed 7` erzeugt einen komplett neuen Block mit gleicher Struktur (Seed 2026 ist der Standard).
- `python3 build.py --only sudoku kronen --tag test --out out/test.pdf` baut nur einzelne Kapitel.
- Schrift: [Inter](https://rsms.me/inter/) (sonst Fallback auf Helvetica/Arial/DejaVu Sans). Eigene Fonts können in `fonts/` liegen.
- Alternativ mit der Typst-CLI, nachdem `build.py --no-pdf` die Daten erzeugt hat:
  `typst compile typst/block.typ pdf/raetselblock.pdf --root .`

## Aufbau

```
build.py             Kapitel-Liste + Anzahlen je Stufe, erzeugt data/block.json und typst/registry.typ, kompiliert PDF
verify.py            unabhängige Eindeutigkeitsprüfung aller Rätsel
CONTRACT.md          Schnittstelle, die jede Rätselart erfüllt (Generator + Renderer)
generators/<typ>.py  generate(level, rng) und count_solutions(data, limit)
typst/style.typ      gemeinsamer Stil und Zeichenhelfer (Formen, Raster, Farben)
typst/types/<typ>.typ  title, rules, tip, layout, render(p, width, solution)
typst/block.typ      Hauptdokument: Titel, Geschafft-Seite, Kapitel, Lösungen
```

Neue Rätselart: siehe [CONTRACT.md](CONTRACT.md) und [CLAUDE.md](CLAUDE.md).
