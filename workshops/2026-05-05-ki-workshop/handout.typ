// Handout zum Workshop "KI richtig nutzen"
// Dorfgemeinschaftshaus Rössing, 5. Mai 2026
//
// Kompilieren: typst compile handout.typ
// Druckhinweis: A4, beidseitig, in Schwarz-Weiß noch lesbar

#set document(title: "Handout — KI richtig nutzen", author: "Levin Keller")
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.5cm), numbering: "1 / 1")
#set text(lang: "de", size: 10pt, font: "New Computer Modern")
#set par(justify: true, leading: 0.65em)

#show heading.where(level: 1): it => [
  #set text(size: 16pt, weight: "bold")
  #pad(top: 0.4em, bottom: 0.2em)[#it]
]
#show heading.where(level: 2): it => [
  #set text(size: 12pt, weight: "bold", fill: rgb("#2a4d6e"))
  #pad(top: 0.5em, bottom: 0.1em)[#it]
]
#show heading.where(level: 3): it => [
  #set text(size: 10pt, weight: "bold")
  #pad(top: 0.3em, bottom: 0.05em)[#it]
]

#let kasten(title, body) = {
  block(
    fill: rgb("#f5f5f5"),
    stroke: 0.5pt + rgb("#ccc"),
    inset: 8pt,
    radius: 3pt,
    width: 100%,
    [
      #text(weight: "bold")[#title]\
      #v(0.2em)
      #body
    ],
  )
}

#let prompt(body) = {
  block(
    fill: rgb("#1e1e1e"),
    inset: 8pt,
    radius: 3pt,
    width: 100%,
    [#set text(font: "DejaVu Sans Mono", size: 9pt, fill: rgb("#eee"))
    #body],
  )
}

// Titel
#align(center)[
  #text(size: 22pt, weight: "bold")[KI richtig nutzen]\
  #v(0.2em)
  #text(size: 11pt)[Handout zum Workshop · 5. Mai 2026 · Dorfgemeinschaftshaus Rössing]\
  #v(0.1em)
  #text(size: 9pt, fill: gray)[Levin Keller · post\@levinkeller.de · levinkeller.de]
]

#v(0.5em)
#line(length: 100%, stroke: 0.5pt + gray)

= In aller Kürze

KI-Sprachmodelle sind Programme, die aus Milliarden Texten gelernt haben, was
auf eine Frage am wahrscheinlichsten als Antwort folgt. Sie ersetzen keinen
Profi, aber sie sind ein _erstaunlich kompetenter_ Begleiter für den Alltag:
beim Schreiben, Verstehen, Übersetzen, Erklären und Recherchieren. Wer früh
übt, gewinnt Zeit und Spielraum.

#kasten("Drei Faustregeln")[
  + *Vertraue, aber prüfe.* KI kann falsch liegen, ohne es zu merken.
  + *Keine Geheimnisse.* Passwörter, IDs und sensible Daten Dritter haben in
    keiner Eingabe etwas zu suchen.
  + *Sprich, schreib, zeig.* Der Sprachmodus und das Hochladen von Fotos sind
    oft praktischer als Tippen.
]

= Welche KI für wen?

#table(
  columns: (auto, 1fr, 1fr, auto),
  stroke: 0.5pt + gray,
  inset: 5pt,
  [*Anbieter*], [*Wofür gut*], [*Tipp*], [*Preis ab*],
  [ChatGPT], [Allzweck, Bilder, Sprache, App weit verbreitet], [chat.openai.com], [Frei / 23 €],
  [Claude], [Lange Texte, Schreiben, sorgfältige Antworten], [claude.ai], [Frei / 18 €],
  [Mistral Le Chat], [Europäisch, schnell, datenschutzfreundlich], [chat.mistral.ai], [Frei / 14,99 €],
  [Gemini], [Google-Welt, Suche, Bilder], [gemini.google.com], [Frei / via Google One],
)

#text(size: 9pt, fill: gray)[
  Stand der Preise: April 2026. Alle vier Anbieter haben kostenlose Tarife mit
  Tageslimits, die für den Einstieg ausreichen.
]

= Konto in 5 Minuten

