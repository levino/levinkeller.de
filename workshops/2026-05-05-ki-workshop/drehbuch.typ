// Drehbuch zum Workshop "KI richtig nutzen"
// Dorfgemeinschaftshaus Rössing, 5. Mai 2026, 19:00–20:30
//
// Kompilieren: typst compile drehbuch.typ
// Live-Vorschau: typst watch drehbuch.typ

#set document(title: "Drehbuch — KI richtig nutzen", author: "Levin Keller")
#set page(paper: "a4", margin: 2cm, numbering: "1 / 1")
#set text(lang: "de", size: 11pt, font: "New Computer Modern")
#set par(justify: true, leading: 0.7em)
#show heading.where(level: 1): it => [
  #set text(size: 18pt, weight: "bold")
  #pad(top: 0.6em, bottom: 0.3em)[#it]
]
#show heading.where(level: 2): it => [
  #set text(size: 13pt, weight: "bold")
  #pad(top: 0.8em, bottom: 0.2em)[#it]
]
#show heading.where(level: 3): it => [
  #set text(size: 11pt, weight: "bold", style: "italic")
  #pad(top: 0.4em, bottom: 0.1em)[#it]
]

#let phase(zeit, dauer, titel) = {
  block(
    fill: rgb("#f0f0f0"),
    inset: 8pt,
    radius: 3pt,
    width: 100%,
    [#text(weight: "bold")[#zeit] · #text(fill: gray)[#dauer] · #text(weight: "bold")[#titel]],
  )
}

#let regie(content) = {
  block(
    stroke: (left: 2pt + rgb("#888")),
    inset: (left: 8pt, top: 4pt, bottom: 4pt),
    [#text(style: "italic", fill: rgb("#555"))[Regie: ] #content],
  )
}

#align(center)[
  #text(size: 22pt, weight: "bold")[Drehbuch: KI richtig nutzen]\
  #v(0.3em)
  #text(size: 12pt)[Workshop · 5. Mai 2026 · 19:00–20:30 · Dorfgemeinschaftshaus Rössing]
]

#v(1em)

= Vor dem Workshop

== Material und Technik

- Beamer + HDMI-Kabel + Adapter (USB-C, Mini-DisplayPort)
- Laptop mit geladener Präsentation, Slides offline verfügbar
- Mobiler Hotspot als Backup, falls WLAN im DGH nicht trägt
- Verlängerungskabel, Mehrfachsteckdose
- Ausgedruckte Handouts (Auflage: 25)
- Whiteboard oder Flipchart, Stifte
- Wasser für mich, Getränke + Knabberkram für Gäste
- Spendendose mit Hinweisschild
- Telefon mit ChatGPT, Claude, Mistral, Gemini App vorinstalliert (für Live-Demo)
- Familien-Todo-Account vorbereitet, MCP-Connector schon einmal eingerichtet

== Ankunft

- 18:00 vor Ort sein
- Stuhlreihen kreisförmig oder im U stellen, niemand sitzt im Rücken
- Beamer testen, Slides einmal komplett durchklicken
- Audio testen (auch falls Video gezeigt wird)
- Handouts auf den Stühlen verteilen
- Anmeldeliste am Eingang

= Ablauf

#phase[19:00][5 min][Phase 1 · Begrüßung & Erwartungen]

== Begrüßung

#regie[Stehe vorne, locker. Warte bis es ruhig ist. Lächle.]

„Schön, dass ihr da seid. Mein Name ist Levin Keller, ich wohne mit meiner Familie in Rössing, bin Software-Entwickler und arbeite seit Jahren intensiv mit KI — beruflich, in der Kommunalpolitik und im Alltag.

Heute Abend möchte ich euch zeigen, dass KI weder Hexerei noch Bedrohung ist, sondern ein Werkzeug, das uns Zeit, Möglichkeiten und Spielräume schenkt — wenn man es zu nutzen weiß. In 90 Minuten machen wir gemeinsam die ersten Schritte."

== Erwartungen abfragen

#regie[Kurze Runde, höchstens 1 Satz pro Person. Nicht ausarten lassen. Auf Flipchart Stichworte notieren.]

Frage: „Was wollt ihr heute mitnehmen?" oder „Was nervt euch an dem Thema KI bisher am meisten?"

