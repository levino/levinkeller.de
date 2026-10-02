# Podcast „Die Drohne ist die Sandbox“ – Levin Kellers Dev-Setup für KI-Agenten

Zwei Stimmen, beide KI-generiert, sprechen über das Setup, das unter
https://levinkeller.de/de/docs/dev-setup/ beschrieben ist. Einzige Quelle sind diese Seiten
und `public/de/docs/dev-setup/llms.txt`. Vertont mit `scripts/tts/podcast_vertonen.py`.

## Begrüßung

**MODERATOR:** Kurzer Hinweis vorweg: Die beiden Stimmen in dieser Folge sind KI-generiert. Was ziemlich gut passt, denn heute geht es um ein Setup, in dem fast nur noch KIs Code schreiben. Hallo und willkommen!

**EXPERTIN:** Hallo! Und ja, das ist ein bisschen so, als würden zwei Roboter über eine Roboterfabrik reden. Keine Installationsanleitung übrigens, sondern Architektur: welche Bausteine, und warum.

**MODERATOR:** Wir reden über das Dev-Setup von Levin Keller. Der schreibt nach eigener Aussage kaum noch Code von Hand. Stattdessen arbeiten mehrere Claude-Code-Agenten gleichzeitig an verschiedenen Repositories, und er liest, lenkt und entscheidet.

**EXPERTIN:** Also eher Schichtleiter als Programmierer.

**MODERATOR:** Genau. Und ich gebe zu, mein erster Gedanke war: Moment. Mehrere Agenten, die gleichzeitig auf meinem Rechner herumfuhrwerken, mit meinem GitHub-Account? Da wird mir ein bisschen anders.

**EXPERTIN:** Und genau das ist die Frage, um die sich das ganze Setup dreht. Wie gibt man Agenten möglichst viel Freiheit, ohne ihnen die eigene digitale Identität zu überlassen?

## Kauf dir keinen starken Laptop

**MODERATOR:** Dann fangen wir mal beim Blech an. Worauf läuft das alles?

**EXPERTIN:** Auf einem einzigen Server im Rechenzentrum. Ein gebrauchter Rechner aus der Hetzner-Serverbörse, ein älterer Intel-Vierkerner mit 62 Gigabyte RAM.

**MODERATOR:** Ein älterer Vierkerner. Für eine ganze Agentenarmee.

**EXPERTIN:** Ja, und das ist der erste Aha-Moment. Agenten brauchen vor allem Arbeitsspeicher, nicht Rechenzeit. Jede Umgebung hält ihren Node-Prozess, ihren Language-Server, ihren Testrunner, manchmal noch einen Browser für End-to-End-Tests. Fünf bis zehn solcher Umgebungen gleichzeitig sind bei ihm normal.

**MODERATOR:** Und der Laptop?

**EXPERTIN:** Das ist die eigentliche Pointe, und so steht es da wörtlich: Kauf dir keinen starken Laptop.

**MODERATOR:** Das sagt mir sonst nie jemand. Mir sagen alle immer: Nimm das Pro-Modell, nimm mehr RAM, du wirst es bereuen.

**EXPERTIN:** Wenn die Arbeit auf dem Server passiert, ist der Laptop nur noch ein Terminal mit gutem Bildschirm. Levin arbeitet auf einem MacBook Neo. Leicht, lange Akkulaufzeit, schönes Display. Der wird nicht warm, wenn zehn Agenten gleichzeitig npm install ausführen. Weil das woanders passiert. Und die Agenten arbeiten weiter, wenn er zugeklappt ist.

**MODERATOR:** Zehn parallele npm installs, und der Laptop zuckt nicht mal. Das ist eigentlich schon Wellness.

**EXPERTIN:** Und noch ein Detail: Er tippt kaum noch. Er spricht. Mit einem Open-Source-Tool für Speech-to-Text namens Whispering erklärt er einem Agenten zwei Minuten lang, was er will. Das ist schneller und meistens präziser, weil man beim Sprechen mehr Kontext gibt.

## Hatchery und die Drohnen

**MODERATOR:** Okay, ein Server. Und wie kommen die Agenten da drauf?

**EXPERTIN:** Über ein kleines Open-Source-Werkzeug, das Levin dafür geschrieben hat: Hatchery. Es verwaltet Devcontainer auf dem Server, einen pro Repository. Und diese Container heißen bei Hatchery: Drohnen.

**MODERATOR:** Hatchery, Drohnen … das ist StarCraft, oder? Die Zerg!

