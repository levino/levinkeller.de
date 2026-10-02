# Podcast „Miete die Maschine“ – Levin Kellers Dev-Setup für KI-Agenten

Zwei Stimmen, beide KI-generiert, sprechen über das Setup, das unter
https://levinkeller.de/de/docs/dev-setup/ beschrieben ist. Einzige Quelle sind diese Seiten
und `public/de/docs/dev-setup/llms.txt`. Vertont mit `scripts/tts/podcast_vertonen.py`.

Bogen: erst wie es sich anfühlt (Rechenleistung, Sprache, Hatchery, Netz, Arbeitsalltag,
Codespaces), dann warum es trotzdem sicher ist (zwei Kanäle), dann Randnotizen und Fazit.

## Begrüßung

**MODERATOR:** Kurzer Hinweis vorweg: Die beiden Stimmen in dieser Folge sind KI-generiert. Was ziemlich gut passt, denn heute geht es um ein Setup, in dem fast nur noch KIs Code schreiben. Hallo und willkommen!

**EXPERTIN:** Hallo! Und ja, das ist ein bisschen so, als würden zwei Roboter über eine Roboterfabrik reden. Keine Installationsanleitung übrigens, sondern Architektur: welche Bausteine, und warum.

**MODERATOR:** Wir reden über das Dev-Setup von Levin Keller. Der schreibt nach eigener Aussage kaum noch Code von Hand. Stattdessen arbeiten mehrere Claude-Code-Agenten gleichzeitig an verschiedenen Repositories, und er liest, lenkt und entscheidet.

**EXPERTIN:** Also eher Schichtleiter als Programmierer.

**MODERATOR:** Und ich habe beim Lesen gemerkt, dass da eigentlich zwei Fragen drinstecken. Erstens: Wie fühlt es sich an, mit fünf oder zehn Agenten gleichzeitig zu arbeiten, ohne dass einem der Rechner unter den Fingern wegschmilzt? Und zweitens: Wie lässt man die alle von der Leine, ohne ihnen den eigenen GitHub-Account zu schenken?

**EXPERTIN:** Und beide Fragen sind gleich wichtig. Ein sicheres Setup, in dem man nicht gern arbeitet, benutzt man nicht. Und ein bequemes Setup, das den Agenten deine Identität gibt, willst du nicht benutzen. Wir fangen heute mit dem Bequemen an.

**MODERATOR:** Sehr gut, ich bin nämlich ein bequemer Mensch.

## Miete die Maschine, kauf keinen fetten Laptop

**MODERATOR:** Dann fangen wir mit der Frage an, die sich jeder irgendwann stellt: Welchen Rechner kaufe ich mir dafür?

**EXPERTIN:** Und Levins Antwort steht da wörtlich: Kauf dir keinen starken Laptop.

**MODERATOR:** Das sagt mir sonst nie jemand. Mir sagen alle immer: Nimm das Pro-Modell, nimm mehr RAM, du wirst es bereuen.

**EXPERTIN:** Halb stimmt das sogar. Agenten brauchen vor allem Arbeitsspeicher, nicht Rechenzeit. Jede Umgebung hält ihren Node-Prozess, ihren Language-Server, ihren Testrunner, manchmal noch einen Browser für End-to-End-Tests. Fünf bis zehn solcher Umgebungen gleichzeitig sind bei ihm normal.

**MODERATOR:** Und das alles lokal …

**EXPERTIN:** … geht, solange es ein oder zwei Agenten sind. Danach wird der Laptop laut, heiß und leer. Und jede Reise unterbricht die Arbeit, denn wenn du den Deckel zuklappst, hören die Agenten auf.

**MODERATOR:** Und den Laptop mit richtig viel RAM, den man dafür bräuchte, den gibt es ja, der kostet dann halt ein paar tausend Euro. Und wird trotzdem heiß.

**EXPERTIN:** Genau. Und deshalb dreht Levin das um: Er mietet die Maschine. Ein Bare-Metal-Server im Rechenzentrum, gebraucht aus der Hetzner-Serverbörse. Ein älterer Intel-Vierkerner mit 62 Gigabyte RAM.

**MODERATOR:** Ein älterer Vierkerner. Für eine ganze Agentenarmee.

