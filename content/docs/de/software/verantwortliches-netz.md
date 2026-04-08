---
title: 'Verantwortliches Netz – Ein technisch-rechtlicher Reformvorschlag'
---

**Levin Keller, April 2026**

---

## Das Problem

Das Internet leidet nicht an zu wenig Anonymität – es leidet an zu wenig Konsequenz. Wer anonym postet, kann beleidigen, bedrohen und lügen, ohne strafrechtlich greifbar zu sein. Staatliche Institutionen, Medien und Unternehmen unterhalten Präsenzen auf Plattformen, auf denen jeder Nutzer faktisch unverfolgbar ist. Das ist kein technisches Problem. Es ist ein regulatorisches Versagen.

Anonymität im Netz ist grundsätzlich legitim und schützenswert. Wer jedoch auf einer Plattform interagiert, die öffentlichen Diskurs gestaltet, sollte dort für sein Handeln haftbar sein können – wenn es nötig ist.

---

## Der Vorschlag: Freiwillig verifizierte Plattformen

### Grundprinzip

Es braucht keine Pflicht zur Klarnamen-Nutzung. Es braucht eine **freiwillige, aber konsequente Alternative**: Plattformen, auf denen alle Teilnehmer bei Registrierung einmalig mit ihrem Personalausweis verifiziert wurden und für alle ihre Handlungen strafrechtlich verfolgbar sind.

Wer das nicht will, geht zu Twitter, Mastodon oder anderswo hin. Das ist sein gutes Recht. Aber wer staatliche Institutionen, seriöse Medien oder qualifizierten öffentlichen Diskurs sucht, sollte wählen können: **Plattformen, auf denen Haftbarkeit gilt.**

---

## Die technische Lösung

### Schritt 1: Einmalige Verifikation bei Registrierung (eID)

Jeder deutsche Personalausweis seit 2010 enthält eine Online-Ausweisfunktion. Bei der Registrierung authentifiziert sich der Nutzer einmalig über die AusweisApp2 per NFC oder Kartenleser.

Dabei wird **ausschließlich** das dienste- und kartenspezifische Kennzeichen (DKK) abgefragt – eine kryptografisch eindeutige, pseudonyme ID, die pro Dienst und Ausweis verschieden ist. **Kein Name, keine Adresse, kein Geburtsdatum** wird gespeichert.

Die Plattform speichert nur:

```json
{ "account_id": "...", "dkk": "a3f7c9d2...", "verified": true }
```

### Schritt 2: Passkey-Bindung an die eID

Unmittelbar nach der eID-Verifikation wird ein Passkey (Face ID, Touch ID oder Hardware-Key) erstellt und **kryptografisch durch die eID signiert**. Der Passkey ist damit unwiderlegbar an den Ausweis gebunden.

Jede weitere Aktion auf der Plattform – jeder Post, jeder Kommentar – wird mit diesem Passkey signiert. Das ist für den Nutzer unsichtbar und erzeugt keine Reibung in der UX.

### Was im Missbrauchsfall passiert

Die Staatsanwaltschaft erhält die DKK des Accounts. Über das Bundesverwaltungsamt ist die DKK auf den Ausweisinhaber rückführbar. Die Plattform selbst hat zu keinem Zeitpunkt den Klarnamen gespeichert.

---

## Die rechtliche Lücke – und wie man sie schließt

### Status quo

Die qualifizierte elektronische Signatur (QES) kennt bereits eine Beweislastumkehr: Wer mit seiner QES unterzeichnet, gilt als Urheber. Das ist in der eIDAS-Verordnung (Art. 25) verankert.

Für die eID-Authentifizierung gilt das **nicht** in gleicher Weise. Wer behauptet, sein Ausweis sei ohne sein Wissen genutzt worden, kann sich darauf berufen – trotz Zwei-Faktor-Authentifizierung (Ausweis + PIN).

### Die Forderung

**Gesetzliche Gleichstellung der eID-gebundenen Passkey-Signatur mit der QES in Bezug auf strafrechtliche Beweislast.**

Konkret: Wer sich auf einer Plattform mittels eID registriert und einen Passkey damit verknüpft hat, gilt als Urheber aller mit diesem Passkey signierten Handlungen – sofern er nicht glaubhaft macht, dass der Passkey ohne seinen Willen genutzt wurde.

Das erfordert im Wesentlichen **einen halben Paragraphen** in StGB oder StPO. Die technische Grundlage existiert bereits.

Die freiwillige Selbstverpflichtung bei Registrierung macht das vertragsrechtlich heute schon weitgehend möglich. Was fehlt, ist die strafprozessuale Verbindlichkeit.

---

## Die regulatorische Barriere – und warum sie abgebaut werden muss

### Das aktuelle Problem

Um die eID-Funktion als Plattformbetreiber zu nutzen, sind heute erforderlich:

- BSI-Zertifizierung nach TR-03128-2 (mehrere Monate, 10.000–50.000 €)
- Antrag bei der Vergabestelle für Berechtigungszertifikate (VfB) des Bundesverwaltungsamts
- Kauf eines technischen Berechtigungszertifikats bei einer BerCA (~2.000–3.000 €/Jahr)
- Betrieb eines eID-Servers oder Beauftragung eines Dienstleisters (~500–2.000 €/Monat)

Dieser Aufwand ist auf Banken, Behörden und Telekommunikationsunternehmen ausgelegt. Für zivilgesellschaftliche Projekte, Startups oder gemeinnützige Plattformen ist er faktisch unüberwindbar.

### Das Paradox

Die Anforderungen sind **identisch**, egal ob ein Betreiber den vollständigen Datensatz (Name, Adresse, Geburtsdatum) oder ausschließlich die pseudonyme DKK abruft. Ein Dienst, der maximalen Datenhunger hat, und ein Dienst, der aus Datenschutzgründen nur eine anonyme Kennung speichert, durchlaufen dasselbe Verfahren.

Das ist regulatorisch nicht begründbar.

### Die Forderung

**Gestufte Akkreditierung je nach abgefragten Datenfeldern:**

- Nur DKK (keine personenbezogenen Daten): vereinfachtes Registrierungsverfahren, analog zur Impressumspflicht
- Personenbezogene Daten (Name, Adresse etc.): volles Akkreditierungsverfahren wie heute

Wer weniger Daten will, sollte weniger Aufwand haben – nicht denselben.

Ergänzend: eine **öffentliche Entwickler-Sandbox** für Test und Integration, ohne Kosten und ohne formale Akkreditierung.

---

## Haftungsfreistellung für Plattformbetreiber

Ein zentraler Vorteil verifizierter Plattformen: Die Betreiber müssen nicht mehr als Hilfspolizei agieren. Wenn jeder Account kryptografisch an eine eID gebunden ist, kann die Staatsanwaltschaft Straftaten **direkt** über die DKK verfolgen – ohne Umweg über die Plattform.

Das eröffnet die Möglichkeit einer **gesetzlichen Haftungsfreistellung**: Plattformen, die eine lückenlose eID-Verifikation aller Nutzer nachweisen, werden von der Störerhaftung für nutzergenerierte Inhalte befreit. Sie müssen keine Inhalte moderieren, keine Löschanfragen prüfen, keine Uploadfilter betreiben – weil der Rechtsstaat direkt greifen kann.

Das ist keine Abschwächung des Rechtsschutzes. Es ist eine Verlagerung der Verantwortung dorthin, wo sie hingehört: zum Urheber der Handlung und zur Strafverfolgung. Die Plattform wird vom Quasi-Richter zum neutralen Infrastrukturbetreiber.

Für Plattformbetreiber entfällt damit ein enormer regulatorischer und operativer Aufwand (DSA-Compliance, NetzDG-Meldepflichten, Content-Moderation-Teams). Das ist ein **starker wirtschaftlicher Anreiz**, die eID-Verifikation einzuführen – und macht das gesamte Modell marktwirtschaftlich tragfähig.

---

## Staatliche Institutionen: Eine klare Regel

Behörden, Ministerien, öffentlich-rechtliche Medien und andere staatliche Institutionen sollten **nur noch auf verifizierten Plattformen aktiv sein dürfen**, auf denen alle Interaktionspartner strafrechtlich verfolgbar sind.

Das ist keine Einschränkung der Meinungsfreiheit. Es ist eine Frage der Würde des öffentlichen Diskurses. Wer staatliche Kommunikation unter Bedingungen führt, die Bedrohungen, Beleidigungen und Desinformation ohne Konsequenz ermöglichen, legitimiert genau dieses Umfeld.

---

## Zusammenfassung der Forderungen

1. **Gestufte eID-Akkreditierung:** Vereinfachter Zugang für Dienste, die ausschließlich die DKK nutzen

2. **Öffentliche Entwickler-Sandbox** für die eID-Infrastruktur

3. **Gesetzliche Beweislastumkehr** für eID-gebundene Passkey-Signaturen (StGB/StPO)

4. **Pflicht für staatliche Institutionen**, ausschließlich auf verifizierten Plattformen zu kommunizieren

5. **Änderung §21b PAuswG**: Identifizierungsdiensteanbieter dürfen DKK-basiertes Account-Management anbieten

6. **Haftungsfreistellung für Plattformbetreiber**, die lückenlose eID-Verifikation nachweisen (Befreiung von Störerhaftung, NetzDG-Meldepflichten und DSA-Moderationspflichten)

---

## Fazit

Die technische Grundlage ist seit 2010 in der Tasche jedes Deutschen. Was fehlt, ist politischer Wille, eine handvoll Gesetzesänderungen und der Abbau einer bürokratischen Mauer, die Innovation verhindert, ohne irgendjemanden zu schützen.

Anonymität bleibt. Konsequenzlosigkeit nicht.

---

*Dieser Vorschlag entstand als technisch-rechtliche Analyse mit dem Ziel, konkrete und umsetzbare Reformen im Bereich digitaler Identität und Plattformregulierung anzustoßen.*
