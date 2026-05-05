# KI richtig nutzen

Workshop am 5. Mai 2026

<span class="muted">Dorfgemeinschaftshaus Rössing · Levin Keller</span>

---

## Heute Abend

| Zeit  | Phase                                       |
| ----- | ------------------------------------------- |
| 19:00 | Begrüßung                                   |
| 19:05 | Drei Demos                                  |
| 19:20 | Anbieter, Tarife, Modelle                   |
| 19:35 | Datenschutz                                 |
| 19:45 | Mindset                                     |
| 19:55 | Hands-on                                    |
| 20:20 | Ideen, Folgetreffen, Fragen                 |

Levin Keller — Software-Entwickler aus Rössing, arbeitet seit Jahren
intensiv mit KI.

---

## Bring Your Own AI

Idee: Ihr installiert eure eigene KI und _bringt sie mit_, um Apps zu
bedienen. Meine Apps sprechen mit jeder MCP-fähigen KI.

Was jetzt kommt: drei Demos vom Handy auf den Beamer.

- **Demo 1** — Werkzeug auf mieten.rössing.de mieten
- **Demo 2** — neuen Termin auf rössing.de eintragen
- **Demo 3** — Aufgabe für die Kinder im Family-Todo anlegen

---

## Architektur: warum das wichtig ist

**Klassisch:** App → KI auf deren Server. Eure Daten landen dort.

**Bring Your Own AI:** eure KI liest lokal, ruft Apps nur mit dem
Nötigen auf.

<div style="display: flex; flex-direction: row; gap: 0.4em; align-items: center; font-size: 0.65em; margin-top: 1em; width: 100%;">
  <div style="flex: 1; padding: 0.5em; border: 1px solid #888; border-radius: 4px; text-align: center;">
    📁<br><strong>Lokale Daten</strong><br><span style="color: #888;">Stundenplan, Akten</span>
  </div>
  <div style="color: #2a4d6e; font-weight: 600;">→</div>
  <div style="flex: 1; padding: 0.5em; border: 2px solid #2a4d6e; border-radius: 4px; background: #f5f5f5; text-align: center;">
    🤖<br><strong>Eure KI</strong><br><span style="color: #888;">Claude, Le Chat</span>
  </div>
  <div style="color: #2a4d6e; font-weight: 600;">→</div>
  <div style="flex: 1; padding: 0.5em; border: 1px solid #888; border-radius: 4px; text-align: center;">
    🌐<br><strong>App</strong><br><span style="color: #888;">Todo, Mieten</span>
  </div>
</div>

<div style="text-align: center; font-size: 0.65em; color: #888; margin-top: 0.4em;">
  MCP-Call · nur das Abgeleitete
</div>

---

## Warum das ein Unterschied ist

> **Beispiel.** Eure KI liest lokal den Stundenplan, sieht Mittwoch Sport,
> legt im Todo an: _„Dienstag abends Sportzeug einpacken."_

Der Stundenplan selbst geht nie an die App.

- **Mehr Kontext** — eure KI sieht, was hilft
- **Datensparsamkeit** — App bekommt nur, was sie braucht
- **Kontrolle** — ihr entscheidet, was rausgeht

---

## Drei Demos: was geht heute

1. **Mieten:** „Reserviere mir den Bohrhammer für Samstag."
2. **Termin:** „Trage das Dorffest ein: 14. Juni, 15–22 Uhr, Bolzplatz."
3. **Aufgabe:** „Thomas soll jeden Mittwoch abends den Müll rausbringen."

Alles drei: einfach eingesprochen — ohne sich durch Apps und Webseiten
zu klicken.

<span class="muted">Das ist nicht Zukunft. Das ist heute.</span>

---

## Wenn was unklar ist: fragt die KI

KI ist die erste App, die sich **vollständig selbst erklärt**.

- Wie funktioniert ein Sprachmodell? — fragt die KI
- Was ist ein Token, ein Halluzinationsrisiko, ein Wissensstichtag? — fragt die KI
- Wie schreibe ich einen besseren Prompt? — fragt die KI
- Was kostet die nächste Anfrage? — fragt die KI

<span class="muted">Heute Abend ebenso: was ihr nicht versteht, was ich
zu schnell sage — fragt direkt euer Handy.</span>

---

## „Für KI bezahlen?"

Vergleich: **Handy-Tarif.** Niemand erwartet, dass Mobilfunk gratis
ist. KI ist genauso ein Werkzeug, das man mietet.

Was ihr für 20 €/Monat bekommt: Assistent rund um die Uhr, Korrektor,
Übersetzer, Erklärer.

**Empfehlung:** _nicht_ kostenlos starten. Die guten Modelle hängen am
Bezahltarif. Monatlich kündbar — eine Pizza weniger pro Monat.

---

## Drei Anbieter, drei Tarife

| Anbieter      | Sitz      | Frei                | Pro                |
| ------------- | --------- | ------------------- | ------------------ |
| **Anthropic** Claude | SF, USA   | limitiert           | 18 €/Monat         |
| **OpenAI** ChatGPT   | SF, USA   | limitiert           | 23 €/Monat         |
| **Mistral** Le Chat  | Paris, FR | großzügig           | 14,99 €/Monat      |

Power-Tarife jeweils 100–200 $/Monat. Alle drei monatlich kündbar.

<span class="muted">Stand 5/2026.</span>

---

## Modelle: Fuhrpark

Bei jedem Anbieter drei Klassen — beim Beispiel _Anthropic_:

- **Haiku** — _Klappfahrrad._ Mail-Entwurf, Übersetzung, schnelle Erklärung
- **Sonnet** — _SUV._ Briefe, Zusammenfassungen, Programmieren — reicht für 90 % der Fälle
- **Opus** — _Flugzeugträger._ 10 PDFs auf einmal, Vertragsanalyse mit vielen Querbezügen, mehrstufige Recherche

Faustregel: erst Sonnet/Large nehmen. Erst bei dünnen Antworten oder
echten Brocken auf Opus / Reasoning-Modell hochschalten.

---

## ChatGPT zeigen wir heute nicht

- Keine Custom Connectors auf den normalen Tarifen
- Persönlich: ich arbeite mit **Claude**, ChatGPT mag ich nicht

Heute nutzen wir **Le Chat** (Free) oder **Claude** (Pro). Wer ChatGPT
bereits zahlt, kann es selbst weiter nutzen.

---

## Datenschutz: kein Grund für Paranoia

Eure Daten sind bei Anthropic, OpenAI, Mistral gut aufgehoben.
_Eigene_ Daten — auch Gesundheit, Finanzen, medizinische Befunde mit
Klarnamen — könnt ihr eingeben. Gelöscht = nach 30 Tagen weg.

**Drei Stellschrauben einmalig:**

1. **Training aus**
2. **Memory aus**
3. **Inkognito-Chat** für sensible Einzelfragen

---

## Echte Ausnahme: Daten Dritter

Persönliche Daten _anderer Menschen_ sind juristisch ein anderes
Kapitel — vor allem aus einer Rolle mit Verantwortung für andere:
Vereinsvorstand, Vermieter, freiberufliche Tätigkeit.

- Privat-Account reicht **nicht**
- Nötig: **Business-Account mit AVV** (Auftragsverarbeitungsvereinbarung)

> Faustregel: eigene Daten ja, auch sensible — fremde Daten nur mit
> DSGVO-Setup.

---

## Mindset: Mitarbeiter, nicht Trainer

**Falsch verstanden.** KI als Coach, der einen aufschlaut. Pingpong:
fragen → kopieren → selbst ausführen → zurückkopieren → wieder fragen.
→ Wer so arbeitet, macht **weiter selbst die Arbeit**.

**Richtig verstanden.** KI als Mitarbeiter / Sekretär. Kompletten Vorgang
übergeben — _„Erledigen Sie das"_ — und erwarten, dass am Ende der
Brief frankiert und eingetütet ist.

Mehr Kontext = mehr Arbeit, die wirklich abgenommen wird.

---

## Leitbeispiel: Brief vom Finanzamt

**Falsch:** _„Was macht man da normalerweise?"_ → KI erklärt das
Vorgehen → du machst die Arbeit trotzdem selbst.

**Richtig:** der KI _Durchgriff_ auf alles geben — neuer Brief plus alle
Steuererklärungen, Schreiben aus Vorjahren, Bescheide, Kontoauszüge,
Lohnabrechnungen, Belege. Auftrag: _„Schreib die Antwort."_ → fertige
Antwort, nur durchlesen und abschicken.

Was noch fehlt: KI dockt noch nicht direkt an Elster an — kommt mit MCP.

---

## Hands-on: Le Chat + Mietplattform

Ziel: per KI eine echte Anfrage auf mieten.rössing.de auslösen.

- **Claude** ist deutlich besser — wer Pro zahlt, nimmt Claude
- **Le Chat** ist ein Kompromiss — heute, weil es gratis ist
- Setup (App, Mietplattform-Konto, MCP-Connector) machen wir
  zusammen — ist gerade auf dem Handy fummelig

---

## Erste Buchung

```
Reserviere mir den Bohrhammer für Samstag.
```

Buchungen sind tageweise. Danach: Verfügbarkeit prüfen, eigene
Buchungen ansehen, Buchung stornieren — alles im Chat.

---

## Was ihr damit alles machen könnt

- 🍳 **Kochrezepte** — Foto vom Kühlschrank, Frage stellen
- 🎨 **Personalisierte Ausmalbilder** für die Kinder
- ✉️ **E-Mails** mit ganzem Thread-Kontext beantworten
- 📄 **Dokumente ausarbeiten** — Antrag, Bewerbung, Beschwerde
- 🖨️ **Druck-PDFs mit Typst** — sauberes Layout, Briefkopf
- 📚 **Datei-Stapel analysieren** — 30 PDFs, eine Frage über alle

---

## Spracheingabe

Wer lieber spricht als tippt:

- _Dictate Keyboard_ (Android, eigener API-Key) — als System-Tastatur
  überall verfügbar
- _WhisperInput_ (offline, Open Source) — funktioniert ohne
  Internetverbindung

<span class="muted">Heute kein Hands-on — die meisten dieser Tools
brauchen einen eigenen API-Key.</span>

---

## In Kontakt bleiben

**Wie wollen wir in Kontakt bleiben?** Eure Ideen sind willkommen.

Mein Vorschlag: in ein paar Wochen wieder treffen — und reihum erzählen,
was jeder mit KI gemacht hat. Daraus entsteht der Austausch, der in
90 Minuten nicht reinpasst.

<br>

📧 post@levinkeller.de · 🌐 levinkeller.de · 🏘️ rössing.de

<span class="muted">Eine Spende für Saalmiete und Getränke ist
willkommen. — Danke fürs Mitmachen!</span>
