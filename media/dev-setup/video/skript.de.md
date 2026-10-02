# Erklärvideo „Viele Agenten, ein Arbeitsplatz“ (DE)

Sprechertext für das Video auf https://levinkeller.de/de/docs/dev-setup/. Ein Sprecher, KI-generierte
Stimme (Gemini TTS, siehe `stimme.json`). Einzige Quellen: die Dev-Setup-Seiten und `llms.txt`.
Gewichtung: Bequemlichkeit und Sicherheit gleichrangig, die Bequemlichkeit zuerst (Szenen 2–12),
die Sicherheit kompakt am Ende (Szenen 13–15).

Format: Jede Überschrift `## <Nummer>` ist eine Szene. Zeilen mit `>` beschreiben das Bild und werden
nicht gesprochen, alles andere ist Sprechertext. Vertonen mit `python3 skripte/vertonen.py de`.

## 1 · Viele Agenten, ein Arbeitsplatz

> Titel. Vier Agenten-Terminals arbeiten parallel. Rechts zwei Fragen: „Wo laufen sie?“ (bequem) und „Was dürfen sie?“ (sicher).

Ich schreibe kaum noch Code von Hand. Mehrere Claude-Code-Agenten arbeiten gleichzeitig an verschiedenen Repositories, und ich lese, lenke und entscheide. Dafür braucht es einen Arbeitsplatz, der zwei Fragen beantwortet: Wo laufen all diese Agenten, bequem und von überall erreichbar? Und was dürfen sie, ohne meine Identität zu bekommen?

## 2 · Die Maschine mieten

> Gemieteter Server aus der Hetzner-Serverbörse: 62 GB RAM, rund um die Uhr, zweistelliger Eurobetrag im Monat. Der Arbeitsspeicher füllt sich mit Drohnen.

Die wichtigste Entscheidung im ganzen Setup: Die Maschine wird gemietet, nicht gekauft. Bei mir: ein gebrauchter Bare-Metal-Server aus der Hetzner-Serverbörse mit zweiundsechzig Gigabyte Arbeitsspeicher. Er läuft rund um die Uhr und kostet einen zweistelligen Eurobetrag im Monat. Fünf bis zehn Umgebungen laufen dort gleichzeitig, und knapp wird der Speicher, nicht die Rechenzeit.

## 3 · Kein fetter Laptop

> Links der teure Laptop mit 64 GB: zehnmal npm install, Temperatur und Lüfter steigen, Akku leert sich. Rechts das MacBook Neo: leicht, kühl, voller Akku. Deckel zu, die Agenten arbeiten weiter.

Die Alternative wäre ein Laptop mit vierundsechzig Gigabyte. Der kostet mehrere tausend Euro, ist nach ein paar Jahren veraltet und hat nur einen Akku und einen Lüfter. Zehn Agenten mit npm install, und er wird laut, heiß und leer. Mein Laptop ist ein MacBook Neo: leicht, lange Akkulaufzeit, schönes Display. Er bleibt kühl, denn gerechnet wird woanders. Und klappe ich ihn zu, arbeiten die Agenten weiter.

## 4 · Arbeiten von überall

> Server in der Mitte, rundherum Schreibtisch, Zug und Handy. Größerer Server. Dann fällt der Server aus: Der Code liegt auf GitHub, die Drohnen entstehen aus ihrer devcontainer.json neu.

Weil die Arbeit auf dem Server lebt, ist egal, wo ich bin: am Schreibtisch, im Zug oder nur mit dem Handy. Reicht der Server nicht mehr, kündige ich ihn und miete einen größeren. Und fällt er aus, liegt der Code trotzdem auf GitHub. Jede Umgebung lässt sich aus ihrer devcontainer-Punkt-json auf einem anderen Rechner neu bauen.

## 5 · Sprechen statt tippen

> Mikrofon und Wellenform, daraus wird Text im Prompt eines Agenten. Whispering, Open Source.

Getippt wird übrigens wenig. Ich spreche. Mit Whispering, einem Open-Source-Werkzeug für Speech-to-Text, erkläre ich einem Agenten zwei Minuten lang, was ich will. Das ist schneller als Tippen und meistens genauer, weil man beim Sprechen mehr Kontext gibt.

## 6 · Jede Umgebung ein Rechner

> Tailnet: Laptop und Handy, Drohnen mit Namen. Adresszeile mit dem Namen einer Drohne. Stempel „Erreichbarkeit ≠ Sicherheit“.

Meine Geräte und alle Umgebungen hängen in einem privaten WireGuard-Netz, einem Tailnet. Jede Umgebung ist darin ein eigener Rechner mit eigenem Namen. Den Dev-Server einer Umgebung rufe ich einfach über ihren Namen auf, vom Laptop wie vom Handy. Keine Ports verteilen, nichts offen zum Internet. Aber: Das Tailnet sorgt für Erreichbarkeit, nicht für Sicherheit. Hinein komme ich nur mit meinem Schlüssel.

## 7 · Hatchery: ein Befehl

> Terminal: hatchery spawn levino/shipyard. Features wandern in die Drohne: SSH-Server, Tailscale, GitHub-CLI, Claude Code, zellij. Weitere Drohnen schlüpfen daneben.

Die Umgebungen verwaltet Hatchery, ein kleines Open-Source-Werkzeug. Ein Befehl, hatchery spawn mit dem Namen des Repos, und Hatchery baut daraus einen Devcontainer, aus der devcontainer-Punkt-json im Repo selbst. Dazu steckt es hinein, was ich brauche: SSH-Server, Tailscale, GitHub-CLI, Claude Code und zellij. Eine Umgebung pro Repository, viele parallel.

