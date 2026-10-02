---
title: Grenze zum Deploy-Stack
description: 'Wo das Entwicklungs-Setup aufhört und der Betrieb anfängt – und wo die beiden sich berühren.'
sidebar:
  position: 7
---

# Grenze zum Deploy-Stack

Dieses Setup endet dort, wo Code GitHub erreicht. Wie er von dort in Produktion kommt,
ist ein eigenes System: Kubernetes (k3s), GitOps mit Argo CD, Identitäten über
ZITADEL, alles als Code beschrieben. Das wird ein eigener Teil dieser Doku.

Die beiden Systeme sind getrennt, berühren sich aber an genau zwei Stellen.

## Berührungspunkt 1: Git und CI

Agenten pushen Branches und öffnen Pull Requests. Ab da übernimmt die CI: Sie baut,
testet und erzeugt Vorschau-Umgebungen. Diese Website zum Beispiel bekommt für jeden
Pull Request eine eigene Vorschau unter `pr-<nummer>.levinkeller.de`. Nach dem Merge
baut die CI ein Image und trägt die neue Version in einen Deploy-Branch ein, den
Argo CD im Cluster ausrollt.

Ein Agent braucht für all das **keinen Zugang zum Cluster**. Er braucht nur sein
Repository. Das ist der wichtigste Grund, warum das Token-Modell aus
[Identität und Zugriff](/de/docs/dev-setup/identity) ausreicht.

## Berührungspunkt 2: mein SSH-Schlüssel

Wenn doch jemand direkt auf einen Produktionsserver muss, um etwas nachzusehen oder
zu reparieren, geht das nur über meinen Schlüssel. Und damit über meinen Finger.
Agenten können mich darum bitten, sie können es nicht selbst.

## Ausblick

Der zweite Teil beschreibt den Deploy-Stack: wie Services entstehen, wie sie
Identitäten und Tokens bekommen und wie man einen neuen Stack aus einer Vorlage
(einer [Copier](https://copier.readthedocs.io)-Vorlage namens
`agentops-community-stack`) anlegt.
