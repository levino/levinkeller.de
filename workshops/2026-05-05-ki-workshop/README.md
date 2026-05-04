# Workshop „KI richtig nutzen" — 5. Mai 2026

Materialien zum Workshop am 5. Mai 2026, 19:00–20:30,
Dorfgemeinschaftshaus Rössing.

Event: <https://xn--rssing-wxa.de/events/2026-05-05-ki-workshop-dorf/>

## Inhalt

| Datei | Zweck | Format |
|-------|-------|--------|
| `drehbuch.typ` | Ablaufplan / Skript für mich (Levin) | Typst |
| `handout.typ` | Druckbares Handout für Teilnehmende | Typst |
| `slides/` | Präsentation für Beamer | Reveal.js (HTML + Markdown) |

## Bauen

### Typst (Drehbuch + Handout)

```bash
typst compile drehbuch.typ
typst compile handout.typ
```

Live-Vorschau beim Bearbeiten:

```bash
typst watch handout.typ
```

### Slides (Reveal.js)

Reveal.js wird über das CDN `unpkg.com` geladen, Version 4.6.1 (passend
zur Dependency in `package.json`). Slides im Browser öffnen:

```bash
cd slides
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

Oder mit jedem anderen statischen Server. Die Folien sind in `slides.md`
geschrieben und werden vom `index.html` zur Laufzeit geladen.

**Speaker Notes** mit `s` öffnen, Vollbild mit `f`, Übersicht mit `o`.

**Offline-Backup** für den Workshop-Abend: vor dem Termin einmal mit
Internet öffnen — Browser-Cache hält dann die Reveal.js-Assets vor.
Alternativ die unpkg-URLs in `index.html` durch Pfade in
`../../../node_modules/reveal.js/` ersetzen und vom Repo-Root aus
servieren.

## Vor dem Termin

- Drehbuch lesen, Phasen-Timing verinnerlichen
- Handout drucken (Auflage 25)
- Slides einmal komplett durchklicken
- Account-Anlage-Demo in jedem der vier Anbieter-Apps testen
- Family-Todo-Demo am Telefon vorbereiten
