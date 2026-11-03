---
title: 'Rezept: Conversations'
description: 'Bauplan für einen serverlosen, KI-nativen Mailserver auf Cloudflare: JMAP, hybride Suche, KI-Zugang mit Freigabe durch den Menschen.'
---

# Rezept: Conversations

Conversations ist ein Mailserver für Familie und Freunde, bei dem KI kein
Zusatz ist, sondern ein vollwertiger Client. Man liest und schreibt Mails wie
gewohnt, und zusätzlich kann ein KI-Assistent wie Claude im Postfach suchen,
lesen und Entwürfe schreiben. Alles, was die KI darüber hinaus tun will, wartet
auf meine Freigabe.

Hier steht, wie man so etwas nachbaut. Code gibt es dazu bewusst nicht, warum,
steht unter [Rezepte statt Code](/de/docs/software/rezepte).

## Ziel und Umfang

- Mails für eigene Domains empfangen und senden, ohne einen eigenen Server zu
  betreiben.
- Durchsuchbar nach Stichworten **und** nach Bedeutung, auch über
  Sprachgrenzen: Eine englische Frage findet die deutsche Mail.
- Ein offenes Protokoll für Apps (JMAP) und ein Zugang für KI-Assistenten (MCP).
- KI darf lesen, suchen und Entwürfe speichern. Senden, Verschieben, Löschen,
  Ordner ändern: nur nach ausdrücklicher Freigabe durch einen Menschen.
- Daten in Europa.
- **Kein SaaS.** Eine Handvoll Konten, nur auf Einladung, keine
  Registrierung, keine Abrechnung. Konten sind strikt voneinander getrennt.

IMAP und SMTP für Clients gibt es nicht. JMAP ist normales HTTP und passt
deshalb gut zu einer serverlosen Plattform.

## Architektur

- **Eingang:** Cloudflare Email Routing nimmt die Mail für die Domain an und
  übergibt sie einem Worker. Eine einzige Catch-all-Regel reicht, der Worker
  entscheidet selbst, welche Adressen es gibt, und lehnt alles andere ab.
- **Speicher:** Die Rohmail (die `.eml`-Datei) landet in R2 mit
  EU-Jurisdiktion. Sie ist die einzige Quelle der Wahrheit.
- **Kontozustand:** Pro Konto ein Durable Object mit eigener SQLite-Datenbank:
  Postfächer, Mails, Threads, Schlüsselwörter, Änderungsprotokoll und der
  Volltextindex (FTS5).
- **Pipeline:** Neue Mails laufen über eine Queue: Zitate entfernen, in Stücke
  teilen, Embeddings berechnen, in Vectorize speichern.
- **Suche:** Volltext aus SQLite und Vektorsuche aus Vectorize, zusammengeführt
  mit Reciprocal Rank Fusion.
- **Ausgang:** Cloudflare Email Sending, direkt aus dem Worker.
- **Schnittstellen:** Ein Worker (Hono) liefert JMAP, den MCP-Server, die
  Freigabeseiten und die Weboberfläche.
- **Anmeldung:** Ein vorhandener OpenID-Connect-Provider (bei mir ZITADEL).
  Für MCP ist der Worker selbst OAuth-Server und reicht die Anmeldung an den
  Provider weiter.

## Der Stack und warum

| Baustein | Wofür | Warum |
|---|---|---|
| Cloudflare Workers | Alles, was HTTP spricht | Kein Server, kein Patchen, praktisch kostenlos bei Familiengröße |
| Durable Objects mit SQLite | Ein Schreiber pro Konto | Konsistenz ohne Locks; jedes Konto hat seine eigene Datenbank, das trennt die Konten von selbst |
| FTS5 | Stichwortsuche | Steckt in SQLite, BM25-Ranking ist gut genug |
| R2 (EU) | Rohmails, Anhänge | Billig, EU-Jurisdiktion wählbar |
| Queues | Embeddings im Hintergrund | Wiederholungen bei Fehlern gratis dazu |
| Vectorize | Vektorsuche | Gehört zur Plattform; ein Namespace pro Konto |
| Email Routing / Sending | Ein- und Ausgang | Funktioniert ohne SMTP-Server; Sending signiert per DKIM für die eigene Domain |
| JMAP | Protokoll für Apps | HTTP statt IMAP, Änderungen und Push sind im Standard |
| MCP mit OAuth | Zugang für KI-Assistenten | Der Assistent meldet sich wie eine App an, man kann den Zugang jederzeit widerrufen |
| Qwen3-Embedding-8B bei einem EU-Anbieter | Embeddings | Offenes Modell, sehr gut mehrsprachig, per Token bezahlt; bei Bedarf bei einem anderen Anbieter austauschbar |
| ZITADEL | Anmeldung | War schon da; jeder OIDC-Provider mit JWT-Access-Tokens geht |