**EXPERTIN:** Nichts Besonderes, sagt er selbst. Aber er läuft rund um die Uhr, hängt an einer schnellen Leitung und kostet einen zweistelligen Eurobetrag im Monat. Ein gebrauchter dedizierter Server ist schlicht die billigste Art, viel RAM dauerhaft verfügbar zu haben.

**MODERATOR:** Und wie viel RAM braucht man?

**EXPERTIN:** Als Daumenregel: Sechzehn Gigabyte reichen für den Anfang, mit vierundsechzig muss man nicht mehr nachdenken. Viele Kerne helfen, wenn mehrere Agenten gleichzeitig bauen.

**MODERATOR:** Warum nicht einfach eine Cloud-VM mit Stundenpreis?

**EXPERTIN:** Flexibel, aber für eine Maschine, die ohnehin den ganzen Tag läuft, deutlich teurer als dedizierte Hardware.

**MODERATOR:** Okay, und der Laptop?

**EXPERTIN:** Wenn die Arbeit auf dem Server passiert, ist der Laptop nur noch ein Terminal mit gutem Bildschirm. Levin arbeitet auf einem MacBook Neo. Leicht, lange Akkulaufzeit, schönes Display. Der wird nicht warm, wenn zehn Agenten gleichzeitig npm install ausführen. Weil das woanders passiert.

**MODERATOR:** Zehn parallele npm installs, und der Laptop zuckt nicht mal. Das ist eigentlich schon Wellness.

**EXPERTIN:** Und das Schönste: Die Agenten arbeiten weiter, wenn der Deckel zu ist. Er klappt zu, steigt in den Zug, und wenn er wieder aufklappt, haben die in der Zwischenzeit weitergemacht.

**MODERATOR:** Das ist der Teil, der mich am meisten überzeugt. Mein Laptop macht beim Zuklappen Feierabend. Seiner hat Mitarbeiter, die weiterarbeiten. Aber wenn der gemietete Server stirbt, ist doch alles weg.

**EXPERTIN:** Eben nicht.

Für Entwicklungsumgebungen braucht er keine Hochverfügbarkeit. Der Code ist sowieso auf GitHub, und die Umgebungen lassen sich aus ihren devcontainer-Punkt-json-Dateien auf jedem anderen Rechner neu bauen. Der Server ist austauschbar. Versuch das mal mit dem teuren Laptop, wenn der Kaffee drüberläuft.

## Reden statt tippen

**MODERATOR:** Und was macht er dann mit dem leichten Laptop den ganzen Tag? Tippen?

**EXPERTIN:** Kaum. Er spricht. Mit einem Open-Source-Tool für Speech-to-Text namens Whispering erklärt er einem Agenten zwei Minuten lang, was er will.

**MODERATOR:** Zwei Minuten am Stück reden. Mit einem Programm.

**EXPERTIN:** Klingt seltsam, ist aber schneller als Tippen und meistens präziser. Weil man beim Sprechen automatisch mehr Kontext gibt. Man sagt eben nicht nur „fix den Bug“, sondern erzählt, was man beobachtet hat und was auf keinen Fall kaputtgehen darf.

**MODERATOR:** Also im Grunde das Briefing, das man einem Kollegen auch geben würde, wenn man nicht zu faul zum Tippen wäre.

## Hatchery: spawn, und los

**MODERATOR:** Okay, ein Server, ein leichter Laptop, ein Mikrofon. Wie kommen die Agenten denn jetzt auf den Server?

**EXPERTIN:** Über ein kleines Open-Source-Werkzeug, das Levin dafür geschrieben hat: Hatchery. Es verwaltet Devcontainer auf dem Server, einen pro Repository. Und diese Container heißen bei Hatchery: Drohnen.

**MODERATOR:** Hatchery, Drohnen … das ist StarCraft, oder? Die Zerg!

**EXPERTIN:** Volltreffer. Das ganze Werkzeug ist im Zerg-Stil benannt, laut Doku einfach, weil es Spaß macht. Drohnen werden gespawnt, eingegraben mit burrow, wieder ausgegraben mit unburrow, und wenn man sie nicht mehr braucht: slay.

**MODERATOR:** Ich finde, jedes Infrastruktur-Tool sollte so heißen. Statt „Container stoppen“ einfach: eingraben.