== Auf dem Telefon
+ App Store / Play Store öffnen
+ „ChatGPT" / „Claude" / „Le Chat" / „Gemini" suchen, installieren
+ App öffnen → mit E-Mail oder Google/Apple registrieren
+ Bestätigungsmail abrufen (auch Spam-Ordner prüfen)
+ Fertig — der Sprachknopf in der Mitte ist dein bester Freund

== Im Browser
+ Adresse aus Tabelle oben aufrufen
+ „Sign up" / „Anmelden" → E-Mail-Adresse oder Google/Apple
+ Bestätigen, einloggen
+ Eingabefeld unten — losschreiben

#kasten("Häufige Stolperfallen")[
  - *Bestätigungsmail kommt nicht* → Spam-Ordner prüfen, Adresse korrekt?
  - *Telefonnummer wird verlangt* (ChatGPT) → Festnetz oder Handy, einmalig
  - *„Du bist zu jung"* → Mindestalter beachten (meist 13–18 je nach Land)
  - *Limit erreicht* → Warten (Limit erneuert sich) oder anderen Anbieter nutzen
]

#pagebreak()

= Gute Prompts schreiben

Ein Prompt ist die Frage oder der Auftrag, die du der KI stellst. Je klarer
und vollständiger, desto besser die Antwort. Drei Bausteine:

+ *Rolle* — wer soll antworten? („Du bist eine erfahrene Steuerberaterin…")
+ *Aufgabe* — was soll getan werden? (Brief schreiben, erklären, übersetzen)
+ *Kontext* — was muss die KI wissen? (Adressat, Tonfall, Länge, Stilregeln)

== Vorlage

#prompt[
Du bist \[Rolle\].
Hilf mir bei \[Aufgabe\].
Hintergrund: \[Kontext\].
Gewünschte Länge: \[z.B. eine halbe Seite\].
Tonfall: \[freundlich / förmlich / locker\].
]

== Beispiele zum Mitnehmen

=== Brief an die Vermieterin

#prompt[
Du bist eine erfahrene Mieterberatung. Schreibe einen freundlichen,
aber bestimmten Brief an meine Vermieterin. Die Heizung in der Küche
funktioniert seit drei Wochen nicht. Ich habe sie zweimal angerufen,
ohne Erfolg. Bitte mit Frist von 14 Tagen.
]

=== Behördenschreiben verstehen (mit Foto)

#prompt[
Ich habe diesen Brief vom Bauamt fotografiert. Erkläre mir in
einfachen Worten: Was wird von mir gewollt, bis wann, und welche
Folgen drohen, wenn ich nichts tue?
]

=== Rezept aus Resten

#prompt[
Ich habe folgende Reste im Kühlschrank: 2 Möhren, Reis, ein halbes
Hähnchen, eine Dose Mais. Schlag mir drei einfache Gerichte vor,
die in 30 Minuten fertig sind.
]

=== Übersetzung mit Anpassung

#prompt[
Übersetze diese E-Mail ins Polnische. Höflich, aber nicht zu förmlich.
Behalte die Aufzählung bei.
]

=== Recherche mit Quellen

#prompt[
Was sind die Voraussetzungen für eine Photovoltaik-Anlage auf dem
Dach in Niedersachsen? Bitte mit Quellen und Stand der Information.
]

#kasten("Profi-Tipp: Dialog statt Einzelfrage")[
  Eine KI-Antwort gefällt dir nicht? Schreib einfach zurück, was dich
  stört: „Mach den Brief kürzer." „Klingt zu höflich, etwas direkter."
  „Erkläre mir Punkt 3 nochmal." — Die KI passt an.
]

= Datenschutz

== Was geht in Ordnung
- Allgemeines Wissen: Geschichte, Wissenschaft, Hobby, Garten
- Eigene Texte umschreiben, kürzen, übersetzen
- Behördenpost _verstehen_ (Klarnamen Dritter geschwärzt)
- Reisen, Rezepte, Programmiertipps
- Zusammenfassungen aus eigenen Texten

== Was draußen bleibt
- Passwörter, PINs, TANs, Zugangsdaten
- Vollständige Personal- oder Steueridentifikationsnummern
- Medizinische Befunde mit Klarnamen
- Vertrauliche Geschäftsdokumente ohne Freigabe
- Daten Dritter (Verwandte, Kund:innen), die nicht zugestimmt haben

== Training abschalten

