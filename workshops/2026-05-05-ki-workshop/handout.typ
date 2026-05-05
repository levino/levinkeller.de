// Handout zum Workshop "KI richtig nutzen"
// Dorfgemeinschaftshaus Rössing, 5. Mai 2026
//
// Kompilieren: typst compile handout.typ
// Druckhinweis: A4, beidseitig, Schwarz-Weiß-tauglich, keine flächigen Schwärzen

#set document(title: "Handout — KI richtig nutzen", author: "Levin Keller")
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.4cm), numbering: "1 / 1")
#set text(lang: "de", size: 10pt, font: "New Computer Modern")
#set par(justify: true, leading: 0.55em)

#show heading.where(level: 1): it => [
  #set text(size: 14pt, weight: "bold")
  #pad(top: 0.3em, bottom: 0.15em)[#it]
]
#show heading.where(level: 2): it => [
  #set text(size: 11pt, weight: "bold")
  #pad(top: 0.35em, bottom: 0.05em)[#it]
]
#show heading.where(level: 3): it => [
  #set text(size: 10pt, weight: "bold")
  #pad(top: 0.25em, bottom: 0.05em)[#it]
]

// Kasten: dezenter Rahmen, keine Füllung — spart Druckerfarbe.
#let kasten(title, body) = {
  block(
    stroke: 0.4pt + black,
    inset: 6pt,
    width: 100%,
    [
      #text(weight: "bold")[#title]\
      #v(0.15em)
      #body
    ],
  )
}

// Prompt-Beispiel: kursiv, eingerückt, ohne Rahmen oder Füllung.
#let prompt(body) = {
  pad(left: 1em, right: 1em, top: 0.2em, bottom: 0.2em)[
    #text(style: "italic")[„#body"]
  ]
}

// Titel
#align(center)[
  #text(size: 20pt, weight: "bold")[KI richtig nutzen]\
  #v(0.15em)
  #text(size: 10pt)[Handout zum Workshop · 5. Mai 2026 · Dorfgemeinschaftshaus Rössing]\
  #v(0.05em)
  #text(size: 9pt)[Levin Keller · post\@levinkeller.de · levinkeller.de]
]

#v(0.3em)
#line(length: 100%, stroke: 0.4pt + black)

= In aller Kürze

KI ist heute ein erstaunlich kompetenter Mitarbeiter für den Alltag —
wenn man sie richtig nutzt. Dieses Handout fasst zusammen, wie.

#kasten("Drei Faustregeln")[
  + *KI ist Mitarbeiter, nicht Trainer.* Sie soll _die Arbeit erledigen_,
    nicht erklären, wie man sie selbst erledigen würde.
  + *Mit Kontext fluten.* Lieber zu viel als zu wenig — die KI wählt selbst
    aus, was relevant ist.
  + *Ruhig 20 € in die Hand nehmen.* Die guten Modelle hängen am
    Bezahltarif. Monatlich kündbar.
]

#kasten("Bei Unsicherheit: fragt die KI selbst")[
  KI ist die erste App, die sich _vollständig selbst erklärt_. Wenn
  irgendetwas unklar ist — wie ein Sprachmodell funktioniert, was ein
  Prompt ist, was Halluzinationen sind, oder wie ihr eine Aufgabe besser
  formuliert — fragt einfach die KI. Sie weiß alles über sich selbst.
]

= Bring Your Own AI

Heute ist KI meistens fest in eine App eingebaut: ihr tippt etwas in
einen Chatbot, die Inference läuft auf dem Server des Anbieters, alle
eure Daten landen dort. Ihr habt kaum Kontrolle, was mit dem Kontext
weiter passiert.

Ich glaube, der Weg in die Zukunft ist umgekehrt: ihr habt _eure_ KI
(z.B. Claude oder Le Chat), die auf eurem Konto läuft, lokal lesen
kann, was ihr ihr gebt — und Drittanbieter-Apps nur per MCP-Call
anspricht, mit genau dem, was raus muss.