**EXPERTIN:** Und die Bedienung ist genau ein Befehl: hatchery spawn levino slash shipyard. Hatchery klont das Repo auf den Host und startet mit der offiziellen Devcontainer-CLI einen Container. Und zwar mit der devcontainer-Punkt-json, die im Repository selbst liegt. Fertig ist die Umgebung.

**MODERATOR:** Also kein eigenes Hatchery-Format, das ich erst lernen muss.

**EXPERTIN:** Genau, eine der elegantesten Entscheidungen. Das Repo braucht nichts Hatchery-spezifisches. Dieselbe Datei funktioniert unverändert in GitHub Codespaces oder lokal in VS Code. Hatchery ist austauschbar, die Repos bleiben portabel. Hatchery schmuggelt nur ein paar Features dazu: einen SSH-Server, Tailscale, die GitHub-CLI, Claude Code, zellij und die Credential-Helfer. Und auf Wunsch kommen Levins dotfiles mit: Shell-Konfiguration, Git-Einstellungen und Skills mit seinen Coding-Konventionen. Man fühlt sich also überall sofort zu Hause.

**MODERATOR:** Und wie viele davon laufen gleichzeitig?

**EXPERTIN:** Eine pro Repository, und davon so viele, wie der RAM hergibt. Fünf bis zehn sind normal. Jede mit eigener Toolchain, eigenem Dev-Server und eigenen Tests, ohne sich in die Quere zu kommen.

**MODERATOR:** Und wenn ich eine Drohne wegwerfe, ist dann alles weg?

**EXPERTIN:** Nein, und das ist der zweite große Komfortpunkt. Was überleben muss, liegt auf dem Host und wird hineingemountet. Der Code als Git-Worktree, und der Zustand von Claude Code: Login, Einstellungen, Gedächtnis, Verlauf. Man kann die Drohne jederzeit komplett neu bauen, und der Agent weiß danach noch, woran er gearbeitet hat.

**MODERATOR:** Das ist ja fast unheimlich. Die Drohne stirbt, aber die Erinnerung lebt weiter.

**EXPERTIN:** Sehr Zerg. Neu einloggen bei Claude muss er sich nur einmal pro neuer Drohne.

## Jede Drohne ein eigener Rechner

**MODERATOR:** Jetzt habe ich zehn Container mit zehn Dev-Servern. Da muss man sich doch Ports merken wie früher Telefonnummern. Drei-null-null-eins ist Projekt A, drei-null-null-zwei ist …

**EXPERTIN:** Eben nicht. Alle Geräte und alle Drohnen hängen in einem gemeinsamen privaten Netz, einem Tailnet auf Basis von WireGuard. Er betreibt dafür Headscale selbst, für den Einstieg reicht aber das kostenlose Tailscale genauso.

**MODERATOR:** Und jede Drohne ist da drin ein eigener Rechner?

**EXPERTIN:** Genau. Mit eigenem Namen, etwa hatchery-levino-shipyard. Alle lauschen auf denselben Ports, sie unterscheiden sich nur im Namen. Will er den Dev-Server einer Drohne im Browser sehen, ruft er einfach ihren Namen mit Port auf. Vom Laptop oder vom Handy. Keine Portweiterleitungen, kein Port-Jonglieren, nichts im Internet offen.

**MODERATOR:** Dann ist das Tailnet also auch gleich die Sicherheitsschicht.

**EXPERTIN:** Nein, und das betont er besonders: Das Tailnet sorgt für Erreichbarkeit, nicht für Sicherheit. Wer im Tailnet ist, braucht trotzdem seinen Schlüssel, um sich in eine Drohne einzuloggen. Und es gibt sogar absichtlich einen Notausgang: Der Server ist zusätzlich ganz normal per SSH aus dem Internet erreichbar. Falls das Tailnet mal klemmt, und das tut es gelegentlich.

**MODERATOR:** Absichtlich?

**EXPERTIN:** Sein Satz dazu: Ein Netz, das man nur über sich selbst reparieren kann, ist eine Falle.

**MODERATOR:** Das sollte man sich über jeden Router kleben.

## Der Arbeitsalltag

