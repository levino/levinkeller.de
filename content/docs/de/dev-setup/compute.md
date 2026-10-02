---
title: Rechenleistung
description: 'Ein kräftiger Server im Rechenzentrum statt eines kräftigen Laptops.'
sidebar:
  position: 1
---

# Rechenleistung: Server statt Laptop

## Was es ist

Ein einzelner Bare-Metal-Server in einem Rechenzentrum, auf dem alle
Entwicklungsumgebungen laufen. Bei mir ist das ein gebrauchter Rechner aus der
Hetzner-Serverbörse: ein älterer Intel-Vierkerner mit 62 GB RAM. Nichts
Besonderes, aber er läuft rund um die Uhr, hängt an einer schnellen Leitung und ist
gebraucht ziemlich günstig zu haben.

## Welche Rolle er spielt

Er ist das Arbeitspferd. Jedes Repository, an dem ein Agent arbeitet, bekommt dort
einen eigenen Container mit eigener Toolchain, eigenen Dependencies, eigenem
Dev-Server und eigenen Tests. Fünf bis zehn davon gleichzeitig sind normal.

Für das, was Agenten tun, ist vor allem **Arbeitsspeicher** knapp, nicht Rechenzeit:
Jeder Container hält seinen Node-Prozess, seinen Language-Server, seinen
Testrunner, manchmal einen Browser für End-to-End-Tests. 16 GB reichen für den
Anfang, mit 64 GB muss man nicht mehr nachdenken. Viele Kerne helfen, wenn mehrere
Agenten gleichzeitig bauen.

## Was er bringt: Kauf dir keinen starken Laptop

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
- **Gehostete Umgebungen** wie GitHub Codespaces. Bequem, aber pro Stunde und Kern
  bezahlt, und man ist an einen Anbieter gebunden. Mehr dazu bei
  [Hatchery](/de/docs/dev-setup/hatchery).
- **Ein Rechner zu Hause.** Funktioniert, hängt aber an der heimischen Leitung und
  am heimischen Strom.

## Warum so

Ein gebrauchter dedizierter Server ist die billigste Art, viel RAM dauerhaft
verfügbar zu haben. Für Entwicklungsumgebungen brauche ich keine Hochverfügbarkeit:
Fällt der Server aus, ist der Code trotzdem auf GitHub, und die Umgebungen lassen
sich aus ihren `devcontainer.json`-Dateien auf jedem anderen Rechner neu bauen.
