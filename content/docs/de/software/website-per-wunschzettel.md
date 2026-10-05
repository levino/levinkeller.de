---
title: Website per Wunschzettel
description: Eine Website, die man ändert, indem man aufschreibt, was sich ändern soll. Eine KI setzt es um, man sieht eine Vorschau und gibt mit einem Klick frei.
---

Die meisten Websites kleiner Betriebe und Vereine veralten nicht, weil niemand etwas zu sagen hätte. Sie veralten, weil jede Änderung mühsam ist: Login ins CMS suchen, sich durch Menüs klicken, Angst haben, etwas kaputt zu machen. Oder eine Mail an die Agentur schreiben, ein paar Tage warten und dann die Rechnung bezahlen.

Ich baue Websites deshalb so, dass man sie ändert, indem man aufschreibt, was sich ändern soll. In ganz normalen Worten, auch am Handy.

## So funktioniert es

1. **Wunsch aufschreiben.** Zum Beispiel: „Wir machen vom 22.12. bis 6.1. Betriebsurlaub. Bitte einen Hinweis ganz oben auf die Startseite.“
2. **Die KI setzt es um.** Ein KI-Assistent (Claude) liest den Wunsch, ändert die Website und meldet sich nach ein paar Minuten mit einer kurzen Erklärung zurück.
3. **Vorschau ansehen.** Live ist noch nichts. Man sieht zuerst genau, wie die geänderte Seite aussehen wird, und kann nachbessern lassen.
4. **Freigeben.** Passt alles, reicht ein Klick. Kurz darauf ist die Änderung online.

## Ausprobieren

Die [Tischlerei Nordholz](https://levino.github.io/demo-tischlerei/) ist ein fiktiver Betrieb, an dem man das ansehen kann. Ihre Website wird genau so gepflegt. Alle Wünsche und Änderungen sind öffentlich im [Repository](https://github.com/levino/demo-tischlerei) nachzulesen.

## Warum so

- **Die Website gehört dir.** Texte, Termine und Öffnungszeiten liegen als einfache Textdateien in einem Repository auf GitHub, das dir gehört. Kein Baukasten, aus dem man nicht mehr herauskommt.
- **Jede Änderung ist nachvollziehbar.** Wer wann was geändert hat, ist dokumentiert. Jede Änderung lässt sich zurückdrehen.
- **Erst prüfen, dann veröffentlichen.** Die KI veröffentlicht nie selbst. Ein Mensch sieht die Vorschau und gibt frei.
- **Schnell und sicher.** Die Seiten sind statisch gebaut, mit [Astro](https://astro.build). Es gibt keine Datenbank, keine Plugins und keine Sicherheitsupdates, um die man sich kümmern müsste.
- **Jede KI kann mitarbeiten.** Wer selbst Claude oder ChatGPT nutzt, kann seine Website auch direkt von dort aus ändern lassen.

Für Fotos gibt es ein [Bildarchiv](https://dam.levinkeller.de), in dem zu jedem Bild Urheber, Bildrechte und die Einwilligung der abgebildeten Personen festgehalten sind. Eine Website bindet nur Bilder ein, die für sie freigegeben sind.

## Was es kostet

Das Hosting statischer Seiten ist praktisch kostenlos. Die KI kostet pro Änderung meist deutlich unter einem Euro und wird über ein eigenes Konto bei Anthropic abgerechnet. Teuer ist nur die Einrichtung: Design, Inhalte übernehmen, die Abläufe aufsetzen.

## Was ich gelernt habe

Ich betreibe solche Seiten seit einiger Zeit für Vereine und Ortsverbände. Die Technik trägt. Wer einmal angefangen hat, bekommt Änderungen meist in einer halben Stunde online, oft ohne Rückfrage. Die eigentliche Hürde ist der Anfang: GitHub wirkt zuerst fremd. Man braucht ein Konto und muss sich einmal zurechtfinden. Das ist nicht zu viel verlangt. Wer sich daran gewöhnt hat, spart jedes Mal die Agentur, und eine Anleitung für den Einstieg gibt es [hier](/de/docs/github/get-started).

## Selbst machen

Alles daran ist offen. Wer das für den eigenen Verein oder Betrieb nachbauen will, findet im [Repository der Tischlerei](https://github.com/levino/demo-tischlerei) eine vollständige Vorlage: Astro-Seite, Inhalte als Markdown und YAML, [Claude Code für GitHub](https://github.com/anthropics/claude-code-action), automatische Vorschau pro Änderung und Veröffentlichung über GitHub Pages. Die Datei `CLAUDE.md` enthält die Regeln, an die sich die KI hält.

## Für Unternehmen

Du möchtest so eine Website für deinen Betrieb, willst dich aber nicht selbst um die Technik kümmern? Ich richte sie ein und betreue sie. [Sprich mich an](/de/work).
