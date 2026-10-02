---
title: Arbeitsplatz
description: 'SSH in die Drohne, zellij, mehrere Claude-Code-Agenten parallel – und vom Handy aus per Remote Control.'
sidebar:
  position: 5
---

# Arbeitsplatz

## Am Laptop: SSH, zellij, mehrere Agenten

Mein Arbeitsplatz ist ein Terminal. Ich verbinde mich per SSH mit einer Drohne und
starte dort [zellij](https://zellij.dev), einen Terminal-Multiplexer (ähnlich wie
tmux, aber mit freundlicheren Voreinstellungen). In zellij laufen mehrere Tabs und
Fenster, und in mehreren davon arbeitet je ein Claude-Code-Agent. Die Agenten
starten bei Bedarf eigene Sub-Agenten für Recherche oder Reviews.

zellij hat einen wichtigen Nebeneffekt: Die Sitzung lebt auf der Drohne weiter, wenn
die Verbindung abreißt. Laptop zuklappen, Zug fährt in den Tunnel, egal – beim
nächsten Verbinden ist alles noch da, und die Agenten haben in der Zwischenzeit
weitergearbeitet. Genau das hat mir bei GitHub Codespaces gefehlt: Dort lief Claude
Code im Terminal von VS Code, und wenn die Verbindung abriss, war die Sitzung weg.

Meist habe ich mehrere Drohnen gleichzeitig offen, eine pro Projekt. Zwischen ihnen
wechsle ich, wie man zwischen Kollegen wechselt: Wer ist fertig, wer hat eine Frage,
wer braucht eine Entscheidung?

## Agenten ohne Rückfragen

Claude Code fragt standardmäßig vor jedem Befehl und jeder Dateiänderung um
Erlaubnis. In der Drohne schalte ich das ab (`--dangerously-skip-permissions`). Das
klingt gefährlicher, als es ist, denn **die Drohne ist die Sandbox**:

- Sie ist wegwerfbar und jederzeit aus der `devcontainer.json` neu baubar.
- Der Code liegt in Git, und alles Wichtige landet über Pull Requests auf GitHub.
- Ihr GitHub-Token reicht nur für die freigegebenen Repositories.
- Alles, was meine Identität braucht, braucht meinen Finger.

Ein Agent, der ständig um Erlaubnis fragt, ist kein Agent, sondern ein sehr
langsamer Kollege. Die Sicherheit kommt aus der Umgebung, nicht aus den Rückfragen.

## Was Agenten mitbringen

Jedes Repository hat eine ausführliche `CLAUDE.md` mit Projektwissen, oft dazu
eigene Skills und Sub-Agenten in `.claude/`. Meine persönlichen Konventionen (zum
Beispiel testgetriebene Entwicklung, funktionaler Stil mit
[Effect](https://effect.website), keine Klassen) liegen als Skill in meinen
[dotfiles](https://github.com/levino/dotfiles) und kommen über Hatchery in jede
Drohne.

## Unterwegs: Remote Control statt SSH

Vom Handy aus verbinde ich mich **nicht** per SSH. Ein Terminal auf dem Handy ist
mühsam, und mein Schlüssel liegt ohnehin auf dem Mac. Stattdessen nutze ich die
**Remote Control** von Claude Code: Ich schalte sie in einer laufenden Sitzung ein,
und dann kann ich diese Sitzung in der Claude-App auf dem Handy weiterführen. Ich
sehe, was der Agent tut, beantworte seine Fragen, gebe ihm die nächste Aufgabe.

Das funktioniert gut für das, was man unterwegs eigentlich tut: lesen, entscheiden,
kurz etwas sagen. Spracheingabe auf dem Handy passt dazu.

Der Haken: Wenn der Agent meinen SSH-Schlüssel braucht, muss ich am Mac bestätigen.
Vom Handy aus geht das nicht. In der Praxis stört das selten, denn die Arbeit des
Agenten läuft über den [Agenten-Kanal](/de/docs/dev-setup/identity) und braucht mich
nicht.

## Alternativen

- **VS Code Remote-SSH oder JetBrains Gateway.** Funktioniert mit jeder Drohne, weil
  sie einen ganz normalen SSH-Server hat. Ich brauche die IDE nur selten, weil ich
  kaum noch selbst Code bearbeite.
- **tmux statt zellij.** Genauso gut, wenn man es kennt.
- **Mobile SSH-Clients** wie Blink oder Termius. Gehen, aber ein Agent will gelesen
  und gelenkt werden, nicht bedient. Dafür ist eine Chat-Oberfläche besser.