## 8 · Wegwerfbar, nicht vergesslich

> spawn, burrow, unburrow, slay. Die Drohne wird gelöscht und neu gebaut, Code und Claude-Zustand bleiben auf dem Host. Daneben: läuft auch in Codespaces, dotfiles in jeder Drohne.

Im Stil der Zerg heißen sie Drohnen: Man spawnt sie, gräbt sie ein und erledigt sie. Eine Drohne ist wegwerfbar. Code und Claude-Zustand, also Login, Gedächtnis und Verlauf, liegen auf dem Host. Nach einem Neubau weiß der Agent noch, woran er war. Die Repos bleiben portabel, dieselbe Konfiguration läuft auch in Codespaces. Und meine dotfiles kommen in jede Drohne.

## 9 · Der Arbeitsplatz

> zellij mit mehreren Agenten. Die Verbindung reißt ab (Tunnel), die Agenten arbeiten weiter, beim Wiederverbinden ist alles da. Drohnen als Kollegen: fertig, Frage, Entscheidung.

Mein Arbeitsplatz ist ein Terminal: per SSH in eine Drohne, dort zellij, mehrere Agenten nebeneinander. Die Sitzung lebt weiter, wenn die Verbindung abreißt. Zug im Tunnel, egal: Beim nächsten Verbinden ist alles noch da, und die Agenten haben weitergearbeitet. Zwischen den Drohnen wechsle ich wie zwischen Kollegen: Wer ist fertig, wer hat eine Frage, wer braucht eine Entscheidung?

## 10 · Ohne Rückfragen

> Erlaubnis-Dialoge verschwinden. Plakette „--dangerously-skip-permissions“, daneben die Gründe mit Haken.

Rückfragen schalte ich in der Drohne ab. Das klingt gefährlicher, als es ist, denn die Drohne ist die Sandbox: wegwerfbar, ihr Token reicht nur für ihre Repos, und alles, was meine Identität braucht, braucht meinen Finger. Ein Agent, der ständig fragt, ist kein Agent, sondern ein sehr langsamer Kollege.

## 11 · Warum nicht Codespaces?

> Gegenüberstellung Codespaces und Drohne: SSH, Terminal, Leerlauf.

Warum nicht GitHub Codespaces? Per SSH komme ich dort nicht einfach hinein, nur durch einen Tunnel. Also lief Claude Code im Terminal von VS Code, mit Darstellungsfehlern und Sitzungen, die bei jedem Abbruch weg waren. Und nach dreißig Minuten Leerlauf hält Codespaces die Umgebung an. Für Agenten, die stundenlang arbeiten, ist das nutzlos. Eine Drohne ist ein normaler Rechner, und angehalten wird nichts.

## 12 · Vom Handy aus

> Handy mit Claude-App, Remote Control zur laufenden Sitzung. Der Agent fragt, ich antworte per Sprache.

Vom Handy aus nutze ich kein SSH, sondern die Remote Control von Claude Code. Die laufende Sitzung führe ich in der Claude-App weiter: sehen, was der Agent tut, seine Fragen beantworten, die nächste Aufgabe geben, gern per Spracheingabe. Nur wenn er meinen SSH-Schlüssel braucht, muss ich an den Mac.

## 13 · Der Agenten-Kanal

> Credential-Service, Socket in die Drohne, bei jedem Zugriff ein frischer Token, nur levino/shipyard, Push zu GitHub. Anderes Repo: 403. repo connect und disconnect.

Bleibt die zweite Frage: Was dürfen die Agenten? Dafür gibt es zwei getrennte Kanäle. Der Agenten-Kanal läuft über eine GitHub-App. Ein Credential-Service auf dem Host legt jeder Drohne einen Unix-Socket hinein. Bei jedem Zugriff holt sich git dort einen frischen Token, nur für die freigegebenen Repositories. Alles andere: 403. Gespeichert wird nichts, die Identität ist der Mount selbst. Freigaben ändere ich zur Laufzeit und entziehe sie sofort. Die eine Stunde Gültigkeit zählt nur, falls ein Token doch herausgelangt.

## 14 · Der Mensch-Kanal

> SSH-Schlüssel im Secure Enclave, Touch ID, ssh -A an der Leine. Gestrichelte Linie zum Prod-Server: „nur mit Finger“.

Der Mensch-Kanal bin ich. Mein SSH-Schlüssel liegt im Secure Enclave meines Macs und lässt sich nicht exportieren. Jede einzelne Signatur will meinen Fingerabdruck. Auch per Agent-Forwarding hängt er an der Leine: Ein Agent kann nicht heimlich auf einen Produktionsserver springen. Er kann mich höchstens fragen.

## 15 · Wo es endet

> GitHub, dann CI und Argo CD zum Cluster, in Grün. Agenten hören bei GitHub auf.

Das Setup endet bei GitHub. Agenten pushen Branches und öffnen Pull Requests, ab da übernehmen CI und Argo CD. Zugang zum Cluster brauchen sie dafür nicht.

## 16 · Mehr lesen

> levinkeller.de/docs/dev-setup, llms.txt, Open-Source-Repos. „Stimme: KI-generiert“.

Die ganze Architektur, mit Begründungen und Alternativen, steht auf levinkeller Punkt de, unter Docs, Dev-Setup. Oder gib die llms Punkt txt deiner eigenen KI und quetsch sie aus.
