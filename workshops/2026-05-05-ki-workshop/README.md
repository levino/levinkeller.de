# Workshop „KI richtig nutzen" — 5. Mai 2026

Materialien zum Workshop am 5. Mai 2026, 19:00–20:30,
Dorfgemeinschaftshaus Rössing.

Event: <https://xn--rssing-wxa.de/events/2026-05-05-ki-workshop-dorf/>

## Inhalt

Quellen:

| Datei | Zweck |
|-------|-------|
| `drehbuch.typ` | Ablaufplan / Skript für mich (Levin) |
| `handout.typ` | Druckbares Handout für Teilnehmende |

Generierte Assets liegen unter `public/workshops/2026-05-05-ki-workshop/`
und werden auf der Webseite unter `/workshops/2026-05-05-ki-workshop/`
ausgeliefert. Die Slides (HTML + Markdown) leben direkt dort, weil sie
keinen Build-Schritt brauchen.

## PDFs aus den Typst-Quellen bauen

```bash
typst compile workshops/2026-05-05-ki-workshop/drehbuch.typ \
  public/workshops/2026-05-05-ki-workshop/drehbuch.pdf

typst compile workshops/2026-05-05-ki-workshop/handout.typ \
  public/workshops/2026-05-05-ki-workshop/handout.pdf
```

Live-Vorschau beim Bearbeiten:

```bash
typst watch workshops/2026-05-05-ki-workshop/handout.typ
```

## Slides lokal anschauen

Reveal.js wird über das CDN `unpkg.com` geladen, Version 4.6.1 (passend
zur Dependency in `package.json`).

```bash
cd public/workshops/2026-05-05-ki-workshop/slides
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

**Speaker Notes** mit `s` öffnen, Vollbild mit `f`, Übersicht mit `o`.

**Offline-Backup** für den Workshop-Abend: vor dem Termin einmal mit
Internet öffnen — Browser-Cache hält dann die Reveal.js-Assets vor.

## Vor dem Termin

- Drehbuch lesen, Phasen-Timing verinnerlichen
- Handout drucken (Auflage 25)
- Slides einmal komplett durchklicken
- Account-Anlage-Demo in jedem der vier Anbieter-Apps testen
- Family-Todo-Demo am Telefon vorbereiten
