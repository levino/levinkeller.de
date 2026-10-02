---
title: Netz
description: 'Ein Tailnet sorgt dafür, dass jede Umgebung erreichbar ist. Für die Sicherheit ist es nicht zuständig.'
sidebar:
  position: 2
---

# Netz: Erreichbarkeit, nicht Sicherheit

## Was es ist

Alle meine Geräte und alle Entwicklungsumgebungen hängen in einem gemeinsamen
privaten Netz, einem **Tailnet** auf Basis von WireGuard. Ich nutze
[Tailscale](https://tailscale.com) als Client. Die Koordination übernimmt bei mir
[Headscale](https://github.com/juanfont/headscale), die Open-Source-Implementierung
des Tailscale-Kontrollservers. Ich betreibe sie selbst und melde mich über meinen
eigenen Identity-Provider an. Für den Einstieg ist das kostenlose Tailscale-Angebot
genauso gut, Headscale ist eine Randnotiz für Leute, die alles selbst hosten wollen.

## Welche Rolle es spielt

Jede Entwicklungsumgebung tritt dem Tailnet als **eigener Rechner** bei, mit eigenem
Namen. Alle lauschen auf denselben Ports, sie unterscheiden sich nur im Namen:
`hatchery-levino-shipyard`, `hatchery-levino-levinkeller-de` und so weiter. Statt mir zu
merken, welche Umgebung auf dem Server an welchem Port hängt, spreche ich sie direkt
an. Auf dem Server muss ich keine Ports verteilen,
keine Portweiterleitungen pflegen und nichts ins Internet öffnen. Will ich den
Dev-Server einer Umgebung im Browser sehen, rufe ich einfach ihren Namen mit dem
Port auf, egal ob vom Laptop oder vom Handy.

Die Umgebungen sind im Tailnet als **flüchtige** Knoten registriert: Wird eine
gelöscht, verschwindet sie nach einer Weile von selbst aus der Geräteliste.

## Was es *nicht* ist

Das Tailnet ist **nicht** meine Sicherheitsschicht. Es ist bequem, und es reduziert
die Angriffsfläche, aber ich verlasse mich nicht darauf. Wer im Tailnet ist, kommt
deshalb noch lange nicht in eine Umgebung: Jede verlangt beim SSH-Login meinen
Schlüssel, und der braucht meinen Fingerabdruck (siehe
[Identität und Zugriff](/de/docs/dev-setup/identity)). Passwort-Login ist aus.

Das hat einen praktischen Grund: Ein Netz, das einmal falsch konfiguriert ist, ein
Gerät, das verloren geht, eine Freigabe, die man vergessen hat – all das passiert.
Wenn die Sicherheit an einer einzigen Schicht hängt, ist das eine zu viel.

## Absichtlich mit Hintertür

Der Server selbst ist zusätzlich ganz normal per SSH aus dem Internet erreichbar.
Das ist Absicht: Wenn das Tailnet klemmt (und das tut es gelegentlich), komme ich
trotzdem drauf und kann es reparieren. Ein Netz, das man nur über sich selbst
reparieren kann, ist eine Falle.

## Alternativen

- **Ports auf dem Host öffnen** und per SSH-Tunnel arbeiten. Geht, skaliert aber
  schlecht: Jede Umgebung braucht eigene Ports, und man muss sie sich merken.
- **Ein klassisches VPN** (OpenVPN, reines WireGuard). Funktioniert, aber man pflegt
  Schlüssel und IP-Adressen von Hand, und neue Umgebungen tauchen nicht von allein auf.
- **ZeroTier, Nebula, NetBird.** Ähnliche Idee wie Tailscale. Tailscale hat für mich
  den Ausschlag gegeben, weil es ein fertiges Devcontainer-Feature gibt und weil
  Headscale als freier Kontrollserver existiert.
