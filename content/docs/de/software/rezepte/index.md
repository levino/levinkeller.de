---
title: Rezepte statt Code
description: 'Warum ich für meine eigene Infrastruktur keinen Code teile, sondern Rezepte, aus denen man sie mit einem KI-Assistenten selbst nachbauen kann.'
---

# Rezepte statt Code

Für einige Dienste, die ich für meine Familie und mich betreibe, veröffentliche
ich keinen Quellcode. Stattdessen schreibe ich auf, **wie** sie gebaut sind:
Ziel, Architektur, Entscheidungen, Fallstricke und einen Bauplan. Ein Rezept
eben.

Der Grund ist einfach: Mit einem guten KI-Coding-Assistenten baut man aus so
einem Rezept in wenigen Stunden etwas Gleichwertiges, passend für die eigene
Domain, den eigenen Identity-Provider und die eigenen Vorlieben. Ein Fork
meines Codes wäre dagegen voller Annahmen über meine Umgebung, die man erst
wieder herausoperieren müsste. Das Rezept ist die eigentlich wiederverwendbare
Arbeit.

Ein Nebeneffekt: Wer meinen Code nicht hat, kann ihn auch nicht automatisiert
nach Fehlern durchsuchen. Darauf verlasse ich mich aber nicht. Die Dienste
müssen auch dann sicher sein, wenn jemand weiß, wie sie gebaut sind. Deshalb
gehören Sicherheitsprinzipien in die Rezepte, konkrete Prüfungen und Grenzfälle
nicht.

## Die Rezepte

- [Conversations: ein KI-nativer Mailserver](/de/docs/software/rezepte/conversations)
- [Documents: ein Dokumentenarchiv mit KI-Suche](/de/docs/software/rezepte/documents)

## So benutzt man ein Rezept

1. Rezept lesen und entscheiden, was man davon wirklich braucht.
2. Das Rezept (oder die relevanten Abschnitte) einem KI-Coding-Assistenten
   geben, zusammen mit den eigenen Rahmenbedingungen: Domain, Hosting,
   Identity-Provider, Sprache.
3. Zuerst die Tests bauen lassen, dann die Funktionen. Beide Rezepte setzen auf
   End-to-End-Tests gegen die echte Laufzeitumgebung, ohne externe Dienste.
4. Schritt für Schritt nach dem Bauplan vorgehen und die Fallstricke am Ende
   jedes Rezepts ernst nehmen. Die haben mich jeweils Stunden gekostet.
