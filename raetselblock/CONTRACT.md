# Rätselblock – Vertrag für eine Rätselart

Zielgruppe: hochbegabtes Mädchen, 8 Jahre, rechnet sicher (auch × und ÷, Zahlen bis ~100, Einmaleins),
**kann noch nicht lesen**. Rätsel müssen daher völlig ohne Text auskommen: Zahlen, Rechenzeichen,
Formen, Farben. Regeln liest ein Erwachsener einmal vor; die Beispielseite (Rätsel → Lösung) zeigt sie bildlich.
Sie soll gefordert werden: "schwer" darf wirklich knifflig sein (Denken über mehrere Schritte), aber
**immer logisch ohne Raten lösbar und genau eine Lösung**. Gedruckt wird A4, evtl. schwarz-weiß –
Farbe darf helfen, aber nie die einzige Information sein (Ausnahme: Kronen-Regionen bekommen zusätzlich dicke Grenzen).

Jede Art besteht aus zwei Dateien. `<typ>` ist der Kapitelname, z. B. `zahlenmauern`.

## 1. `generators/<typ>.py`

```python
def generate(level: str, rng: random.Random) -> dict
    # level in {"beispiel", "leicht", "mittel", "schwer"}
    # "beispiel" = kleine, sehr einfache Instanz für die Erklärseite
    # Rückgabe: {"data": {...}, "solution": {...}}  – nur JSON-Typen (dict/list/int/str/bool)
    # Muss garantiert eindeutig lösbar sein (intern mit count_solutions prüfen) und deterministisch
    # aus rng folgen (kein globales random, keine Zeit).

def count_solutions(data: dict, limit: int = 2) -> int
    # Unabhängiger Löser: zählt Lösungen bis `limit`. Wird später zur Verifikation benutzt.
```

- Erlaubte Bibliotheken: Standardbibliothek, `pysat` (python-sat, z. B. `from pysat.solvers import Cadical153`), `itertools`.
- Ein Rätsel sollte in < 2 s erzeugt werden (Ausnahme bis ~10 s für "schwer" ok).
- Relativer Import innerhalb des Pakets: `from .x import y`. Aufruf erfolgt als `generators.<typ>` vom Projektwurzelverzeichnis.

## 2. `typst/types/<typ>.typ` (Typst 0.15)

```typst
#import "../style.typ": *
#let title = "Zahlenmauern"            // kindgerechter deutscher Name
#let rules = [ ... ]                    // 2–4 Sätze zum Vorlesen, Du-Form, Content-Block
#let tip = [ ... ]                      // optional: ein Lösungstipp für Erwachsene
#let layout = (per-page: 2, width: 112mm, example-width: 62mm, solution-width: 40mm)
#let render(p, width: 112mm, solution: false) = { ... }
```

- `p` ist `{"data": ..., "solution": ..., "level": ..., "number": ...}` aus dem JSON.
- `render` muss genau `width` breit sein (Höhe frei) und für jede Breite von 35 mm bis 175 mm gut aussehen:
  alle Größen (Schrift, Striche) relativ zu `width` bzw. Zellgröße berechnen.
- `solution: true` zeigt die Lösung: eingetragene Werte in `sol-color` (blau), vorgegebene bleiben schwarz-fett.
- `per-page` ∈ {1, 2, 4, 6}. Bei 1–2 stehen die Rätsel untereinander (nutzbar je ~178 mm breit, ~115 mm hoch
  bei 2 pro Seite), bei 4 im 2×2-Raster (~85 mm breit, ~115 mm hoch), bei 6 im 2×3-Raster (~85 × ~75 mm).
  `width` so wählen, dass das Rätsel inklusive Höhe in seine Zelle passt! Kinder brauchen Platz zum Schreiben:
  Zellen möglichst ≥ 12 mm.
- `example-width`: Beispiel und Lösung stehen nebeneinander, max. ~80 mm je.
- `solution-width`: Lösungsseiten, mehrere pro Zeile (Spalten = floor(178mm / (w + 8mm))).
- Hilfen aus `style.typ` (bitte lesen und nutzen): `board-grid`, `region-borders`, `given-num`, `sol-num`,
  `sol-color`, `palette/pal`, `pastels/pastel`, `sun`, `moon`, `crown`, `star-shape`, `heart-shape`, `symbol(name, s)`,
  `ink`, `grid-line`. Keine Emoji, keine Symbolfonts – Formen werden gezeichnet. Text-Font kommt global (Inter).
- Keine Texte im Rätsel selbst (sie kann nicht lesen). Zahlen und Rechenzeichen (+ − × ÷ = < >) sind ok.
  Für Rechenzeichen echte Zeichen verwenden: `−` (U+2212), `×`, `÷`.

## Testen

```bash
cd raetselblock
python3 build.py --only <typ1> <typ2> --tag <deinname> --out out/test-<deinname>.pdf
pdftoppm -r 60 -png out/test-<deinname>.pdf /tmp/<deinname>   # dann PNGs mit Read ansehen
```

`build.py` enthält die Kapitel-Liste mit Anzahlen je Stufe (bitte nicht ändern; falls nötig im Bericht vorschlagen).
Immer mit eigenem `--tag` bauen, andere arbeiten parallel. Andere Dateien als die eigenen zwei (plus ggf. eine
eigene Hilfsdatei `generators/<typ>_*.py`) nicht ändern. `style.typ` nicht ändern – fehlt dort etwas, lokal in der
eigenen .typ-Datei definieren.

Fertig ist eine Art, wenn: Seiten visuell geprüft (Beispielseite, Rätselseiten, Lösungen), alle erzeugten Rätsel
per `count_solutions` == 1, und die Schwierigkeitsstufen sich spürbar unterscheiden.