## Datenmodell

Pro Konto gibt es Postfächer mit Rollen (Eingang, Entwürfe, Gesendet,
Papierkorb, Spam, Archiv, Zurückgestellt) und Mails. Eine Mail kann in mehreren
Postfächern liegen und hat Schlüsselwörter wie gelesen oder markiert. Threads
entstehen aus den Headern `Message-ID`, `In-Reply-To` und `References`.

Jede Änderung bekommt eine fortlaufende Nummer, und Zeilen merken sich, wann sie
erzeugt, geändert und gelöscht wurden (Grabsteine statt echtem Löschen). Mehr
braucht JMAP nicht, um Clients nur die Änderungen seit ihrem letzten Stand zu
schicken.

Die Rohmail liegt inhaltsadressiert in R2: Ihr Name ist der SHA-256 ihres
Inhalts. Das hat einen schönen Nebeneffekt bei den Freigaben (siehe unten).

Global (in D1) liegen nur: wer welches Konto benutzen darf, welche Adressen zu
welchem Konto gehören, und die Warteschlange der KI-Aktionen.

## Die wichtigsten Entscheidungen

**Freigabe durch den Menschen, festgenagelt per Hash.** Will die KI eine Mail
senden, wird daraus zuerst ein Entwurf. Die Aktion in der Warteschlange
speichert den Hash genau dieses Entwurfs. Auf der Freigabeseite sehe ich, was
rausgeht, und mit dem Klick auf „Freigeben“ wird genau dieser Inhalt gesendet,
einmal. Ändert sich der Entwurf dazwischen, passt der Hash nicht mehr und nichts
passiert. Dasselbe gilt für Verschieben, Löschen und Ordner.

**Mailinhalte sind Daten, keine Anweisungen.** Jede Mail ist ungeprüfter Text
von Fremden, den ein Agent mit Werkzeugen liest. Die Werkzeug-Antworten
kennzeichnen Mailinhalte ausdrücklich als nicht vertrauenswürdig, und die
Freigabe ist die eigentliche Absicherung: Eine Prompt Injection kann höchstens
einen Vorschlag erzeugen, den ich ablehne.

**Hybride Suche mit Reciprocal Rank Fusion.** BM25-Scores und
Kosinus-Ähnlichkeiten lassen sich nicht sinnvoll addieren. RRF nutzt nur die
Ränge, ist robust und braucht kein Tuning. Strukturierte Filter (Absender,
Datum, Postfach) bleiben in SQLite, nicht in den Metadaten des Vektorindex.

**Matryoshka-Kürzung.** Qwen3-Embedding liefert 4096 Dimensionen. Die ersten
1024 davon, neu normalisiert, sind fast genauso gut und passen bequem in den
Vektorindex. Jeder Vektor speichert, mit welchem Modell er erzeugt wurde, damit
man bei einem Modellwechsel gezielt neu rechnen kann.

**Was eingebettet wird.** Pro Mail der neue Text ohne zitierte Antworten und
Signaturen, in Stücken, jeweils mit Betreff und Absender davor. Zusätzlich ein
Vektor pro Thread, damit ganze Unterhaltungen gefunden werden. Das Datum kommt
nicht in den Text: Es ist ein Filter, keine Bedeutung.

**Snooze auf dem Server, für ganze Threads.** Zurückgestellte Threads wandern
in ein eigenes Postfach. Jedes Durable Object hat genau einen Alarm; ein kleiner
Verteiler merkt sich alle fälligen Zeitpunkte und stellt den Alarm auf den
nächsten. Ist es so weit, kommt der Thread ungelesen und oben zurück. Kommt
vorher eine Antwort, wacht er sofort auf.

**Plus-Adressen über eine Catch-all-Regel.** `name+shop@domain` landet bei
`name@domain`. Statt für jede Adresse eine Routing-Regel zu pflegen, geht alles
an den Worker, und der schlägt die Adresse nach: erst genau, dann ohne den
Teil nach dem Plus. Unbekannte Adressen werden abgelehnt.

**Portabilität.** Der Kern (JMAP, Parsing, Threads, Suche, MCP-Werkzeuge) kennt
Cloudflare nicht. Jede Plattformfunktion steckt hinter einer kleinen
Schnittstelle: Blob-Speicher, Datenbank, Vektorspeicher, Embedder, Queue, Ein-
und Ausgang. Die Unit-Tests laufen deshalb gegen `node:sqlite`, und ein Umzug
zu einem anderen Anbieter bleibt realistisch.

## Testen

- **End-to-End gegen die echte Laufzeit:** Die Tests starten den Worker mit
  `wrangler dev` und frischem Zustand. Mails werden über den lokalen
  Email-Endpunkt eingeliefert, gesendete Mails aus der lokalen
  Sending-Emulation gelesen.
