---
title: Identität und Zugriff
description: 'Zwei getrennte Kanäle: kurzlebige, eng geschnittene Tokens für den Agenten und ein SSH-Schlüssel mit Fingerabdruck für den Menschen.'
sidebar:
  position: 4
---

# Identität und Zugriff

Das ist das Herzstück des Setups. Alles andere ist Komfort, hier geht es um die
Frage: **Was darf ein Agent, der in einer Drohne mit allen Rechten arbeitet, außerhalb
dieser Drohne tun?**

Meine Antwort: Es gibt zwei getrennte Kanäle. Über den einen arbeitet der Agent, über
den anderen ich.

## Der Agenten-Kanal: eine GitHub-App statt meiner Identität

### Das Problem

Der naheliegende Weg ist, sich in der Umgebung mit `gh auth login` anzumelden oder
den eigenen SSH-Schlüssel hineinzureichen. Dann kann der Agent pushen. Er kann dann
aber auch alles andere, was ich kann: in jedes meiner Repositories schreiben, in
jeder Organisation, in der ich Mitglied bin, Releases löschen, Einstellungen ändern.
Ein Agent, der sich verrennt, eine präparierte README oder eine kompromittierte
Abhängigkeit – und der Schaden ist nicht auf das Repository begrenzt, an dem gerade
gearbeitet wird.

Fein granulierte Personal Access Tokens wären eine Alternative, aber sie von Hand pro
Umgebung anzulegen, zu befristen und zu erneuern ist mühsam und fehleranfällig.

### Die Lösung

Ich habe eine eigene **GitHub-App** angelegt und in meinen Organisationen
installiert. Eine GitHub-App kann **Installation-Tokens** ausstellen: Tokens, die nach
einer Stunde ablaufen und auf einzelne Repositories beschränkt werden können. Sie
gehören nicht zu meinem Benutzerkonto, sondern zur App.

Den privaten Schlüssel der App kennt nur der Credential-Service auf dem Host. Jede
Drohne bekommt von ihm einen **Unix-Socket** in den Container gemountet. Wer an
diesem Socket fragt, bekommt einen frischen Token, aber nur für die Repositories, die
für genau diese Drohne freigegeben sind. Fragt die Drohne nach einem anderen Repo,
bekommt sie ein `403` mit dem Hinweis, wie ich es freigeben könnte.

Es gibt keine Passwörter und keine Tokens auf der Festplatte der Drohne. **Die
Identität ist der Mount selbst**: Welche Drohne fragt, ergibt sich daraus, welcher
Socket es ist. Fälschen lässt sich das nicht, denn den Socket legt der Host an, nicht
der Container.

### Wie Git und `gh` davon erfahren

Das Hatchery-Feature richtet in jeder Drohne zwei Dinge ein:

- einen **Git-Credential-Helper**, der bei jedem Zugriff auf GitHub am Socket nach
  einem Token fragt. SSH-URLs werden auf HTTPS umgebogen, damit auch
  `git@github.com:…` funktioniert.
- einen **Wrapper um `gh`**, der vor jedem Aufruf einen Token holt.

Für den Agenten fühlt sich das an wie ein normal eingeloggtes System. `git push` und
`gh pr create` funktionieren einfach. In jeder Drohne liegt außerdem eine
`CLAUDE.md` mit drei Regeln: niemals `gh auth login`, niemals Tokens hart
einbauen, und bei Authentifizierungsfehlern Bescheid sagen statt drumherum zu bauen.

### Freigaben ändern sich zur Laufzeit

Braucht ein Agent ein zweites Repository, gebe ich es frei:

```bash
hatchery repo connect levino/shipyard levino/levinkeller.de
```

Das wirkt sofort, ohne Neustart. Die Liste der Freigaben liegt auf dem Host
**außerhalb** der Drohne. Eine Drohne kann ihre eigenen Rechte also nicht erweitern,
auch nicht, indem sie eine Datei ändert und auf den nächsten Neustart wartet.

### Ein strengeres Modell zum Vergleich

Für Repositories auf meiner eigenen [Forgejo](https://forgejo.org)-Instanz geht
Hatchery noch einen Schritt weiter: Die Drohne bekommt gar keinen echten Token, nur
einen Platzhalter. Ihr Git-Verkehr läuft über einen Proxy pro Drohne, der jeden
Request gegen die Freigabeliste prüft und erst dann den echten Token einsetzt. Der
Agent sieht das Geheimnis nie. Das ist sauberer, aber auch mehr Aufwand – für GitHub
reicht mir das Token-Modell mit einer Stunde Laufzeit.

## Der Mensch-Kanal: SSH mit Fingerabdruck

### Mein Schlüssel verlässt den Mac nicht

Mein SSH-Schlüssel liegt im **Secure Enclave** meines Macs, verwaltet mit
[Secretive](https://github.com/maxgoedjen/secretive). Er lässt sich nicht exportieren,
nicht kopieren und nicht auslesen. Jede Signatur damit verlangt eine Bestätigung
per Touch ID.

Mit diesem Schlüssel melde ich mich in den Drohnen an. Die Drohnen holen sich die
erlaubten öffentlichen Schlüssel beim Start direkt von meinem GitHub-Profil.

### Agent-Forwarding mit Leine

Ich verbinde mich oft mit `ssh -A`, also mit weitergereichtem SSH-Agent. Damit kann
die Drohne meinen Schlüssel *benutzen*, etwa für einen Push auf ein Repository, das
nicht über die App läuft, oder für einen Sprung auf einen anderen Server. Klassisch
wäre das gefährlich: Jeder Prozess in der Drohne könnte sich dann mit meiner Identität
überall anmelden, solange die Verbindung offen ist.

Mit Secretive ist das anders. **Jede einzelne Benutzung** des Schlüssels poppt auf
meinem Mac auf und will meinen Finger. Ein Agent kann also nicht heimlich auf den
Produktionsserver springen. Er kann mich höchstens fragen, und dann sehe ich, was er
vorhat.

Ehrlicherweise: Manchmal lockere ich die Leine. Wenn ein Agent eine Stunde lang auf
einem Server arbeiten soll, lasse ich eine geteilte SSH-Verbindung
(`ControlMaster`) offen, damit ich nicht jede Minute bestätigen muss. Das ist eine
bewusste Entscheidung für eine begrenzte Zeit, kein Dauerzustand.

## Warum zwei Kanäle

Die beiden Kanäle decken unterschiedliche Bedürfnisse ab:

| | Agenten-Kanal | Mensch-Kanal |
|---|---|---|
| **Wer** | der Agent, jederzeit | ich, mit Finger |
| **Wofür** | Code lesen und pushen, PRs, Issues | Login in Drohnen, Server, alles Heikle |
| **Reichweite** | nur freigegebene Repos | alles, was ich darf |
| **Lebensdauer** | eine Stunde pro Token | eine Signatur |
| **Ohne mich** | läuft | steht |

Der Agent kann seine Arbeit ohne mich erledigen. Alles, was darüber hinausgeht,
braucht mich physisch. Dieser Unterschied ist der Kern des ganzen Setups.
