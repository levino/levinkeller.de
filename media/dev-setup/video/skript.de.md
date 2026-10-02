# Erklärvideo „Die Drohne ist die Sandbox“ (DE)

Sprechertext für das Video auf https://levinkeller.de/de/docs/dev-setup/. Ein Sprecher, KI-generierte
Stimme (Gemini TTS, siehe `stimme.json`). Einzige Quellen: die Dev-Setup-Seiten und `llms.txt`.

Format: Jede Überschrift `## <Nummer>` ist eine Szene. Zeilen mit `>` beschreiben das Bild und werden
nicht gesprochen, alles andere ist Sprechertext. Vertonen mit `python3 skripte/vertonen.py de`.

## 1 · Die Frage

> Titel „Die Drohne ist die Sandbox“. Mehrere Agenten-Cursor bei der Arbeit, ein Ausweis bleibt weggeschlossen.

Ich schreibe kaum noch Code von Hand. Meistens arbeiten mehrere Claude-Code-Agenten gleichzeitig an verschiedenen Repositories, und ich lese, lenke und entscheide. Bleibt eine Frage: Wie gibt man Agenten so viel Freiheit, ohne ihnen die eigene digitale Identität auszuhändigen?

## 2 · Server statt Laptop

> Links ein leichter Laptop, rechts ein großer gebrauchter Server, dessen Arbeitsspeicher sich mit Drohnen füllt.

Es beginnt beim Blech. Alles läuft auf einem gebrauchten Bare-Metal-Server: ein älterer Vierkerner mit zweiundsechzig Gigabyte Arbeitsspeicher. Agenten brauchen vor allem Speicher, nicht Rechenleistung. Der Laptop ist damit nur noch ein Terminal mit gutem Bildschirm. Und die Agenten arbeiten weiter, wenn der Deckel zu ist.

## 3 · Tailnet: Erreichbarkeit, nicht Sicherheit

> Drohnen als Rechner mit Namen in einem gestrichelten Netz. Stempel: „Erreichbarkeit ≠ Sicherheit“.

Jede Umgebung kommt als eigener Rechner, mit eigenem Namen, in ein privates WireGuard-Netz, ein Tailnet. Keine Ports merken, nichts ist zum Internet offen. Aber das Tailnet sorgt für Erreichbarkeit, nicht für Sicherheit. Hinein komme ich trotzdem nur mit meinem Schlüssel.

## 4 · Hatchery und Drohnen

> Terminal: hatchery spawn levino/shipyard. Eine Drohne schlüpft; spawn, burrow, unburrow, slay. Code und Claude-Zustand bleiben auf dem Host.

Verwaltet werden die Umgebungen von Hatchery, einem kleinen Open-Source-Werkzeug. Ein Devcontainer pro Repository, gebaut aus der devcontainer-Punkt-json des Repos selbst. Ganz im Stil der Zerg heißen sie Drohnen: Man spawnt sie, gräbt sie ein und erledigt sie. Eine Drohne ist wegwerfbar. Der Code und das Gedächtnis von Claude liegen auf dem Host.

## 5 · Der Agenten-Kanal

> Credential-Service, Socket in die Drohne, bei jedem Zugriff ein frischer Token, nur levino/shipyard, Push zu GitHub. Anderes Repo: 403.

Jetzt das Herzstück: zwei getrennte Kanäle. Der Agenten-Kanal läuft über eine GitHub-App. Ein Credential-Service auf dem Host kennt den Schlüssel der App und legt jeder Drohne einen Unix-Socket hinein. Bei jedem Zugriff holt sich git dort einen frischen Token, nur für die Repositories dieser Drohne. Alles andere: 403. Gespeichert wird nichts. Die Identität ist der Mount selbst. Und ein geleakter Token ist nach spätestens einer Stunde wertlos.

## 6 · Der Mensch-Kanal

> SSH-Schlüssel im Secure Enclave, Touch ID, ssh -A an der Leine. Gestrichelte Linie zum Prod-Cluster: „nur mit Finger“.

Der Mensch-Kanal bin ich. Mein SSH-Schlüssel liegt im Secure Enclave meines Macs und lässt sich nicht exportieren. Jede einzelne Signatur will meinen Fingerabdruck. Selbst mit Agent-Forwarding kann ein Agent also nicht heimlich auf einen Produktionsserver springen. Er kann mich höchstens fragen.

## 7 · Der Arbeitsplatz

> zellij mit mehreren Agenten-Panes. Plakette „--dangerously-skip-permissions“. Handy per Remote Control.

Mein Arbeitsplatz ist ein Terminal: per SSH in eine Drohne, zellij, mehrere Agenten nebeneinander. Sie laufen ohne Rückfragen, denn die Drohne ist die Sandbox. Sie ist wegwerfbar, ihr Token ist begrenzt, und alles Heikle braucht meinen Finger. Unterwegs führe ich die Sitzung auf dem Handy weiter, über die Remote Control von Claude.

## 8 · Wo es endet

> GitHub, dann CI und Argo CD zum Cluster, in Grün. Agenten hören bei GitHub auf.

Dieses Setup endet dort, wo der Code bei GitHub ankommt. Ab da übernehmen CI und Argo CD. Agenten pushen Branches und öffnen Pull Requests. Zugang zum Cluster brauchen sie dafür nicht.

## 9 · Mehr lesen

> levinkeller.de/docs/dev-setup, llms.txt, Open-Source-Repos. „Stimme: KI-generiert“.

Die ganze Architektur, mit Begründungen und Alternativen, steht auf levinkeller Punkt de, unter Docs, Dev-Setup. Oder gib die llms Punkt txt deiner eigenen KI und quetsch sie aus.