Häufige Antworten — schon mal innerlich vorbereiten:
- „Ich verstehe nicht, wofür das gut sein soll."
- „Datenschutz, ich will nicht, dass alles bei OpenAI landet."
- „Mein Kind/Enkel benutzt das ständig, ich will mitreden können."
- „Ich habe Angst, dass mein Job wegfällt."

#phase[19:05][20 min][Phase 2 · Was ist KI? Welche gibt es? Was kostet sie?]

== Was ist ein Sprachmodell? (5 min)

Kernbotschaft: Ein Sprachmodell ist ein Programm, das aus sehr vielen Texten gelernt hat, was als Nächstes wahrscheinlich folgt. Es _versteht_ nicht im menschlichen Sinn, aber es _produziert_ erstaunlich brauchbare Antworten.

#regie[Analogie verwenden: „Wie ein extrem belesener Praktikant, der schnell und höflich antwortet, aber gelegentlich überzeugend Unsinn erzählt. Daher: vertrauen, aber prüfen."]

Wichtig nicht zu vergessen:
- KI ist _kein_ Suchmotor. Sie zitiert nicht zwingend Quellen.
- KI kann _halluzinieren_ — kurz erklären: erfundene Fakten, die plausibel klingen.
- KI hat einen Wissensstand mit Stichtag (z.B. Anfang 2026).

== Die vier wichtigsten Anbieter (10 min)

#regie[Slide mit Logos zeigen. Pro Anbieter 2 Sätze. Nicht in technische Tiefe gehen.]

#table(
  columns: (auto, 1fr, 1fr),
  stroke: 0.5pt + gray,
  inset: 6pt,
  [*Anbieter*], [*Stärken*], [*Kosten*],
  [ChatGPT (OpenAI, USA)], [Riesige Bekanntheit, gute App, Bilder, Sprachausgabe], [Frei mit Limits, Plus 23 €/Monat],
  [Claude (Anthropic, USA)], [Sehr gute Texte, längere Dokumente, Sicherheitsfokus], [Frei mit Limits, Pro 18 €/Monat],
  [Mistral Le Chat (FR)], [Europäisch, schnell, datenschutzfreundlicher], [Frei großzügig, Pro 14,99 €/Monat],
  [Gemini (Google, USA)], [Integration in Google-Welt, Bilder, Suche], [Frei, Advanced via Google One],
)

#regie[Klar sagen: „Ich empfehle euch, mit dem _kostenlosen_ Tarif anzufangen. Erst wenn ihr merkt, dass ihr regelmäßig an Limits stoßt, lohnt sich ein Bezahltarif."]

Persönliche Empfehlung als Einstieg:
- Wer nichts installieren mag → ChatGPT im Browser
- Wer Wert auf europäischen Anbieter legt → Mistral Le Chat
- Wer ohnehin Google nutzt → Gemini
- Wer schreibt und denkt → Claude

== Wo läuft das? (5 min)

- Browser auf dem Laptop: alles geht, kein Download nötig
- App auf Telefon/Tablet: bequemer, oft mit Spracheingabe
- Sprachmodus: einfach reden, statt tippen — _für viele die wichtigste Funktion_

#regie[Kurz live demonstrieren: ChatGPT-App öffnen, Sprachknopf drücken, eine Frage stellen ("Wie wird das Wetter morgen in Rössing?"). Die Begeisterung im Raum nutzen.]

#phase[19:25][25 min][Phase 3 · Hands-on: Konto anlegen & erste Prompts]

== Konto anlegen (10 min)

#regie[Slide mit Schritt-für-Schritt-Anleitung. Langsam vorlesen. Helfer:innen (falls vorhanden) gehen durch die Reihen. Geduld. Niemand bleibt zurück.]

Empfehlung an die Gruppe: „Wer noch keinen Account hat, legt sich jetzt einen bei _einem_ Anbieter an. Welcher ist egal — ihr könnt später einfach noch andere ausprobieren."

Schritte am Beispiel ChatGPT:
+ chat.openai.com aufrufen, oder die App aus dem App Store / Play Store installieren
+ E-Mail eingeben, Code aus Mail bestätigen
+ Optional: mit Google- oder Apple-Konto anmelden (schneller)
+ Zustimmung zu Nutzungsbedingungen lesen — die wichtigsten Punkte gleich gemeinsam

#regie[Häufige Stolperfallen ansprechen, _bevor_ jemand fragt: Bestätigungsmail im Spam, Telefonnummer wird verlangt (ChatGPT), Altersangabe.]

== Erste Prompts gemeinsam (15 min)

