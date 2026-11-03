---
title: 'Rezept: Documents'
description: 'Bauplan für ein Dokumentenarchiv mit OCR, strukturierten Angaben und hybrider KI-Suche: Scans aus Nextcloud, Mailanhänge, Teilen über Labels.'
---

# Rezept: Documents

Documents ist mein Dokumentenarchiv. Scans vom ScanSnap landen in einem
Nextcloud-Ordner, Mailanhänge kommen vom [Mailserver](/de/docs/software/rezepte/conversations)
dazu, und am Ende ist jedes Dokument nach Stichworten und nach Bedeutung
durchsuchbar, mit sauberem Dateinamen und den wichtigsten Angaben als Felder.

Es kann genau eines: **Dinge wiederfinden.** Keine Erinnerungen, kein
Assistent, keine „KI-Magie“. Wer so etwas will, baut es als eigene Schicht
obendrauf.

## Ziel und Umfang

- Alle Papiere des Haushalts durchsuchbar, für Menschen und für KI-Assistenten.
- Gute Texterkennung, auch wenn der Scanner schon eine schlechte mitliefert.
- Pro Dokument: Typ, Absender, Datum, Beträge, Fristen, Aktenzeichen und eine
  Zusammenfassung.
- Mehrere auf einmal gescannte Dokumente werden getrennt.
- Teilen mit der Familie, ohne dass ich Ordner pflegen muss.
- Daten und KI-Verarbeitung in der EU.

## Architektur

- **Eingang Scans:** Ein Cron-Job schaut alle 10 Minuten in einen
  Nextcloud-Ordner. Alles, was direkt darin liegt, ist neu. Der Ordner ist die
  Warteschlange, es braucht keine weitere Buchführung.
- **Eingang Mail:** Der Mailserver übergibt Anhänge über eine interne
  Verbindung zwischen den beiden Workern (Service Binding), ohne öffentlichen
  Endpunkt.
- **Verarbeitung:** pro Datei ein Job in der Eingangs-Queue: herunterladen,
  Hash bilden, Texterkennung und Auswertung, speichern, in Nextcloud umbenennen
  und ablegen. Die Embeddings laufen danach in einer eigenen Queue. Jede Queue
  hat eine Dead-Letter-Queue für Jobs, die endgültig scheitern.
- **Speicher:** Das PDF (und jedes abgetrennte Teil) in R2 mit
  EU-Jurisdiktion. Text, Felder, Labels, Herkunft, das Protokoll der Freigaben
  und die Suchvektoren in einem Durable Object mit SQLite und FTS5, fest in der
  EU.
- **Suche:** Volltext und Vektoren, beide im Durable Object, zusammengeführt
  mit Reciprocal Rank Fusion.
- **Zugang:** MCP für KI-Assistenten, dazu eine REST-API für Massenarbeit,
  beides hinter OpenID Connect.

## Der Stack und warum

| Baustein | Wofür | Warum |
|---|---|---|
| Cloudflare Workers, Cron, Queues | Abholen und Verarbeiten | Kein Server; ein Job pro Datei, Wiederholungen gratis |
| Durable Object mit SQLite + FTS5, Jurisdiktion EU | Bibliothek und Vektoren | Ein Schreiber, Volltextsuche eingebaut, bleibt in der EU |
| R2 (EU) | Originale | Billig, unabhängig von Nextcloud |
| Gemini Flash auf Vertex AI, EU-Multiregion | Texterkennung und Auswertung in einem Aufruf | Liest PDFs direkt, sehr gut bei Tabellen und Deutsch, Verarbeitung in der EU, kein Training mit den Daten |
| Qwen3-Embedding-8B bei EU-Anbietern | Semantische Suche | Dasselbe Modell wie beim Mailserver |
| D1 (EU) | Anmeldung, Freigaben, API-Schlüssel | Klein, in der EU angelegt |
| Nextcloud-Freigabelink mit Passwort | Zugriff auf den Scan-Ordner | Der Worker sieht nur diesen einen Ordner, nicht die ganze Cloud |
| OpenID Connect (bei mir ZITADEL) | Anmeldung | Gemeinsam mit dem Mailserver |

Zum Nextcloud-Zugang: App-Passwörter und OAuth-Clients von Nextcloud gelten
immer für das ganze Konto. Ein passwortgeschützter Freigabelink mit
Schreibrechten auf genau den Scan-Ordner ist der einfachste Weg, den Zugriff
wirklich zu begrenzen. Über die öffentliche WebDAV-Schnittstelle der Freigabe
funktionieren Auflisten, Herunterladen und Verschieben.

## Ein Aufruf für alles

Pro Dokument geht genau ein Aufruf an Gemini: das PDF als Ganzes, ein
JSON-Schema für die Antwort, Temperatur 0. Zurück kommt eine Liste von
Dokumenten (meist eines, mehrere bei einem gestapelten Scan), jeweils mit:

- den Seiten, die dazugehören,
- dem vollen Text als Markdown (der eine String für Suche, Embeddings und Lesen),
- Titel, Datum, Typ (aus einer festen Liste), Absender,
- wen es betrifft, Beträgen, Fristen, Aktenzeichen und Nummern,
- einer Zusammenfassung, **immer auf Deutsch**, und bei fremdsprachigen
  Dokumenten zusätzlich einer im Original,
- einem Titel für den Dateinamen,
- einem Vorschlag fürs Teilen samt Begründung und Sicherheit.

Gestapelte Scans trennt der Code anschließend mit pdf-lib in eigene PDFs, das
Original bleibt erhalten. Lange PDFs gehen in Seitenblöcken durch.

**Kontrolle gegen „Verbesserungen“:** Sprachmodelle machen aus einer schlecht
lesbaren Zahl gern eine plausible. Deshalb muss jeder Betrag und jedes
Aktenzeichen aus den Feldern wörtlich im erkannten Text vorkommen. Sonst wird
das Dokument zur Prüfung markiert.

**Scans immer neu erkennen.** Der Scanner legt eine eigene Textebene ins PDF,
die meist mittelmäßig ist. Scans gehen deshalb immer durch die neue
Texterkennung. Nur „echte“ digitale PDFs (Rechnungen aus Mails) haben brauchbaren
Text; da reicht ein günstigeres Modell, das nur die Felder und die
Zusammenfassung ausliest. Ob ein PDF ein Scan ist, verrät meist die
Software in den Metadaten oder dass jede Seite ein einziges Bild ist.

**Dateinamen:** `2025-09-12 Finanzamt Hildesheim – Steuerbescheid 2025.pdf`.
Absender in einer kurzen, eindeutigen Form (aus einer Tabelle mit Aliassen,
damit es nicht drei Schreibweisen gibt), Titel mit dem entscheidenden Detail,
Umlaute bleiben, höchstens 100 Zeichen.

## Teilen über Labels statt Ordner

Ordner sind exklusiv: Ein Dokument liegt an genau einer Stelle. Teilen
funktioniert hier anders:

- Jedes Dokument hat einen **Eigentümer**.
- **Labels** wie `familie` haben ein **Publikum**, also Personen, die alles
  mit diesem Label sehen.
- Sichtbar ist ein Dokument für den Eigentümer und für das Publikum jedes
  Labels darauf. Das wird an genau einer Stelle im Code geprüft, die jede
  Suche, jeder Abruf und jeder Download benutzt.
- Jeder Eigentümer hat seine eigene Kopie. Kommt dieselbe Datei von jemand
  anderem, wird daraus dessen eigenes Dokument. So kann niemand ein privates
  Dokument teilen, nur weil er die gleiche Datei besitzt (die Bank, der Arzt
  und das Finanzamt haben sie natürlich).
- Labels, die ich entfernt habe, kommen nie automatisch zurück.
- Labels vergibt die KI, und zwar nach Regeln, die ich einmal in Alltagssprache
  aufgeschrieben habe („Wohnung, Versicherungen, Auto, gemeinsame Steuern:
  Familie. Gesundheit und mein Job: nur ich.“).
- **Im Zweifel privat.** Ein fälschlich privates Dokument kostet nichts, ein
  fälschlich geteiltes schon. Jede Änderung am Teilen landet in einem
  Protokoll.
- Will ein KI-Assistent über MCP das Teilen ändern, muss ich das freigeben,
  wie beim Mailserver.
- Themen-Labels („Auto“, „Steuern“) gibt es bewusst nicht. Die semantische
  Suche findet „alles zum Auto“ besser, als es eine Verschlagwortung je würde.

## Zugang für KI-Assistenten

MCP-Aufrufe kosten jedes Mal einen Umlauf durch das Modell. Die MCP-Werkzeuge
sind deshalb knapp und nehmen Listen: suchen (kompakte Treffer mit
Zusammenfassung), mehrere Dokumente auf einmal lesen, Download-Links holen.

Für alles Größere gibt es eine REST-API. Den Schlüssel dafür holt sich der
Assistent über ein MCP-Werkzeug: kurzlebig, standardmäßig nur lesend,
widerrufbar und an die Verbindung des Assistenten gebunden: Trenne ich die,
sind auch die Schlüssel tot. Die Antwort enthält gleich eine kleine
curl-Anleitung. So
nutzt man die Anmeldung von MCP und die Effizienz von REST.

## Testen

- **Kein Nextcloud-Container:** Ein kleiner Fake-WebDAV-Server in Node
  (Auflisten, Herunterladen, Verschieben) reicht und startet in Millisekunden.
- **Gemini und Embeddings per Record/Replay:** einmal echt aufnehmen,
  einchecken, in CI nur abspielen. CI ruft nie einen externen Dienst auf.
- **Sichtbarkeit ist ein Testfall:** Ein zweiter Nutzer sieht nur, was mit ihm
  geteilt ist. Keine Treffer, keine Ausschnitte, keine Downloads von etwas
  anderem.
- Testdokumente erzeugt man mit pdf-lib, inklusive eines Scans mit
  unsichtbarer Textebene und eines gestapelten Scans.

## Bauplan