#kasten("Beispiel: Stundenplan + Family-Todo")[
  Eure KI hat lokal Zugriff auf den Stundenplan eures Kindes. Sie sieht,
  dass Mittwoch Sport ist, und legt im Family-Todo nur einen Eintrag an:
  _„Dienstag abends Sportzeug einpacken."_ Der Stundenplan selbst geht
  nie an die Todo-App.
]

Drei Vorteile:

- *Mehr Kontext* — die KI sieht, was euch hilft
- *Datensparsamkeit* — Drittanbieter bekommt nur, was er braucht
- *Kontrolle* — ihr entscheidet, was rausgeht

Anthropic oder Mistral sehen die Daten natürlich — aber sie haben kein
kommerzielles Interesse daran. Sie sind euer Werkzeug, nicht euer
Auswerter.

= Die drei Anbieter

#table(
  columns: (auto, 1fr, auto),
  stroke: 0.4pt + black,
  inset: 4pt,
  [*Anbieter*], [*Profil*], [*Webseite*],
  [Anthropic _Claude_], [Sicher, saubere Texte, lange Dokumente. Stark im
    Schreiben und in komplexer Analyse.], [claude.ai],
  [OpenAI _ChatGPT_], [Bekanntester Anbieter, größte App-Reichweite,
    Bilder und Sprachausgabe.], [chat.openai.com],
  [Mistral _Le Chat_], [Europäischer Anbieter, EU-Server, schnell,
    datenschutzfreundlicher.], [chat.mistral.ai],
)

#kasten("Hinweis zu ChatGPT")[
  Im Workshop nutzen wir ChatGPT nicht — die normalen Tarife
  unterstützen keine Custom MCP-Connectors. Außerdem ist es eine
  persönliche Vorliebe von mir: ich arbeite mit Claude, ChatGPT mag ich
  nicht. Wer ChatGPT bereits abonniert hat, kann es selbstverständlich
  weiter nutzen — heute Abend geht es mit Le Chat oder Claude.
]

= Tarife (Stand 5/2026)

#table(
  columns: (auto, 1fr, 1fr, 1fr),
  stroke: 0.4pt + black,
  inset: 4pt,
  [*Anbieter*], [*Frei*], [*Mittlerer Tarif*], [*Power-Tarif*],
  [Anthropic], [Claude Free, limitiert], [Claude Pro · ~18 €/Monat], [Claude Max · 100–200 \$/Monat],
  [OpenAI], [ChatGPT Free, limitiert], [Plus · ~23 €/Monat], [Pro · ~200 \$/Monat],
  [Mistral], [Le Chat Free, großzügig], [Pro · 14,99 €/Monat], [Team · 24,99 €/Platz],
)

#text(size: 9pt)[
  Alle drei Anbieter sind monatlich kündbar. Der Bezahltarif schaltet die
  starken Modelle frei und hebt Tageslimits. Empfehlung: bei einem
  Anbieter ernsthaft probieren statt drei halb.
]

= Modelle: das Fuhrpark-Bild

Bei jedem Anbieter gibt es drei Klassen — klein, mittel, groß. Beispiel
Anthropic:

- *Haiku* — _das Klappfahrrad._ Schnell, günstig, kurze Wege:
  Mail-Entwurf, Übersetzung, schnelle Erklärung.
- *Sonnet* — _der SUV._ Alltagsfahrzeug. Briefe, Zusammenfassungen,
  Programmieren. Reicht für 90 % der Fälle.
- *Opus* — _der Flugzeugträger._ Teuer, langsam beim Starten — aber
  unschlagbar, wenn 10 PDFs gleichzeitig analysiert werden müssen oder
  ein langer Vertrag mit vielen Querbezügen kommt. Für Alltagsfragen
  Overkill.

Faustregel: erst Sonnet/Large nehmen. Bleibt die Antwort dünn oder ist
die Aufgabe wirklich komplex, auf Opus / Reasoning-Modell hochschalten.

= Welche KI für zu Hause

Für den Alltag empfehle ich:

- *Claude* (claude.ai), wenn ihr bereit seid, ~18 €/Monat zu zahlen.
  MCP-Connectors lassen sich dort reibungsloser einbinden, beim
  Schreiben und in komplexer Analyse ist Claude spürbar besser.
- *Le Chat* (chat.mistral.ai), wenn ihr erst kostenlos ausprobieren
  wollt. Custom-Connectors funktionieren auch auf dem Free-Tier
  (~25 Nachrichten/Tag), das Setup ist allerdings hakeliger als bei
  Claude.

Im Workshop nutzen wir Le Chat als Kompromiss — niemand soll vor Ort
20 € ausgeben müssen. Die Einrichtung machen wir gemeinsam.

= Mindset: KI ist Mitarbeiter

Der häufigste Fehler im Umgang mit KI: man behandelt sie als Trainer,
der einen aufschlaut. Man fragt etwas, kopiert die Antwort, macht die
eigentliche Arbeit selbst, kopiert das Ergebnis zurück, fragt wieder.
Das ist Pingpong — und teures Nachschlagen.

Besser: KI als Mitarbeiter. Einer Sekretärin reicht man nicht
Halbsätze, sondern den kompletten Vorgang mit „Erledigen Sie das" — und
erwartet, dass am Ende der Brief frankiert und eingetütet ist. Genauso
sollte man mit KI arbeiten.

#kasten("Leitbeispiel: Brief vom Finanzamt")[
  *Falsch:* Halbsatz aus dem Brief greifen, fragen „Was macht man da
  normalerweise?". Die KI erklärt das Vorgehen, die Arbeit bleibt bei
  einem selbst.

  *Richtig:* Der KI Durchgriff geben — den neuen Brief plus alle
  vergangenen Steuererklärungen, Bescheide, Kontoauszüge,
  Lohnabrechnungen, Belege. Dann: _„Schreib die Antwort."_ Die KI wählt
  selbst aus, was relevant ist, und liefert eine fertige Antwort. Nur
  noch durchlesen und abschicken.
]

= Datenschutz nüchtern

Bei den großen Anbietern (Anthropic, OpenAI, Mistral) sind eure Daten
gut aufgehoben. Das sind große Firmen mit kommerziellem Interesse,
ihre Kundschaft nicht zu enttäuschen — was ihr in die KI eintippt, ist
vor Zugriff Dritter sicher. US-Anbieter sind zwar nicht der DSGVO
unterworfen wie europäische Unternehmen, gehen aber sorgfältig mit
Daten um.

_Eure eigenen_ persönlichen Daten — auch Gesundheitsdaten, Finanzen,
medizinische Befunde mit Klarnamen — könnt ihr ohne Bedenken eingeben.
Bei allen drei Anbietern werden gelöschte Chats spätestens nach 30
Tagen von den Servern entfernt.

== Drei Stellschrauben einmalig setzen

- *Training mit eigenen Daten ausschalten* — bei allen Anbietern in den
  Einstellungen
- *Memory-Funktion ausschalten* — damit Inhalte aus einer Unterhaltung
  nicht in andere wabern und der Kontext sauber bleibt
- *Inkognito- / Temporär-Chat kennen* — für sensible Einzelfragen
  (Gesundheit, Finanzen, Familienthemen) ohne Spuren im Verlauf

== Echte Ausnahme: Daten Dritter

Persönliche Daten _anderer Menschen_ sind juristisch ein anderes
Kapitel — vor allem aus einer Rolle mit Verantwortung für andere:
Vereinsvorstand mit Mitgliederlisten, Vermieter mit Mietern,
freiberufliche Tätigkeit mit Kundendaten. Hier reicht ein Privat-Account
*nicht*. Nötig ist ein Business-/Team-Account mit
Auftragsverarbeitungsvereinbarung (AVV) gegenüber dem Anbieter.

#kasten("Faustregel")[
  *Eigene Daten ja, auch sensible — fremde Daten nur mit DSGVO-Setup.*
]

= Was ihr damit alles machen könnt

== Im Alltag

