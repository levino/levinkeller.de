---
title: 'Rechenleistung: mieten statt kaufen'
description: 'Einen kräftigen Server im Rechenzentrum mieten statt einen kräftigen Laptop kaufen.'
sidebar:
  position: 1
---

# Rechenleistung: mieten statt kaufen

## Was es ist

Ein einzelner gemieteter Bare-Metal-Server in einem Rechenzentrum, auf dem alle
Entwicklungsumgebungen laufen. Bei mir ist das seit November 2026 ein
[Hetzner EX63](https://www.hetzner.com/dedicated-rootserver/ex63/) in Falkenstein[^vorher]:

- Intel Core Ultra 7 265 mit 20 Kernen (8 Performance-, 12 Effizienzkerne)
- 64 GB DDR5-RAM
- 2× 1 TB NVMe
- 149 € netto im Monat inklusive IPv4, einmalig 74 € Einrichtung
- keine Mindestlaufzeit, stundengenaue Abrechnung, sofort kündbar

**Mieten statt kaufen** ist dabei die wichtigste Entscheidung im ganzen Setup. Ein
Laptop mit 64 GB RAM kostet mehrere tausend Euro, ist nach ein paar Jahren veraltet
und hat trotzdem nur einen Akku und einen Lüfter. Für das Geld läuft der gemietete
Server jahrelang, und wenn er nicht mehr reicht, kündige ich ihn und miete einen
größeren.

## Welche Rolle er spielt

Er ist das Arbeitspferd. Jedes Repository, an dem ein Agent arbeitet, bekommt dort
einen eigenen Container mit eigener Toolchain, eigenen Dependencies, eigenem
Dev-Server und eigenen Tests. Fünf bis zehn davon gleichzeitig sind normal.

Agenten brauchen **Arbeitsspeicher und Kerne**. Jeder Container hält seinen
Node-Prozess, seinen Language-Server, seinen Testrunner, manchmal einen Browser für
End-to-End-Tests – das kostet RAM. Und sobald mehrere Agenten gleichzeitig bauen,
testen und Dev-Server starten, wird die **CPU** zum Engpass: Mit zu wenigen Kernen
warten die Agenten aufeinander. Dazu kommen Android-Emulatoren für App-Tests. Die laufen
ohne Grafikkarte, rendern also in Software und brauchen pro Instanz mehrere Kerne
und ein paar Gigabyte RAM. Eine gute Größe sind 64 GB RAM und 20 bis 24 schnelle
Kerne.

## Wie ich ihn ausgesucht habe

Ende 2026 sind dedizierte Server spürbar teurer geworden. Hetzner, OVHcloud und netcup
haben ihre Preise erhöht, vor allem wegen gestiegener RAM-Preise. Die Hetzner-Serverbörse
ist dünn geworden: Unter 200 € gab es mit 64 GB nur noch alte Ryzen-Rechner mit
Festplatten. Die günstigen Kimsufi-Server von OVH mit 24 Kernen waren ausverkauft.

Am Ende lag der neue EX63 vorn. Pro Kern ist er deutlich schneller als alte EPYC- oder
Xeon-Maschinen mit mehr Kernen, und genau das zählt bei TypeScript-Builds,
Language-Servern und Emulatoren. Der Haken: Das RAM ist fest. Mehr als 64 GB gibt es
beim EX63 nur in einer deutlich teureren Variante. Weil es keine Laufzeit gibt, ist
das aber kein großes Risiko: Reicht es nicht, kündige ich und miete etwas Größeres.

## Was er bringt: Miete die Maschine, kauf keinen starken Laptop

Das ist die eigentliche Pointe. Wenn die Arbeit auf dem Server passiert, ist der
Laptop nur noch ein Terminal mit gutem Bildschirm. Ich arbeite auf einem MacBook Neo:
leicht, lange Akkulaufzeit, schönes Display, und für das, was er tun muss, mehr als
schnell genug. Er wird nicht warm, wenn zehn Agenten gleichzeitig `npm install`
ausführen, denn das passiert woanders.

Dazu kommt: Mit Agenten tippe ich wenig. Ich spreche. Für Spracheingabe nutze ich
[Whispering](https://github.com/epicenter-so/epicenter), ein Open-Source-Tool für
Speech-to-Text. Einem Agenten zwei Minuten lang zu erklären, was ich will, ist
schneller und meist präziser als es aufzuschreiben.

Und: Die Agenten arbeiten weiter, wenn der Laptop zugeklappt ist.

## Alternativen

- **Lokal auf dem Laptop.** Geht, solange es ein oder zwei Agenten sind. Danach
  wird der Laptop laut, heiß und leer, und jede Reise unterbricht die Arbeit.
- **Cloud-VMs nach Stunden** (AWS, GCP, Hetzner Cloud). Flexibel, aber für eine
  Maschine, die ohnehin den ganzen Tag läuft, deutlich teurer als dedizierte Hardware.
- **Gehostete Umgebungen** wie GitHub Codespaces. Kein normaler SSH-Zugang, Umgebungen
  werden im Leerlauf angehalten, pro Stunde und Kern bezahlt, und man ist an einen
  Anbieter gebunden. Mehr dazu bei
  [Hatchery](/de/docs/dev-setup/hatchery).
- **Ein Rechner zu Hause.** Funktioniert, hängt aber an der heimischen Leitung und
  am heimischen Strom.

## Warum so

Ein gemieteter dedizierter Server ist die billigste Art, viel RAM und viele Kerne
dauerhaft verfügbar zu haben, und die bequemste: Ich muss keine Hardware kaufen,
aufrüsten oder mit mir herumtragen. Für Entwicklungsumgebungen brauche ich keine Hochverfügbarkeit:
Fällt der Server aus, ist der Code trotzdem auf GitHub, und die Umgebungen lassen
sich aus ihren `devcontainer.json`-Dateien auf jedem anderen Rechner neu bauen.

[^vorher]: Vorher hatte ich einen kleineren, billigeren Server: einen Intel-Vierkerner
    mit 62 GB RAM für einen zweistelligen Eurobetrag im Monat. Der hat irgendwann
    einfach nicht mehr gereicht, deshalb jetzt der größere.
