---
title: Hatchery und Drohnen
description: 'Ein Container pro Repository, gebaut aus dessen devcontainer.json und verwaltet von einem kleinen Open-Source-Werkzeug.'
sidebar:
  position: 3
---

# Hatchery und Drohnen

## Was es ist

[Hatchery](https://github.com/levino/hatchery) ist ein kleines Open-Source-Werkzeug,
das ich für genau dieses Setup geschrieben habe. Es verwaltet Entwicklungsumgebungen
auf dem Server: pro Repository (oder pro Aufgabe) einen Devcontainer. In
Hatchery-Sprache heißen diese Container **Drohnen**. Das ganze Werkzeug ist im
StarCraft-Zerg-Stil benannt, weil mir das Spaß macht: Drohnen werden gespawnt,
eingegraben (`burrow`), wieder ausgegraben (`unburrow`) und erledigt (`slay`).

## Wie eine Drohne entsteht

```bash
hatchery spawn levino/shipyard
```

Hatchery klont das Repository auf den Host und startet daraus mit der offiziellen
[Devcontainer-CLI](https://containers.dev) einen Container, und zwar mit der
`devcontainer.json`, die **im Repository selbst** liegt. Dazu schmuggelt es ein paar
Features hinein:

- einen SSH-Server, damit ich mich verbinden kann,
- Tailscale, damit die Drohne ein [eigener Rechner im Tailnet](/de/docs/dev-setup/network) wird,
- die GitHub-CLI,
- ein eigenes Hatchery-Feature: Claude Code, [zellij](https://zellij.dev), die
  Credential-Helfer für Git und `gh` (siehe
  [Identität und Zugriff](/de/docs/dev-setup/identity)) und eine Fallback-`CLAUDE.md`
  mit Grundregeln für Agenten.

Das Repository selbst braucht dafür **nichts Hatchery-spezifisches**. Dieselbe
`devcontainer.json` funktioniert unverändert in GitHub Codespaces oder lokal in VS
Code. Hatchery ist austauschbar, die Repos bleiben portabel.

Auf Wunsch lädt Hatchery zusätzlich meine
[dotfiles](https://github.com/levino/dotfiles) in jede Drohne: Shell-Konfiguration,
Git-Einstellungen, eine globale `CLAUDE.md` und Skills mit meinen Coding-Konventionen.

## Was überlebt und was nicht

Eine Drohne ist wegwerfbar. Was nicht wegwerfbar sein darf, liegt auf dem Host und
wird hineingemountet:

- **der Code**, als Git-Worktree auf dem Host,
- **der Zustand von Claude Code**: Login, Einstellungen, Gedächtnis und Verlauf.

Man kann eine Drohne also komplett neu bauen (etwa weil sich die `devcontainer.json`
geändert hat), und der Agent weiß danach noch, woran er gearbeitet hat. Neu einloggen
bei Claude muss ich mich nur einmal pro neuer Drohne.

## Docker ist die einzige Wahrheit

Hatchery hat keine eigene Datenbank. Welche Drohnen es gibt, steht in den Labels der
Docker-Container, sonst nirgends. `hatchery list` fragt Docker. Dadurch kann der
Zustand von Hatchery nie vom tatsächlichen Zustand abweichen, und man kann Drohnen
auch mit ganz normalen Docker-Befehlen anfassen.

Neben der CLI gibt es einen kleinen Dienst, der dauerhaft läuft: den
**Credential-Service**. Er beobachtet die Docker-Events und richtet für jede
startende Drohne ihren Zugang zu GitHub ein. Das ist der interessante Teil, er hat
eine [eigene Seite](/de/docs/dev-setup/identity).

## Alternativen und warum nicht

Bevor ich Hatchery geschrieben habe, habe ich das Vorhandene ausprobiert:

- **GitHub Codespaces.** Gescheitert ist es an der Arbeitsweise, nicht am Preis. In
  einen Codespace komme ich nicht einfach per SSH wie auf jeden anderen Rechner. Es
  gibt nur `gh codespace ssh`, einen Tunnel über die GitHub-CLI, der dazu noch einen
  SSH-Server im Image braucht. Also lief Claude Code bei mir im Terminal von VS Code
  (oft VS Code im Browser), und das war zäh: Darstellungsfehler, Trägheit, und immer
  wieder riss die Verbindung ab und die Sitzung war weg. Außerdem hält Codespaces eine
  Umgebung an, sobald sie eine Weile nicht benutzt wird (Standard: 30 Minuten
  Leerlauf). Agenten, die stundenlang im Hintergrund arbeiten, passen in dieses Modell
  nicht. Dazu kommt das Geld: Abgerechnet wird nach Stunden und Kernen, mit festen
  Maschinengrößen und fest an GitHub gebunden. Für zehn parallel laufende Umgebungen
  den ganzen Tag wird das teuer. Eine Drohne dagegen ist ein ganz normaler Rechner im
  Tailnet: `ssh` drauf, zellij starten, und die Sitzung überlebt jeden
  Verbindungsabbruch. Angehalten wird nichts.
- **DevPod.** Gute Idee, aber der Zustand liegt beim Client: Welche Umgebungen es
  gibt, weiß der Laptop, auf dem man sie angelegt hat. Ich will vom Handy, vom Laptop
  und vom Server aus dasselbe sehen.
- **Coder und ähnliche Plattformen.** Mächtig, bringen aber Kubernetes oder eine
  eigene Plattform mit, die man betreiben muss. Für einen Menschen mit einem Server
  ist das zu viel.
- **Einfach Docker von Hand.** Geht, aber dann baut man genau die Dinge immer wieder
  von Hand, die Hatchery automatisiert: Tailnet-Beitritt, SSH-Schlüssel, Tokens.

Den Ausschlag hat am Ende das Thema Zugangsdaten gegeben: Keine der Alternativen
löst gut, wie ein Agent in der Umgebung an GitHub kommt, ohne dafür meine volle
Identität zu bekommen.