**EXPERTIN:** Volltreffer. Das ganze Werkzeug ist im Zerg-Stil benannt, laut Doku einfach, weil es Spaß macht. Drohnen werden gespawnt, eingegraben mit burrow, wieder ausgegraben mit unburrow, und wenn man sie nicht mehr braucht: slay.

**MODERATOR:** Ich finde, jedes Infrastruktur-Tool sollte so heißen. Statt „Container stoppen“ einfach: eingraben.

**EXPERTIN:** Spawn levino slash shipyard, und Hatchery klont das Repo auf den Host und startet mit der offiziellen Devcontainer-CLI einen Container. Und zwar mit der devcontainer-Punkt-json, die im Repository selbst liegt.

**MODERATOR:** Also kein eigenes Hatchery-Format.

**EXPERTIN:** Genau, das finde ich eine der elegantesten Entscheidungen. Das Repo braucht nichts Hatchery-spezifisches. Dieselbe Datei funktioniert unverändert in GitHub Codespaces oder lokal in VS Code. Hatchery schmuggelt nur ein paar Features dazu: einen SSH-Server, Tailscale, Claude Code, zellij und die Credential-Helfer. Auf Wunsch kommen noch Levins dotfiles mit.

**MODERATOR:** Und wenn ich eine Drohne wegwerfe, ist dann alles weg?

**EXPERTIN:** Nein. Was überleben muss, liegt auf dem Host und wird hineingemountet. Der Code als Git-Worktree, und der Zustand von Claude Code: Login, Einstellungen, Gedächtnis, Verlauf. Man kann eine Drohne komplett neu bauen, und der Agent weiß danach noch, woran er gearbeitet hat.

**MODERATOR:** Das ist ja fast unheimlich. Die Drohne stirbt, aber die Erinnerung lebt weiter.

**EXPERTIN:** Sehr Zerg. Und noch ein schönes Detail: Hatchery hat keine eigene Datenbank. Welche Drohnen es gibt, steht ausschließlich in den Labels der Docker-Container. Docker ist die einzige Wahrheit.

**MODERATOR:** Warum hat er das überhaupt selbst gebaut? Es gibt doch Codespaces, DevPod, Coder …

**EXPERTIN:** Hat er alles angeschaut. Codespaces ist bequem, aber nach Stunden und Kernen bezahlt, und zehn Umgebungen den ganzen Tag werden teuer. Bei DevPod weiß nur der Laptop, auf dem man die Umgebung angelegt hat, dass es sie gibt. Coder bringt gleich Kubernetes mit. Aber den Ausschlag gab etwas anderes.

**MODERATOR:** Lass mich raten: die Zugangsdaten.

**EXPERTIN:** Genau. Keine der Alternativen löst gut, wie ein Agent in der Umgebung an GitHub kommt, ohne dafür die volle Identität seines Menschen zu bekommen.

## Das Herzstück: zwei Kanäle

**MODERATOR:** Dann sind wir beim Herzstück.

**EXPERTIN:** Ja. Die Frage ist: Was darf ein Agent, der in seiner Drohne alle Rechte hat, außerhalb dieser Drohne tun? Und die Antwort ist: Es gibt zwei getrennte Kanäle. Über den einen arbeitet der Agent, über den anderen der Mensch.

**MODERATOR:** Fangen wir beim Agenten an. Der naive Weg wäre ja: In der Drohne einmal gh auth login, fertig.

**EXPERTIN:** Und dann ist der Agent du. Der kann dann in jedes deiner Repos schreiben, in jeder Organisation, in der du Mitglied bist, Releases löschen, Einstellungen ändern. Eine präparierte README, und der Schaden ist nicht mehr auf das eine Repo begrenzt.

**MODERATOR:** Okay, das will ich nicht. Was macht Levin stattdessen?

**EXPERTIN:** Er hat eine eigene GitHub-App angelegt und in seinen Organisationen installiert. So eine App kann Installation-Tokens ausstellen, die sich auf einzelne Repositories beschränken lassen. Und sie gehören der App, nicht seinem Benutzerkonto.

**MODERATOR:** Und wer hält den Schlüssel der App?

**EXPERTIN:** Nur ein kleiner Dienst auf dem Host, der Credential-Service. Der beobachtet die Docker-Events und mountet jeder startenden Drohne einen Unix-Socket. Wer an diesem Socket fragt, bekommt einen frischen Token. Aber nur für die Repos, die für genau diese Drohne freigegeben sind. Fragt die Drohne nach einem anderen Repo, gibt es ein vierhundertdrei, inklusive Hinweis, wie man es freigeben könnte.