#regie[Drei Prompts, die wir gemeinsam ausprobieren. Jeden Prompt zuerst auf der Folie zeigen, dann eintippen lassen, dann ein paar Antworten vorlesen lassen. Reaktionen einsammeln, kurz besprechen.]

=== Prompt 1 — Alltag

```
Erkläre mir in einfachen Worten, was eine Patientenverfügung ist
und welche fünf Punkte ich vor dem Schreiben bedenken sollte.
```

Lernziel: KI als geduldigen Erklärer erleben. Keine Scham, „dumme" Fragen zu stellen.

=== Prompt 2 — Schreiben

```
Schreibe einen freundlichen, aber bestimmten Brief an meinen
Vermieter. Die Heizung in der Küche funktioniert seit drei Wochen
nicht. Ich habe ihn schon zweimal angerufen, ohne Erfolg. Bitte
mit Frist von 14 Tagen.
```

Lernziel: KI als Schreibhilfe. Wir lesen mehrere Antworten vor und merken: alle sind anders, alle sind brauchbar.

=== Prompt 3 — Bilder

#regie[Foto von einem Pflanzenblatt im Garten zeigen oder vom Display abfotografieren lassen. In ChatGPT/Claude hochladen.]

```
Was ist das auf dem Foto? Ist die Pflanze gesund?
```

Lernziel: KI „sieht" Bilder. Alltagspraktisch: Pflanzen, Pilze (mit Vorsicht!), Gerichte, Bedienungsanleitungen.

#regie[Wichtige Warnung aussprechen: „Bei Pilzen, Medikamenten und Gesundheit immer Profis fragen. KI ist Hilfe, kein Ersatz."]

#phase[19:50][15 min][Phase 4 · Datenschutz nüchtern betrachtet]

== Was passiert mit meinen Daten?

#regie[Slide mit drei Spalten. Sachlich bleiben, nichts beschönigen, aber auch nicht dämonisieren.]

Drei Fragen, die jede:r sich stellen sollte:

+ *Wo wird die Anfrage verarbeitet?* — Bei den meisten US-Anbietern in den USA, bei Mistral in Europa.
+ *Werden meine Eingaben zum Training verwendet?* — Bei kostenlosen Tarifen oft ja, bei Bezahltarifen meist abschaltbar.
+ *Wer könnte das später lesen?* — Mitarbeitende des Anbieters (theoretisch), bei Sicherheitsvorfällen auch andere.

== Praktische Faustregeln

Was ist okay:
- Allgemeine Fragen, Erklärungen, Zusammenfassungen
- Eigene Texte verbessern lassen
- Gerichte, Reisen, Hobby
- Behördenpost _verstehen_ lassen (ohne Klarnamen anderer Personen)

Was nicht okay ist:
- Zugangsdaten, Passwörter, PINs
- Vollständige Personalausweise, Steuer-IDs
- Medizinische Befunde mit Klarnamen
- Vertrauliche Geschäftsdokumente ohne Freigabe
- Daten Dritter, die nicht zugestimmt haben

== Praktische Einstellungen zeigen

#regie[Live in den ChatGPT-Einstellungen: „Datenkontrolle" → Training abschalten. Bei Claude: vorinstalliert, kein Training. Bei Mistral: ähnlich.]

#phase[20:05][15 min][Phase 5 · Praxisbeispiele für den Alltag]

#regie[Hier wird es lebendig. Ich erzähle aus eigenen Anwendungen, die Leute sehen, dass das wirklich nützt.]

== Beispiel 1 — Behördenpost verstehen

„Letztes Jahr kam ein Brief vom Bauamt — drei Seiten Juristendeutsch. Foto in die KI, Frage: ‚Was will dieses Schreiben von mir, in einfacher Sprache?' — Antwort kam in 10 Sekunden. Hat mir eine halbe Stunde Stirnrunzeln gespart."

== Beispiel 2 — Texte aufsetzen

„Für die Verleihplattform in Rössing habe ich die gesamten Hilfetexte mit KI entwickelt. Ich erkläre der KI mein Anliegen — sie liefert einen Entwurf — ich passe an."

== Beispiel 3 — Übersetzungen

„Meine Freundin hat polnische Verwandte. Briefe auf Polnisch, Antworten auf Polnisch — KI übersetzt in beide Richtungen besser als jeder Online-Übersetzer von vor fünf Jahren."