1. **Bibliothek:** SQLite-Schema für Dokumente, Herkunft, Labels, Publikum und
   Protokoll; Volltextindex; die eine Sichtbarkeitsfunktion. Unit-Tests.
2. **Auswertung:** den Gemini-Aufruf mit Schema bauen, mit Record/Replay
   testen, die Kontrolle für Beträge und Aktenzeichen, das Trennen von Stapeln.
3. **Eingang:** Cron über den Nextcloud-Ordner, Queue pro Datei, Hash gegen
   Doppelte, Umbenennen und Ablegen, nach drei Fehlversuchen in einen
   Fehler-Ordner.
4. **Suche:** Embeddings, Vektorindex, hybride Suche mit Filtern (Typ,
   Absender, Zeitraum, Betrag, Fristen).
5. **Zugang:** Anmeldung, MCP-Werkzeuge, REST-API mit kurzlebigen Schlüsseln.
6. **Mailanhänge:** Übergabe vom Mailserver, nur echte Dokumente (PDFs und
   Bilder ab einer Mindestgröße). Spam gar nicht, und Anhänge von Absendern,
   die die Absenderprüfung nicht bestehen, nur als „nicht vertrauenswürdig“:
   privat, zur Prüfung markiert, ohne KI-Labels. Sonst könnte jeder per Mail
   gefälschte „Finanzamt“-Briefe ins Archiv legen. Dazu eine Obergrenze für
   Seiten pro Datei und Dateien pro Absender und Tag.
7. **Probelauf:** 20 echte Scans, Namen und Felder prüfen, dann den Rest in
   Portionen.

## Alle Daten in der EU

Wie beim [Mailserver](/de/docs/software/rezepte/conversations): Durable
Objects, R2 und D1 mit EU-Jurisdiktion, Vektoren im Durable Object statt in
Vectorize (das sich nicht festlegen lässt), keine Protokolle mit Dateinamen,
Pfaden oder Inhalten. Gemini läuft über den EU-Endpunkt von Vertex, die
Embeddings bei EU-Anbietern.

## Kosten

Bei 3,8 Flash mit wenig „Denken“ habe ich gut 3,70 $ pro 1.000 Seiten gemessen
(Einführungspreis bis Ende 2026, danach etwa das Doppelte). Meine knapp 1.000
Scans kosteten also rund zehn Dollar, einmalig; zwei scheiterten an einem
vorübergehenden Zeitlimit und liefen beim zweiten Versuch durch. Die günstigere
Variante für digitale PDFs liegt deutlich darunter. Speicher und Plattform
fallen bei Haushaltsgröße kaum ins Gewicht.

## Fallstricke

- **Die neuen Gemini-Modelle gibt es auf Vertex nur in `global` und in der
  Multiregion `eu`**, nicht in einzelnen Regionen wie Frankfurt. In der EU heißt
  der Endpunkt `aiplatform.eu.rep.googleapis.com`, die Location `eu`. In einer
  einzelnen Region kommt einfach „not found“, was nach einem Rechteproblem
  aussieht. Erst die Doku lesen, dann probieren.
- **„Denken“ kostet wie Ausgabe.** Die Denk-Tokens werden zum Ausgabepreis
  abgerechnet. Für Texterkennung bringen sie nichts: In meinem Vergleich war die
  Genauigkeit gleich, die Kosten 45 bis 80 Prozent höher. Denken auf das
  Minimum stellen.
- **Gemini 2.5 Flash wurde im Oktober 2026 abgeschaltet.** Wer noch darauf
  setzt, sollte umstellen. Die Lite-Varianten der neueren Modelle verlieren bei
  Tabellen Inhalte; für Scans lohnt das volle Flash-Modell.
- **Die Lite-Modelle sparen an der falschen Stelle.** Im Vergleich auf echten
  Scans verloren sie Tabelleninhalte und trennten einen zweiseitigen Brief
  fälschlich. Für digitale PDFs, bei denen nur Felder und Zusammenfassung
  gebraucht werden, reichen sie.
- **Ein Google-Cloud-Abrechnungskonto kann standardmäßig nur fünf Projekte
  haben.** Mehr gibt es auf Antrag. Und Budgets in Google Cloud sind nur
  Warnungen, keine harte Grenze.
- **CSP `form-action` gilt auch für die Weiterleitung nach einem Formular**,
  und unter `Referrer-Policy: no-referrer` schicken Browser `Origin: null`.
  Beides trifft genau den OAuth-Consent für MCP (siehe
  [Conversations](/de/docs/software/rezepte/conversations)).
- **Vektorsuche findet immer etwas.** Sie liefert die nächsten Dokumente, auch
  wenn keines passt. Eine Mindestähnlichkeit festlegen, sobald echte Daten da
  sind.

## Was noch nicht fertig ist

- Verschlüsselte Backups bei einem zweiten Anbieter.
- Föderation: Jede Person betreibt ihre eigene Instanz, und Instanzen fragen
  sich gegenseitig nach geteilten Dokumenten. Die Sichtbarkeitsprüfung an einer
  Stelle und global eindeutige IDs sind dafür schon vorbereitet.
- Eine wöchentliche Übersicht der Teilen-Entscheidungen.