**MODERATOR:** Höflich abgewiesen.

**EXPERTIN:** Und jetzt kommt mein Lieblingssatz aus der ganzen Doku: Die Identität ist der Mount selbst. Es gibt keine Passwörter und keine Tokens auf der Platte der Drohne. Welche Drohne fragt, ergibt sich daraus, welcher Socket es ist. Und fälschen kann man das nicht, weil der Host den Socket anlegt, nicht der Container.

**MODERATOR:** Das ist hübsch. Wie bei einer Rohrpost: Wer am Rohr hängt, ist automatisch der Absender.

**EXPERTIN:** Schönes Bild. Für den Agenten fühlt sich das an wie ein ganz normal eingeloggtes System. Ein Git-Credential-Helper fragt bei jedem Zugriff am Socket nach einem frischen Token, ein Wrapper um gh macht dasselbe. git push und gh pr create funktionieren einfach. Und in jeder Drohne steht in der CLAUDE-Punkt-md: niemals gh auth login, niemals Tokens hart einbauen, und bei Authentifizierungsfehlern Bescheid sagen, statt drumherum zu bauen.

**MODERATOR:** Moment, bei jedem Zugriff ein neuer? Ich dachte, die laufen nach einer Stunde ab. Steht der Agent dann nach dem Mittagessen vor verschlossener Tür?

**EXPERTIN:** Nein, das wird gern missverstanden. Solange die Drohne läuft, hat der Agent durchgehend Zugriff, er holt sich ja jedes Mal einen neuen. Die Grenze ist nicht die Uhr, sondern die Freigabeliste, und dass es Tokens nur aus diesem einen Socket gibt, der nur in dieser Drohne existiert. Die Stunde zählt erst, wenn doch mal einer leakt: Dann ist er nach spätestens einer Stunde wertlos und galt ohnehin nur für diese Repos. Ein Token aus gh auth login oder dein privater SSH-Schlüssel gilt dagegen überall, ohne Ablaufdatum.

**MODERATOR:** Und wenn der Agent ein zweites Repo braucht?

**EXPERTIN:** Dann gibt Levin es mit hatchery repo connect frei. Das wirkt sofort, und das Zurücknehmen genauso: repo disconnect, oder er räumt die Drohne einfach ab. Und die Liste liegt außerhalb der Drohne, die kann ihre eigenen Rechte also nicht erweitern.

**MODERATOR:** Und der zweite Kanal, der für den Menschen?

**EXPERTIN:** Der läuft über SSH. Levins Schlüssel liegt im Secure Enclave seines Macs, verwaltet mit Secretive. Der lässt sich nicht exportieren, nicht kopieren, nicht auslesen. Und jede einzelne Signatur will eine Bestätigung per Touch ID.

**MODERATOR:** Jede einzelne? Das stelle ich mir anstrengend vor.

**EXPERTIN:** Er schreibt selbst: Das ist ab und zu lästig, und genau so gewollt.

**EXPERTIN:** Und das ist der Trick beim Agent-Forwarding. Levin verbindet sich oft mit ssh minus A. Damit kann die Drohne seinen Schlüssel benutzen, zum Beispiel, um auf einen anderen Server zu springen. Klassisch wäre das gefährlich. Mit Secretive poppt aber jede Benutzung auf dem Mac auf und will einen Finger. Ein Agent kann also nicht heimlich auf den Produktionsserver. Er kann höchstens fragen. Und dann sieht Levin, was er vorhat.

**MODERATOR:** Agent-Forwarding mit Leine.

**EXPERTIN:** So nennt er es. Und er ist ehrlich: Manchmal lockert er die Leine. Wenn ein Agent länger am Stück auf einem Server arbeiten soll, lässt er eine geteilte SSH-Verbindung offen, damit er nicht jede Minute bestätigen muss. Aber als bewusste Entscheidung auf Zeit, nicht als Dauerzustand.

**MODERATOR:** Wenn ich das zusammenfasse: Der Agenten-Kanal läuft ohne Levin, solange die Drohne lebt, aber nur für freigegebene Repos. Der Mensch-Kanal kann alles, was Levin darf, aber nur mit seinem Finger.

**EXPERTIN:** Exakt. Ohne ihn läuft der eine, und der andere steht. Dieser Unterschied ist der Kern des ganzen Setups.