**MODERATOR:** Wie sieht denn so ein Tag aus? Sitzt er vor zehn Terminals?

**EXPERTIN:** Ziemlich genau. Er verbindet sich per SSH mit einer Drohne und startet dort zellij, einen Terminal-Multiplexer wie tmux, nur mit freundlicheren Voreinstellungen. In mehreren Fenstern arbeitet je ein Claude-Code-Agent, oft mit eigenen Sub-Agenten.

**MODERATOR:** Und wenn das WLAN wackelt?

**EXPERTIN:** Dann ist das egal. Die Sitzung lebt auf der Drohne weiter, wenn die Verbindung abreißt. Laptop zuklappen, Zug fährt in den Tunnel, egal. Beim nächsten Verbinden ist alles noch da, und die Agenten haben in der Zwischenzeit weitergearbeitet.

**MODERATOR:** Und zwischen den Projekten?

**EXPERTIN:** Meist hat er mehrere Drohnen gleichzeitig offen, eine pro Projekt. Und zwischen denen wechselt er, wie man zwischen Kollegen wechselt: Wer ist fertig, wer hat eine Frage, wer braucht eine Entscheidung?

**MODERATOR:** Großraumbüro, nur dass alle Kollegen in Containern sitzen.

**EXPERTIN:** Und keiner klaut einem den Joghurt aus dem Kühlschrank. Dazu kommt: Claude Code fragt normalerweise vor jedem Befehl um Erlaubnis. In der Drohne schaltet Levin das ab, mit dangerously skip permissions.

**MODERATOR:** Moment. Da steht „dangerously“ im Namen!

**EXPERTIN:** Steht es. Warum das trotzdem okay ist, klären wir gleich im Sicherheitsteil. Die Kurzfassung: Die Drohne ist die Sandbox. Und es gibt einen Satz in der Doku, den ich sehr mag: Ein Agent, der ständig um Erlaubnis fragt, ist kein Agent, sondern ein sehr langsamer Kollege.

**MODERATOR:** Autsch. Aber stimmt. Und unterwegs, vom Handy? Da tippt er doch nicht in einem SSH-Terminal herum.

**EXPERTIN:** Eben nicht. Ein Terminal auf dem Handy ist mühsam. Stattdessen nutzt er die Remote Control von Claude Code. Er schaltet sie in einer laufenden Sitzung ein und führt die dann in der Claude-App auf dem Handy weiter. Und Spracheingabe passt da wieder perfekt.

**MODERATOR:** Also genau das, was man unterwegs eh macht: lesen, entscheiden, kurz was sagen.

**EXPERTIN:** Ein Agent will gelesen und gelenkt werden, nicht bedient.

## Warum nicht einfach Codespaces?

**MODERATOR:** Jetzt muss ich die naheliegende Frage stellen. Das klingt alles ein bisschen wie GitHub Codespaces in selbstgebaut. Warum nicht einfach das?

**EXPERTIN:** Hat er ausprobiert, und gescheitert ist es an der Arbeitsweise, nicht am Preis. In einen Codespace kommt man nicht einfach per SSH wie auf jeden anderen Rechner, nur über einen Tunnel. Also lief Claude Code bei ihm im Terminal von VS Code.

**MODERATOR:** Und das war …

**EXPERTIN:** … zäh. Darstellungsfehler, Trägheit, und immer wieder riss die Verbindung ab und die Sitzung war weg. Und dann hält Codespaces eine Umgebung an, sobald sie eine Weile nicht benutzt wird, standardmäßig nach dreißig Minuten Leerlauf.

**MODERATOR:** Was für einen Menschen sinnvoll ist. Aber ein Agent, der drei Stunden im Hintergrund arbeitet, wirkt von außen ja wie Leerlauf.

**EXPERTIN:** Genau, das passt nicht zusammen. Und zehn Umgebungen den ganzen Tag, nach Stunden und Kernen bezahlt, werden obendrein teuer. Eine Drohne dagegen ist ein ganz normaler Rechner im Tailnet: ssh drauf, zellij starten, die Sitzung überlebt jeden Abbruch. Angehalten wird nichts.

**MODERATOR:** Und DevPod, Coder und Co.?

