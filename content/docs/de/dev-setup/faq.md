---
title: FAQ
description: 'Häufige Fragen zum Dev-Setup.'
sidebar:
  position: 8
---

# FAQ

## Warum nicht einfach `gh auth login` in der Umgebung?

Weil der Agent dann *ich* ist. Der Token aus `gh auth login` gilt für alle
Repositories in allen Organisationen, auf die ich Zugriff habe, und er läuft nicht
nach einer Stunde ab. Die Drohne bekommt stattdessen Tokens einer GitHub-App, die nur
für ihre Repositories gelten. Mehr unter
[Identität und Zugriff](/de/docs/dev-setup/identity).

## Warum keine SSH-Schlüssel in den Drohnen?

Aus demselben Grund. Ein SSH-Schlüssel für GitHub ist an mein Konto gebunden und
öffnet alles. Ein Schlüssel, der in einer Drohne liegt, kann außerdem kopiert
werden. Mein einziger Schlüssel liegt im Secure Enclave meines Macs und kann ihn
nicht verlassen.

## Aber du reichst den SSH-Agent doch per `ssh -A` weiter?

Ja. Das ist der Mensch-Kanal. Die Drohne kann meinen Schlüssel benutzen, aber nur mit
meinem Fingerabdruck, und zwar bei jeder einzelnen Signatur. Ein Agent kann damit
nichts heimlich tun. Manchmal lasse ich bewusst eine Verbindung für eine Weile offen,
damit ich nicht dauernd bestätigen muss – das ist dann eine Entscheidung auf Zeit.

## Ist das Tailnet nicht die eigentliche Sicherheitsschicht?

Nein. Das Tailnet sorgt dafür, dass ich jede Drohne unter ihrem Namen erreiche. Wer im
Tailnet ist, braucht trotzdem meinen Schlüssel, um sich anzumelden. Und der
Dev-Server ist absichtlich auch ohne Tailnet per SSH erreichbar, als Notausgang, wenn
das Tailnet klemmt. Siehe [Netz](/de/docs/dev-setup/network).

## Warum nicht GitHub Codespaces oder DevPod?

Bei Codespaces war die Arbeitsweise das Problem. Per SSH wie auf jeden anderen
Rechner komme ich nicht hinein, nur über den Tunnel `gh codespace ssh`. Claude Code
lief deshalb im Terminal von VS Code, mit Darstellungsfehlern, Trägheit und
abreißenden Sitzungen. Und nach einer Leerlaufzeit (Standard: 30 Minuten) hält
Codespaces die Umgebung an, was zu Agenten, die stundenlang im Hintergrund arbeiten,
nicht passt. Teuer bei vielen Dauer-Umgebungen und an GitHub gebunden ist es
obendrein. Eine Drohne erreiche ich mit ganz normalem `ssh` über das Tailnet, die
zellij-Sitzung überlebt Verbindungsabbrüche, und nichts geht in den Leerlauf. DevPod hält den Zustand auf dem Client, ich will aber von jedem Gerät
dasselbe sehen. Und keine der beiden Lösungen beantwortet gut, wie der Agent an
GitHub kommt, ohne meine Identität zu bekommen. Die Repositories bleiben aber
kompatibel: Jede `devcontainer.json`, die Hatchery nutzt, funktioniert auch in
Codespaces.

## Ist `--dangerously-skip-permissions` nicht gefährlich?

Auf dem eigenen Laptop: ja. In einer Drohne: kaum. Die Drohne ist wegwerfbar, ihr
Token reicht nur für ihre Repositories, und alles mit meiner Identität braucht meinen
Finger. Das Schlimmste, was ein Agent anrichten kann, ist ein kaputter Branch in einem
freigegebenen Repository.

## Warum ein schwacher Laptop?

Weil er nichts rechnen muss. Die Arbeit passiert auf dem Server. Vom Laptop brauche
ich ein gutes Display, eine gute Tastatur, ein gutes Mikrofon und lange Akkulaufzeit.
Siehe [Rechenleistung](/de/docs/dev-setup/compute).

## Tippst du das alles?

Nein, ich spreche. Mit Speech-to-Text erkläre ich einem Agenten in zwei Minuten, was
ich will. Das ist schneller als Tippen und meistens auch genauer, weil man beim
Sprechen mehr Kontext gibt.

## Und vom Handy?

Kein SSH. Ich schalte in einer laufenden Claude-Code-Sitzung die Remote Control ein
und steuere sie aus der Claude-App. Nur wenn der Agent meinen SSH-Schlüssel braucht,
muss ich an den Mac. Siehe [Arbeitsplatz](/de/docs/dev-setup/workplace).

## Was ist mit iOS-Apps?

Die brauchen macOS. Ich habe dafür eine macOS-VM auf einem Mac Studio, in die Agenten
per SSH kommen. Das ist nicht automatisiert und eher eine Randnotiz, siehe
[Native Apps](/de/docs/dev-setup/native-apps). Android läuft dagegen direkt in einer
Drohne auf dem Server.

## Was kostet das?

Der Server ist ein gebrauchter dedizierter Rechner aus der Hetzner-Serverbörse und
kostet einen zweistelligen Eurobetrag im Monat. Tailscale ist für Privatleute
kostenlos, Headscale und Hatchery sind Open Source. Der größte Posten ist das
Abonnement für die Agenten selbst.

## Kann ich Hatchery benutzen?

Ja, es ist [Open Source](https://github.com/levino/hatchery). Es ist allerdings für
genau meinen Anwendungsfall gebaut: ein Mensch, ein Server, GitHub. Die Ideen lassen
sich aber auch ohne Hatchery übernehmen: eine GitHub-App für Agenten-Tokens, ein
Hardware-gebundener SSH-Schlüssel für den Menschen und Umgebungen, die man
wegwerfen kann.