## Die Drohne ist die Sandbox

**MODERATOR:** Jetzt muss ich was beichten. In der Doku steht, dass die Agenten mit dangerously skip permissions laufen. Da steht „dangerously“ im Namen!

**EXPERTIN:** Ja, Claude Code fragt normalerweise vor jedem Befehl und jeder Dateiänderung um Erlaubnis. In der Drohne schaltet Levin das ab. Und das klingt gefährlicher, als es ist, denn: Die Drohne ist die Sandbox.

**MODERATOR:** Das musst du mir erklären.

**EXPERTIN:** Sie ist wegwerfbar und jederzeit aus der devcontainer-json neu baubar. Der Code liegt in Git, alles Wichtige geht über Pull Requests. Ihr Token reicht nur für die freigegebenen Repos. Und alles, was seine Identität braucht, braucht seinen Finger. Das Schlimmste, was ein Agent anrichten kann, ist ein kaputter Branch in einem freigegebenen Repository.

**MODERATOR:** Auf dem eigenen Laptop würde ich das trotzdem nicht machen.

**EXPERTIN:** Er auch nicht. Auf dem Laptop: ja, gefährlich. In der Drohne: kaum. Und dazu gibt es einen Satz, den ich sehr mag: Ein Agent, der ständig um Erlaubnis fragt, ist kein Agent, sondern ein sehr langsamer Kollege.

**MODERATOR:** Autsch. Aber stimmt.

**EXPERTIN:** Die Sicherheit kommt aus der Umgebung, nicht aus den Rückfragen.

## Das Netz: Erreichbarkeit, nicht Sicherheit

**MODERATOR:** Wie erreicht er denn die ganzen Drohnen? Zehn Container, zehn Dev-Server, da muss man sich doch Ports merken wie früher Telefonnummern.

**EXPERTIN:** Eben nicht. Alle Geräte und alle Drohnen hängen in einem gemeinsamen privaten Netz, einem Tailnet auf Basis von WireGuard. Als Client Tailscale, koordiniert von Headscale, der Open-Source-Variante des Kontrollservers, die er selbst betreibt. Für den Einstieg reicht aber das kostenlose Tailscale genauso.

**MODERATOR:** Und jede Drohne ist da drin ein eigener Rechner?

**EXPERTIN:** Genau. Mit eigenem Namen, etwa hatchery-levino-shipyard. Alle lauschen auf denselben Ports, sie unterscheiden sich nur im Namen. Will er den Dev-Server einer Drohne im Browser sehen, ruft er einfach ihren Namen mit Port auf. Vom Laptop oder vom Handy. Keine Portweiterleitungen, nichts im Internet offen.

**MODERATOR:** Dann ist das Tailnet also die Sicherheitsschicht.

**EXPERTIN:** Nein! Und das ist der Punkt, den er besonders betont: Das Tailnet sorgt für Erreichbarkeit, nicht für Sicherheit. Wer im Tailnet ist, braucht trotzdem seinen Schlüssel, um sich in eine Drohne einzuloggen, und damit seinen Finger. Passwort-Login ist aus.

**MODERATOR:** Warum so misstrauisch gegenüber dem eigenen Netz?

**EXPERTIN:** Weil Dinge passieren. Ein Netz ist mal falsch konfiguriert, ein Gerät geht verloren, eine Freigabe wird vergessen. Wenn die Sicherheit an einer einzigen Schicht hängt, ist das eine zu viel. Und es gibt sogar absichtlich eine Hintertür: Der Server ist zusätzlich ganz normal per SSH aus dem Internet erreichbar.

**MODERATOR:** Absichtlich?

**EXPERTIN:** Als Notausgang. Wenn das Tailnet klemmt, und das tut es gelegentlich, kommt er trotzdem drauf und kann es reparieren. Sein Satz dazu: Ein Netz, das man nur über sich selbst reparieren kann, ist eine Falle.

**MODERATOR:** Das sollte man sich über jeden Router kleben.

## Arbeitsplatz und Handy

**MODERATOR:** Wie sieht denn der Alltag aus? Sitzt er vor zehn Terminals?

**EXPERTIN:** Ziemlich genau. Er verbindet sich per SSH mit einer Drohne und startet dort zellij, einen Terminal-Multiplexer, ähnlich wie tmux, aber mit freundlicheren Voreinstellungen. In mehreren Fenstern arbeitet je ein Claude-Code-Agent, die bei Bedarf noch eigene Sub-Agenten für Recherche oder Reviews starten. Und die Sitzung lebt weiter, wenn die Verbindung abreißt. Zug fährt in den Tunnel, egal. Zwischen den Drohnen wechselt er wie zwischen Kollegen: Wer ist fertig, wer hat eine Frage, wer braucht eine Entscheidung?