**EXPERTIN:** Hat er sich auch angeschaut. Aber gegen alle zusammen sprach noch etwas: Keine der Alternativen löst gut, wie ein Agent in der Umgebung an GitHub kommt, ohne dafür die volle Identität seines Menschen zu bekommen. Und damit sind wir bei der zweiten Hälfte.

## Die andere Hälfte: zwei Kanäle

**MODERATOR:** Also: zehn Agenten, die ohne Rückfragen arbeiten. Was dürfen die außerhalb ihrer Drohne?

**EXPERTIN:** Es gibt zwei getrennte Kanäle. Über den einen arbeitet der Agent, über den anderen der Mensch.

**MODERATOR:** Fangen wir beim Agenten an. Der naive Weg wäre ja: In der Drohne einmal gh auth login, fertig.

**EXPERTIN:** Und dann ist der Agent du. Der kann in jedes deiner Repos schreiben, in jeder Organisation, Releases löschen, Einstellungen ändern. Eine präparierte README, und der Schaden ist nicht mehr auf das eine Repo begrenzt.

**MODERATOR:** Okay, das will ich nicht. Was macht Levin stattdessen?

**EXPERTIN:** Er hat eine eigene GitHub-App angelegt. Die kann Tokens ausstellen, die auf einzelne Repositories beschränkt sind und der App gehören, nicht seinem Benutzerkonto. Den Schlüssel der App kennt nur ein kleiner Dienst auf dem Host, und der mountet jeder Drohne einen eigenen Unix-Socket. Wer dort fragt, bekommt einen frischen Token. Aber nur für die Repos, die für genau diese Drohne freigegeben sind. Fragt sie nach einem anderen Repo, gibt es ein vierhundertdrei.

**MODERATOR:** Höflich abgewiesen.

**EXPERTIN:** Und jetzt kommt mein Lieblingssatz aus der ganzen Doku: Die Identität ist der Mount selbst. Keine Passwörter, keine Tokens auf der Platte der Drohne. Welche Drohne fragt, ergibt sich daraus, welcher Socket es ist. Und fälschen kann man das nicht, weil der Host den Socket anlegt, nicht der Container.

**MODERATOR:** Wie bei einer Rohrpost: Wer am Rohr hängt, ist automatisch der Absender.

**EXPERTIN:** Schönes Bild. Und für den Agenten fühlt sich das an wie ein ganz normal eingeloggtes System. Git und gh holen sich den Token im Hintergrund selbst, git push funktioniert einfach. Das ist übrigens wieder Usability: Der Agent merkt von der ganzen Sicherheit nichts.

**MODERATOR:** Moment, die Tokens laufen doch nach einer Stunde ab. Steht der Agent dann nach dem Mittagessen vor verschlossener Tür?

**EXPERTIN:** Nein, er holt sich ja jedes Mal einen neuen. Solange die Drohne läuft, hat er durchgehend Zugriff. Die Grenze ist nicht die Uhr, sondern die Freigabeliste und dieser eine Socket. Die Stunde zählt erst, wenn doch mal ein Token leakt: Dann ist er nach spätestens einer Stunde wertlos und galt ohnehin nur für diese Repos.

**MODERATOR:** Und wenn der Agent ein zweites Repo braucht?

**EXPERTIN:** hatchery repo connect, wirkt sofort. Zurücknehmen genauso: repo disconnect, oder die Drohne einfach abräumen. Und die Liste liegt außerhalb der Drohne, die kann ihre eigenen Rechte also nicht erweitern.

**MODERATOR:** Und der zweite Kanal, der für den Menschen?

**EXPERTIN:** Der läuft über SSH. Levins Schlüssel liegt im Secure Enclave seines Macs, verwaltet mit Secretive. Der lässt sich nicht exportieren, nicht kopieren, nicht auslesen. Und jede einzelne Signatur will eine Bestätigung per Touch ID.

**MODERATOR:** Jede einzelne? Das ist jetzt aber nicht mehr bequem.

**EXPERTIN:** Er schreibt selbst: Das ist ab und zu lästig, und genau so gewollt. Und das macht Agent-Forwarding harmlos. Levin verbindet sich oft mit ssh minus A, damit kann die Drohne seinen Schlüssel benutzen, etwa um auf einen anderen Server zu springen. Aber jede Benutzung poppt auf dem Mac auf und will einen Finger. Ein Agent kann also nicht heimlich auf den Produktionsserver, er kann höchstens fragen.