In allen vier Apps lässt sich abschalten, dass deine Eingaben zum Training
verwendet werden. Suchstichworte in den Einstellungen:

- ChatGPT: Einstellungen → *Datenkontrolle* → „Modell verbessern" aus
- Claude: standardmäßig _kein_ Training auf Nutzer:innen-Daten
- Mistral Le Chat: Einstellungen → *Privatsphäre* → Training aus
- Gemini: über _Activity_ einstellbar

#kasten("Goldener Satz")[
  Stell dir vor, deine Eingabe steht morgen auf der Titelseite der
  Lokalzeitung. Wäre das okay? Wenn nein: nicht eingeben.
]

#pagebreak()

= Was sonst noch geht

== Sprachmodus
Auf Telefon und Tablet einfach den Hörer- oder Mikrofonknopf drücken und
losreden. Praktisch beim Spazierengehen, Kochen, Auto (über Bluetooth).

== Bilder verstehen
Foto in der App hochladen oder direkt aufnehmen. Funktioniert mit
Pflanzen, Gerichten, Bedienungsanleitungen, Schaltplänen, Fahrkarten,
Speisekarten in fremden Sprachen.

#text(weight: "bold")[Achtung:] Bei _medizinischen_ Bildern, _Pilzen_ und
_Sicherheitsfragen_ (z.B. Elektroinstallation) immer einen Fachmenschen
hinzuziehen. KI ist Hilfe, nicht Ersatz.

== Bilder erzeugen
ChatGPT, Gemini und Mistral können auch Bilder erstellen. Geburtstagskarten,
Illustrationen für Vorträge, Skizzen.

== Spracheingabe für Apps mit MCP
Eine neue Technik („Model Context Protocol") erlaubt es, mit der eigenen
KI direkt mit Apps zu sprechen — z.B. Aufgaben anlegen, Termine eintragen,
Daten suchen. Beispiele aus meinen Projekten:

- *Family Todo* — Familien-Aufgabenplaner per Sprache füllen\
  → docs.todos.levinkeller.de
- *Verleihplattform Rössing* — Werkzeuge in der Nachbarschaft mieten\
  → mieten.rössing.de
- *Nordstemmen-Connector* — Fragen zu Rats- und Haushaltsdokumenten\
  → nordstemmen-mcp.levinkeller.de

#kasten("Wenn du selbst etwas bauen willst")[
  Mit Werkzeugen wie Claude Code kannst du heute schon ohne klassische
  Programmierkenntnisse kleine Webseiten und Apps bauen. Ich biete eine
  Coding-Class an, in der Kinder und Erwachsene das ausprobieren können
  → coding-class.levinkeller.de
]

= Übungen für zuhause

Nach diesem Workshop in den nächsten 7 Tagen ausprobieren — eine Übung
pro Tag reicht.

+ *Tag 1* — Schreibe einen Brief, den du sowieso schon lange schreiben
  wolltest, mit KI-Hilfe.
+ *Tag 2* — Lass dir ein Behördenschreiben oder einen Vertrag in einfache
  Sprache übersetzen.
+ *Tag 3* — Fotografiere drei Pflanzen im Garten und lass dir sagen, was
  sie sind.
+ *Tag 4* — Plane deine nächste Reise mit der KI als Reisebüro.
+ *Tag 5* — Probier den Sprachmodus beim Spazierengehen aus. Frag, was
  dich seit langem interessiert.
+ *Tag 6* — Lass dir einen unbekannten Begriff aus den Nachrichten erklären
  und Quellen geben. Klick die Quellen an.
+ *Tag 7* — Schreib mir, was du gelernt hast: post\@levinkeller.de

= Weiterführende Links

- *Diese Materialien*: levinkeller.de/de/blog (kommt nach dem Workshop)
- *Meine Projekte*: levinkeller.de/de/work
- *Dorfwebseite Rössing*: rössing.de
- *Kontakt*: post\@levinkeller.de

#v(0.8em)
#line(length: 100%, stroke: 0.5pt + gray)
#v(0.3em)

#align(center)[
  #text(size: 9pt, fill: gray)[
    Wenn dir der Abend etwas gebracht hat: eine Spende für Saalmiete und
    Getränke ist willkommen. — Danke fürs Mitmachen!
  ]
]