**MODERATOR:** Und vom Handy? Da tippt er doch nicht in einem SSH-Terminal herum.

**EXPERTIN:** Eben nicht. Ein Terminal auf dem Handy ist mühsam, und der Schlüssel liegt ja ohnehin auf dem Mac. Stattdessen nutzt er die Remote Control von Claude Code. Er schaltet sie in einer laufenden Sitzung ein und führt die dann in der Claude-App auf dem Handy weiter.

**MODERATOR:** Also genau das, was man unterwegs eh macht: lesen, entscheiden, kurz was sagen.

**EXPERTIN:** Genau. Ein Agent will gelesen und gelenkt werden, nicht bedient. Der Haken: Braucht der Agent den SSH-Schlüssel, muss Levin an den Mac, Touch ID geht vom Handy aus nicht. Stört aber selten, weil die eigentliche Arbeit über den Agenten-Kanal läuft und ihn gar nicht braucht.

**MODERATOR:** Da schließt sich der Kreis.

## Native Apps und die Grenze zum Deploy

**MODERATOR:** Zwei Randnotizen noch. Was ist mit mobilen Apps? Emulatoren in Containern klingt nach Schmerzen.

**EXPERTIN:** Android geht erstaunlich gut. Hatchery kann auf Wunsch die Hardware-Virtualisierung in eine Drohne durchreichen, dann läuft der Emulator direkt darin, und der Agent testet die App wie jeden anderen Prozess. iOS dagegen braucht macOS, das ist Apples Regel. Dafür gibt es auf einem Mac Studio eine von Hand gebaute macOS-VM, in die ein Agent per SSH kommt. Eine Randnotiz.

**MODERATOR:** Und wo hört das Setup auf?

**EXPERTIN:** Dort, wo der Code GitHub erreicht. Agenten pushen Branches und öffnen Pull Requests, dann übernimmt die CI. Nach dem Merge rollt Argo CD auf einem k3s-Cluster aus. Und ein Agent braucht dafür keinerlei Zugang zum Cluster. Nur sein Repository.

**MODERATOR:** Und genau deshalb reicht das Token-Modell.

**EXPERTIN:** Richtig. Wer doch direkt auf einen Produktionsserver muss, braucht Levins Schlüssel, also seinen Finger. Der Deploy-Stack selbst, mit k3s, Argo CD, ZITADEL und einer Vorlage namens agentops-community-stack, wird ein eigener zweiter Teil der Doku.

## Fazit

**MODERATOR:** Was nimmst du mit, wenn du nicht Levin heißt und kein Hatchery benutzen willst?

**EXPERTIN:** Die Ideen funktionieren auch ohne Hatchery. Eine GitHub-App für Agenten-Tokens, die nur für freigegebene Repos gelten. Ein hardwaregebundener SSH-Schlüssel für den Menschen. Und Umgebungen, die man wegwerfen kann. Hatchery ist für genau seinen Fall gebaut: ein Mensch, ein Server, GitHub.

**MODERATOR:** Und was kostet der Spaß?

**EXPERTIN:** Der Server einen zweistelligen Eurobetrag im Monat. Tailscale ist für Privatleute kostenlos, Headscale und Hatchery sind Open Source. Der größte Posten ist das Abo für die Agenten selbst.

**MODERATOR:** Mein Fazit: Gib dem Agenten in seiner Drohne alle Freiheit, aber nicht deinen Ausweis. Und kauf dir keinen teuren Laptop.

**EXPERTIN:** Und wenn der Mac nach deinem Finger fragt: Das ist kein Bug, das ist die Architektur.

**MODERATOR:** Alles zum Nachlesen gibt es auf levinkeller-Punkt-de, unter docs, dev-setup. Und wer lieber mit seiner eigenen KI darüber reden will: Dort liegt eine kompakte Fassung als llms-Punkt-txt. Link ins Sprachmodell werfen und ausfragen.

**EXPERTIN:** Hatchery, die dotfiles, das devcontainer-template und die Website selbst sind Open Source und auf GitHub.

**MODERATOR:** Danke fürs Zuhören, und viel Spaß beim Spawnen!

**EXPERTIN:** Tschüss!