== Beispiel 4 — Recherche, aber richtig

#regie[Hier _wichtig_: KI ist kein Suchmotor. Quellen verlangen, prüfen.]

„Wenn ich recherchiere, bitte ich die KI immer um Quellen mit Links. Dann klicke ich diese Quellen tatsächlich an. Ohne diesen Schritt: Vorsicht."

== Beispiel 5 — Optional: Family Todo + KI

#regie[Nur falls Zeit und Interesse. Telefon greifen, Sprachknopf drücken.]

„Wir haben in der Familie eine kleine App, in der die Aufgaben für die Kinder stehen. Statt mühsam Formulare auszufüllen, sage ich: ‚Lege Lukas ab nächster Woche jeden Mittwoch die Aufgabe Müll rausbringen an, dafür gibt es 10 Punkte.' — KI redet mit der App, fertig.

Das ist die Zukunft, wie ich sie sehe: nicht mehr klicken und tippen, sondern sprechen und delegieren."

#phase[20:20][10 min][Phase 6 · Fragen, Ausblick, Verabschiedung]

== Offene Fragerunde

#regie[Mindestens 5 Minuten reservieren. Falls keiner fragt: selbst eine Frage zur Diskussion stellen, z.B. „Was wäre für euch das eine Ding, das KI im Alltag erledigen sollte?"]

== Ausblick: Was kommt?

- Sprachmodelle werden in Apps, Autos, Haushaltsgeräte einziehen
- KI als _Dolmetscher_ zwischen Mensch und Software (MCP, Sprachsteuerung)
- Lokale, offline laufende KIs werden besser — Datenschutz-Frage entspannt sich
- Bürger:innen können sich selbst Werkzeuge bauen (lassen) — Beispiel Nordstemmen-MCP

== Verabschiedung

„Danke, dass ihr da wart. Wer Fragen hat: schreibt mir an post\@levinkeller.de oder kommt vorbei. Im Handout findet ihr die wichtigsten Links und Beispiele zum Mitnehmen.

Wenn euch der Abend etwas gebracht hat, freue ich mich über eine Spende für Saalmiete und Getränke — die Dose steht hinten.

Schönen Heimweg!"

#pagebreak()

= Backup-Material

== Wenn Technik streikt

- WLAN tot → Hotspot vom Telefon aufmachen
- Beamer tot → Slides auf Tablet zeigen, ggf. ohne Folien arbeiten
- Anbieter-Konto-Anlegen scheitert → einfach in Zweier-Pärchen weiterarbeiten
- Komplett kein Internet → Workshop wird zu offener Diskussionsrunde, Fragen + Erfahrungen sammeln, Beispiele auf dem Flipchart

== Wenn jemand „aber Datenschutz!" hartnäckig blockiert

- Anerkennen: „Das ist eine berechtigte Sorge."
- Sachlich: Was genau wird befürchtet? Konkret werden lassen.
- Alternativen anbieten: Mistral (EU), lokale Modelle (kurz erwähnen)
- Faustregel betonen: keine sensiblen Daten reingeben — wie bei jedem Online-Dienst

== Wenn jemand „die KI nimmt uns die Jobs" sagt

- Anerkennen, nicht runterspielen
- Differenzieren: Welche Tätigkeiten? Welche Branchen?
- Eigene Sicht: KI macht repetitive Arbeit weg, schafft Raum für das, was Menschen besser können — Beziehung, Urteil, Verantwortung
- Historisch einordnen: Excel hat Buchhalter:innen nicht arbeitslos gemacht, sondern produktiver

== Wenn jemand „aber meine Kinder nutzen das für Hausaufgaben" sagt

- Realität anerkennen: ja, das passiert
- Konstruktiv: KI als _Lehrer_ statt _Antwortmaschine_ benutzen — anders prompten beibringen
- Beispiel-Prompts: „Erkläre mir, wie ich diese Mathe-Aufgabe selbst löse, ohne mir die Lösung zu verraten."

= Nach dem Workshop

- Stuhlreihen zurückstellen
- Müll mitnehmen
- Spendendose leeren, in Buchhaltung übertragen
- E-Mail an alle Teilnehmenden (aus Anmeldeliste): Danke, Handout-PDF, Slides als Link, Folge-Termin?
- Kurze Reflexion notieren: Was lief gut, was beim nächsten Mal anders?
- Eventuell Blogpost auf levinkeller.de mit Foto + Lessons Learned