- *Kochrezepte aus Resten* — Foto vom Kühlschrank, Frage stellen:
  „Was kann ich daraus machen?"
- *Personalisierte Ausmalbilder* für die Kinder — „Dinosaurier im
  Weltall, schwarz-weiß Linien"
- *E-Mails vorbereiten* — der KI den ganzen Thread-Kontext geben, sie
  schlägt die Antwort vor
- *Dokumente ausarbeiten* — Antrag, Bewerbung, Beschwerde
- *Briefe und Druck-PDFs mit Typst* — die KI erzeugt aus dem Inhalt
  eine saubere Druckvorlage mit Briefkopf und Layout
- *Datei-Stapel analysieren* — 30 PDFs in den Chat, eine Frage über alle

== Behördenpost verstehen und beantworten

Foto vom Brief in die KI, Frage: _„Was wollen die von mir, in einfacher
Sprache, und was sollte ich antworten?"_ Wenn man die eigenen Akten
mitgibt, schreibt die KI direkt den Antwort-Entwurf.

== Übersetzungen

Briefe in beide Richtungen, deutlich besser als jeder Online-Übersetzer
von vor fünf Jahren. Auch für Speisekarten, Bedienungsanleitungen,
Behördenformulare aus dem Ausland.

== Recherche — aber richtig

#prompt[
Was sind die Voraussetzungen für eine Photovoltaik-Anlage auf dem
Dach in Niedersachsen? Bitte mit Quellen und Stand der Information.
]

Die Quellen anschließend tatsächlich anklicken und prüfen. Ohne diesen
Schritt: Vorsicht.

= MCP — KI spricht mit Apps

Eine neue Technik („Model Context Protocol") erlaubt es, mit der eigenen
KI direkt Apps zu bedienen. Statt klicken und tippen — sprechen und
delegieren. Beispiele aus meinen Projekten:

- *Verleihplattform Rössing* — Werkzeuge in der Nachbarschaft mieten,
  direkt aus dem KI-Chat heraus suchen, buchen, bestätigen\
  → mieten.rössing.de
- *Family Todo* — Familien-Aufgabenplaner per Sprache füllen\
  → docs.todos.levinkeller.de
- *Nordstemmen-Connector* — Fragen zu 18 Jahren Rats- und
  Haushaltsdokumenten, Antworten mit Quellenverweisen\
  → nordstemmen-mcp.levinkeller.de

#kasten("Custom-MCP auf welchem Tarif?")[
  - *Mistral Le Chat:* funktioniert auf dem _kostenlosen_ Tarif
  - *Claude:* ab Pro-Tarif (~18 €/Monat)
  - *ChatGPT:* erst ab Pro-Tarif (~200 \$/Monat)
]

= Spracheingabe

Wer mit dem Handy lieber spricht als tippt:

- *Dictate Keyboard (Whisper AI)* — Android, eigener OpenAI- oder
  Groq-API-Key. Lässt sich überall als System-Tastatur verwenden
- *WhisperInput* — offline, Open Source, ohne Internetverbindung

= In Kontakt bleiben

Wie wollen wir in Kontakt bleiben? Schreibt mir gerne eure Ideen. Mein
Vorschlag: in ein paar Wochen treffen wir uns wieder, und unterschiedliche
Leute stellen vor, was sie inzwischen mit KI gemacht haben. Daraus
entsteht ein Austausch, der über den heutigen Abend hinausgeht.

= Weiterführende Links

- *Drehbuch und Materialien:* levinkeller.de/de/docs/lernen/ki-workshop-2026-05-05
- *Meine Projekte:* levinkeller.de/de/work
- *Dorfwebseite Rössing:* rössing.de
- *Kontakt:* post\@levinkeller.de

#v(0.5em)
#line(length: 100%, stroke: 0.4pt + black)
#v(0.2em)

#align(center)[
  #text(size: 9pt)[
    Wenn dir der Abend etwas gebracht hat: eine Spende für Saalmiete und
    Getränke ist willkommen. — Danke fürs Mitmachen!
  ]
]