**MODERATOR:** Agent-Forwarding mit Leine.

**EXPERTIN:** So nennt er es. Manchmal lockert er sie bewusst für eine Weile, wenn ein Agent länger auf einem Server arbeiten soll. Und das ist auch der Haken am Handy: Braucht der Agent den Schlüssel, muss Levin an den Mac. Stört aber selten, weil die eigentliche Arbeit über den Agenten-Kanal läuft.

**MODERATOR:** Dann löse ich jetzt mal das Versprechen von vorhin ein. Warum ist dangerously skip permissions in der Drohne okay?

**EXPERTIN:** Weil sie wegwerfbar ist und jederzeit neu baubar. Alles Wichtige geht über Pull Requests. Ihr Token reicht nur für die freigegebenen Repos. Und alles, was Levins Identität braucht, braucht seinen Finger. Das Schlimmste, was ein Agent anrichten kann, ist ein kaputter Branch in einem freigegebenen Repository. Auf dem eigenen Laptop wäre das gefährlich. In der Drohne: kaum. Die Sicherheit kommt aus der Umgebung, nicht aus den Rückfragen.

**MODERATOR:** Wenn ich das zusammenfasse: Der Agenten-Kanal läuft ohne Levin, solange die Drohne lebt, aber nur für freigegebene Repos. Der Mensch-Kanal kann alles, was Levin darf, aber nur mit seinem Finger.

**EXPERTIN:** Exakt. Ohne ihn läuft der eine, und der andere steht.

## Randnotizen: Apps und Deploy

**MODERATOR:** Zwei Randnotizen noch. Mobile Apps? Emulatoren in Containern klingt nach Schmerzen.

**EXPERTIN:** Android geht erstaunlich gut. Hatchery kann auf Wunsch die Hardware-Virtualisierung in eine Drohne durchreichen, dann läuft der Emulator direkt darin, und der Agent testet die App wie jeden anderen Prozess. Für iOS gibt es eine von Hand gebaute macOS-VM auf einem Mac Studio.

**MODERATOR:** Und wo hört das Setup auf?

**EXPERTIN:** Dort, wo der Code GitHub erreicht. Agenten pushen Branches und öffnen Pull Requests, dann übernimmt die CI, und nach dem Merge rollt Argo CD auf einem k3s-Cluster aus. Ein Agent braucht dafür keinerlei Zugang zum Cluster, nur sein Repository. Der Deploy-Stack, mit der Vorlage agentops-community-stack, wird ein eigener zweiter Teil.

## Fazit

**MODERATOR:** Was nimmst du mit, wenn du nicht Levin heißt und kein Hatchery benutzen willst?

**EXPERTIN:** Erstens: Miete die Maschine. Ein gebrauchter Server mit viel RAM für einen zweistelligen Betrag im Monat, und dazu ein leichter Laptop, der lange durchhält. Zweitens: Umgebungen aus der devcontainer-json, die man wegwerfen kann. Und drittens: Eine GitHub-App für Agenten-Tokens und ein hardwaregebundener SSH-Schlüssel für den Menschen. Der größte Kostenposten ist am Ende übrigens das Abo für die Agenten selbst.

**MODERATOR:** Mein Fazit: Kauf dir keinen teuren Laptop, sondern miete dir einen Server, der nie zuklappt. Und gib dem Agenten in seiner Drohne alle Freiheit, aber nicht deinen Ausweis.

**EXPERTIN:** Und wenn der Mac nach deinem Finger fragt: Das ist kein Bug, das ist die Architektur.

**MODERATOR:** Alles zum Nachlesen gibt es auf levinkeller-Punkt-de, unter docs, dev-setup. Und wer lieber mit seiner eigenen KI darüber reden will: Dort liegt eine kompakte Fassung als llms-Punkt-txt. Link ins Sprachmodell werfen und ausfragen.

**EXPERTIN:** Hatchery, die dotfiles, das devcontainer-template und die Website selbst sind Open Source und auf GitHub.

**MODERATOR:** Danke fürs Zuhören, und viel Spaß beim Spawnen!

**EXPERTIN:** Tschüss!