- **Nie externe Dienste in CI.** Die Embeddings laufen über einen kleinen
  Record/Replay-Proxy: Auf dem Entwicklungsrechner einmal echt aufnehmen,
  die Aufnahmen einchecken, in CI nur abspielen. Fehlt eine Aufnahme, schlägt
  der Test laut fehl. Ein Fake-OpenID-Provider stellt Tokens aus.
- **Sicherheitsgrenzen sind Testfälle:** Ein zweiter Nutzer sieht nichts vom
  ersten, über keine Schnittstelle. Eine geänderte Freigabe läuft nicht. Eine
  Aktion läuft höchstens einmal.
- Vectorize gibt es lokal nicht. Tests und lokale Entwicklung benutzen daher
  eine einfache Vektorsuche in der SQLite des Kontos, hinter derselben
  Schnittstelle.

## Bauplan

1. **Kern ohne Plattform:** Mail-Speicher auf SQLite (Postfächer, Mails,
   Threads, Änderungsprotokoll, FTS5), MIME parsen und erzeugen. Unit-Tests
   gegen `node:sqlite`.
2. **JMAP:** Session, `Mailbox/*`, `Email/*`, `Thread/*`, `Identity/get`,
   `EmailSubmission/set`, Upload und Download. Rückverweise zwischen Methoden
   nicht vergessen.
3. **Plattform:** Durable Object pro Konto, R2, Email-Routing-Handler,
   Email Sending. End-to-End-Tests mit `wrangler dev`.
4. **Anmeldung:** OIDC für das Web, JWT-Access-Tokens für JMAP, eine Allowlist:
   Wer kein Konto zugewiesen bekommen hat, kommt nicht rein.
5. **Suche:** Queue, Embeddings, Vektorindex, hybride Suche. Record/Replay für
   die Tests gleich mitbauen.
6. **MCP:** Lesen, Suchen, Entwürfe direkt; alles andere in die
   Freigabe-Warteschlange mit Hash. Die Freigabeseite zeigt genau, was passiert.
7. **Komfort:** Snooze, Plus-Adressen, Nachholen fehlender Embeddings per Cron.
8. **Umzug:** Alte Mails über JMAP importieren (`Email/import`), erst danach die
   MX-Einträge umstellen und einmal nachholen, was in der Zwischenzeit
   angekommen ist.

## Kosten

Bei Familiengröße (einige zehntausend Mails) grob:

- Cloudflare: im Workers-Paid-Plan (5 $/Monat) praktisch enthalten;
  Email Sending ist bis 3.000 Mails im Monat inklusive.
- Speicher: ein zweistelliger Gigabyte-Betrag an Rohmails kostet in R2 wenige
  Cent bis unter einen Euro im Monat.
- Embeddings: der einmalige Import von über 100.000 Mails liegt im Bereich
  weniger Dollar, danach Cent-Beträge.

## Fallstricke

- **Die lokale Sending-Emulation schreibt die Message-ID um** und gibt die neue
  zurück. Die zurückgegebene ID als zusätzliche Thread-Referenz speichern, sonst
  landen Antworten auf gesendete Mails nicht im richtigen Thread.
- **Vectorize-IDs müssen über alle Namespaces eindeutig sein.** Jedes Konto
  zählt seine Mails ab 1, also IDs mit dem Konto präfixen. Sonst überschreiben
  sich Konten gegenseitig, und weil lokal SQLite statt Vectorize läuft, merkt
  das kein Test.
- **CSP `form-action` gilt auch für Weiterleitungen nach einem Formular.** Ein
  Formular, das zum OAuth-Client (etwa claude.ai) weiterleitet, wird blockiert.
  Am Ende des OAuth-Consents deshalb eine Seite mit Meta-Refresh ausliefern
  statt einer Weiterleitung.
- **Unter `Referrer-Policy: no-referrer` schicken Browser bei Formularen
  `Origin: null`.** Für den CSRF-Schutz deshalb `Sec-Fetch-Site` prüfen und die
  Tests Formulare so absenden lassen, wie ein echter Browser es tut.
- **Email Sending ist für transaktionale Mails gedacht** und hängt am Ruf des
  ganzen Cloudflare-Kontos. Ein eigenes Konto nur für Mail ist eine Überlegung
  wert.
- **Ein Durable Object hat nur einen Alarm.** Sobald zwei Funktionen (Snooze,
  Import) einen brauchen, gehört ein kleiner Verteiler davor.

## Was noch nicht fertig ist

- JMAP-Push für mobile Apps ist erst in Arbeit, ebenso eine eigene
  Weboberfläche.
- Bounces werden noch nicht ausgewertet.
- Der Spamfilter ist bewusst einfach (Authentifizierungsergebnisse plus ein paar
  harte Regeln).
- Eine eigene Android-App ist geplant, aber noch nicht begonnen.
