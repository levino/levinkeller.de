---
title: Github
---

# Github

Weil es für manche, mit denen ich gerne zusammenarbeiten möchte, unintuitiv ist,
wie man erfolgreich einen Github Account erstellt und Github benutzt, habe ich
einige Videos mit Erklärungen angefertigt.

## Account machen

Hier könnt ihr sehen, wie man einen Account erstellt.

[![YouTube](http://i.ytimg.com/vi/D4knZaiP2gM/hqdefault.jpg)](https://www.youtube.com/watch?v=D4knZaiP2gM)

## Einladung annehmen

Und hier seht ihr dann, wie ihr die Einladung annehmt.

[![YouTube](http://i.ytimg.com/vi/_DcOqPaewao/hqdefault.jpg)](https://www.youtube.com/watch?v=_DcOqPaewao)

_[Video-Quell-Dateien](magnet:?xt=urn:btih:736254a0e8ffcd059ae4fc4dcc529048df5b9de7&dn=github-videos)_

## Benachrichtigungen richtig einstellen

:::caution[Wichtig: Sofort nach der Account-Erstellung machen!]
Stellt als Erstes die E-Mail-Benachrichtigungen ab. Sonst werdet ihr mit E-Mails
zugeschüttet.
:::

### Das Problem mit E-Mail-Benachrichtigungen

GitHub verschickt standardmäßig bei jeder Aktivität eine E-Mail — bei jedem
Kommentar, jedem Pull Request, jedem Issue-Update. Das klingt erstmal hilfreich,
ist in der Praxis aber kontraproduktiv:

- **Informationsflut**: Bei aktiven Projekten kommen schnell dutzende E-Mails pro
  Tag zusammen.
- **Veraltete Informationen**: Ihr öffnet eine E-Mail über einen Kommentar,
  klickt euch durch — und merkt dann erst, dass das Issue längst geschlossen oder
  der Pull Request schon gemergt ist. Die E-Mail ist dann komplett nutzlos.
- **Kontextverlust**: E-Mails reißen Diskussionen aus dem Zusammenhang. Auf
  GitHub selbst seht ihr den ganzen Verlauf einer Konversation. In einer E-Mail
  seht ihr nur ein Fragment.
- **Keine Priorisierung**: Alle E-Mails sehen gleich aus — egal ob es eine
  wichtige Erwähnung ist oder ein automatischer Bot-Kommentar.

Kurz gesagt: E-Mail-Benachrichtigungen von GitHub sind ein gescheitertes Konzept.
Sie erzeugen das Gefühl, ständig etwas zu verpassen, während man eigentlich nur
veraltete Benachrichtigungen abarbeitet.

### Die Lösung: GitHub Notifications (Glocken-Symbol)

Stattdessen solltet ihr die **eingebauten Benachrichtigungen** in GitHub selbst
nutzen. Oben rechts in GitHub gibt es ein **Glocken-Symbol** (🔔) — das ist euer
Notification-Posteingang.

**Vorteile gegenüber E-Mail:**

- **Immer aktuell**: Wenn ein Issue geschlossen wird, seht ihr das sofort im
  Kontext. Keine veralteten E-Mails mehr.
- **Filtermöglichkeiten**: Ihr könnt Benachrichtigungen nach Repository, Typ
  (Issue, PR, Review) und Grund (Erwähnung, Zuweisung, Beobachtung) filtern.
- **Priorisierung**: Direkte Erwähnungen (`@euer-name`) werden hervorgehoben.
- **Gruppierung**: Zusammengehörige Benachrichtigungen werden gruppiert
  dargestellt.
- **Schnelles Abarbeiten**: Ihr könnt Benachrichtigungen als gelesen markieren
  oder abbestellen — alles an einem Ort.

### So stellt ihr die E-Mail-Benachrichtigungen ab

1. Geht auf [github.com/settings/notifications](https://github.com/settings/notifications)
2. Unter **„Subscriptions"** → **„Participating"**: Entfernt den Haken bei
   **Email** und setzt nur den Haken bei **GitHub**.
3. Unter **„Subscriptions"** → **„Watching"**: Entfernt den Haken bei
   **Email** und setzt nur den Haken bei **GitHub**.
4. Überprüft auch die restlichen Abschnitte (Dependabot, Actions etc.) und
   entfernt überall die E-Mail-Option.

:::note[Tages-Zusammenfassung]
GitHub bietet leider keinen allgemeinen täglichen E-Mail-Digest an. Es gibt
lediglich für Dependabot-Sicherheitswarnungen eine Digest-Option. Für alles
andere heißt es: Entweder einzelne E-Mails bei jedem Ereignis — oder gar keine.
Die sinnvollste Option ist daher: **E-Mails aus, GitHub Notifications an.**
:::

### So arbeitet ihr Benachrichtigungen ab

1. Klickt auf das **Glocken-Symbol** oben rechts auf GitHub (oder geht direkt auf
   [github.com/notifications](https://github.com/notifications))
2. Schaut regelmäßig rein — zum Beispiel einmal am Tag
3. Arbeitet die Benachrichtigungen von oben nach unten ab
4. Markiert erledigte Benachrichtigungen mit **Done** (✓)
5. Nutzt **Unsubscribe**, wenn euch eine Konversation nicht mehr betrifft

Mehr Details findet ihr in der
[offiziellen GitHub-Dokumentation zu Benachrichtigungen](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/configuring-notifications).
