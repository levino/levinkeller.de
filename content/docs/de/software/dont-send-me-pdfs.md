---
title: Don't send me PDFs
---

## Was wir eigentlich wollen

Inhalte sollten heute unabhängig vom Endgerät funktionieren. Auf dem großen
Bildschirm genauso wie auf dem Handy im Zug. Texte müssen fließen, nicht zoomen
erzwingen. Schriftgrößen passen sich an, Zeilenlängen bleiben lesbar. Man sollte
Dinge markieren, kopieren, weiterleiten, wiederfinden können. Kurz: Lesen sollte
sich selbstverständlich anfühlen.

Das ist kein Luxus und auch kein nerdiger Sonderwunsch. Das ist das Mindeste an
Rücksicht gegenüber den Menschen, die diese Inhalte lesen sollen.

Das kennt man aus anderen Bereichen längst. Webseiten, die auf dem Desktop gut
aussehen, aber auf dem Handy winzig sind, gelten heute als schlecht gemacht.
Niemand würde sagen: „Stell dich nicht so an, zoome halt rein." Eine Seite ohne
mobile Ansicht fühlt sich kaputt an. Genau dieses Gefühl erzeugen PDFs.

## Warum PDFs sich falsch anfühlen

PDFs sind starr. Sie gehen davon aus, dass es genau eine richtige Darstellung
gibt: eine feste Seite, eine feste Breite, eine feste Schriftgröße. Das passt
vielleicht für Papier. Für das Lesen im Alltag passt es nicht.

Auf dem Handy muss man zoomen und schieben. Auf dem Tablet ist es irgendwie
dazwischen. Auf dem Laptop oft zu klein oder zu groß. Der Inhalt zwingt dem
Gerät sein Format auf, statt sich dem Gerät anzupassen.

Das ist nicht nur unbequem, es wirkt alt. So wie Webseiten aus den frühen
2000ern, die auf dem Handy einfach nur verkleinert dargestellt werden.

HTML macht genau das Gegenteil. Der Inhalt bleibt derselbe, aber die Darstellung
passt sich an. Das kennt jeder von E-Mails: Auf dem Handy sehen sie anders aus
als auf dem Desktop, und trotzdem erwartet niemand, dass sie überall gleich
aussehen. Im Gegenteil -- wir verlassen uns darauf, dass sie sich sinnvoll
anpassen. Genau das sollte auch für Anhänge gelten.

## Wie wir Inhalte dann verschicken

Und ja: „Schick mir HTML" ist als Satz erstmal unpraktisch. Eine _.html_-Datei
als Anhang wirkt für viele wie ein Fremdkörper. Manche wissen nicht, wie man sie
öffnet. Manche haben (zurecht) Angst, irgendwas „Komisches" anzuklicken.

Darum fängt es sinnvollerweise nicht bei „Dateien" an, sondern bei dem, was die
Leute wirklich brauchen: einen Link oder eine gut lesbare E-Mail.

Eine sehr pragmatische erste Variante ist inzwischen: Lass dir das HTML von
einer KI erzeugen. Auch mit Tabellen, kleinen Diagrammen, sauberer Typografie.
Du gibst den Inhalt vor, die KI macht daraus eine lesbare HTML-Seite.

Und dann gibt es zwei alltagstaugliche Wege, wie das bei Menschen ankommt:

Der erste ist: Die E-Mail selbst ist das Dokument. Also: kein Anhang, sondern
der Inhalt steht direkt in der Mail. Viele Mailprogramme können HTML-Mails
darstellen. In Thunderbird kann man HTML beim Schreiben einfügen; in Outlook
klappt es je nach Variante ebenfalls (z.B. indem man HTML „als Text" in den
Nachrichtenkörper einfügt). Trotzdem gilt: E-Mail-HTML hat seine Eigenheiten,
also lieber simpel bleiben und einmal an sich selbst testen.
([support.mozilla.org](https://support.mozilla.org/en-US/questions/1101669))

Der zweite -- und oft bessere -- Weg ist: ein Link. Der Text liegt als normale
Webseite in einem Wiki, in Docs oder an einem Ort, wo er gut lesbar ist. Wenn
eine Zugangsbeschränkung notwendig ist, dann eben mit Login. Für Leser\:innen
ist das simpel: klicken, lesen, fertig. Und für Autor\:innen ist es leichter,
Dinge nachträglich zu korrigieren, ohne neue Anhänge herumzuschicken. Man kann
außerdem sicher sein, immer die aktuelle Version des Dokuments zu lesen.

Nebenbei löst das noch etwas anderes: Wenn Inhalte sowieso an einem festen Ort
liegen, muss man nicht jede Änderung per Rundmail verteilen. Dann reichen
Benachrichtigungen -- zum Beispiel über ein System, das die Leute ohnehin nutzen
(GitHub-Notifications, Wiki-Updates, etc.). E-Mail wird wieder das, was sie sein
sollte: Kommunikation. Nicht Dateitransport.

## Wo PDFs herkommen

PDFs stammen aus einer Zeit, in der Arbeit noch stark papierzentriert war. Sie
wurden entwickelt, um Dokumente zuverlässig auszudrucken -- unabhängig davon,
auf welchem Rechner sie entstanden sind. Die zugrunde liegende Technik kommt aus
dem Druckbereich. Das Ziel war nicht Lesen auf Bildschirmen, sondern: überall
gleiches Papier.

Das war sinnvoll. Word-Dateien sahen auf unterschiedlichen Systemen
unterschiedlich aus. Layouts zerfielen, Schriftarten fehlten, Seiten sprangen.
Das PDF versprach Ordnung und Sicherheit: Das sieht bei allen gleich aus. Und
man kann es nicht aus Versehen verändern.

So wurde das PDF zum Standard. Nicht, weil es besonders gut zu lesen war,
sondern weil es ein Produktionsproblem gelöst hat.

## Warum das heute nicht mehr passt

Heute werden Inhalte überwiegend digital konsumiert. Auf Handys, Tablets,
Laptops, großen Bildschirmen. In wechselnden Situationen, zwischendurch,
unterwegs, abends auf dem Sofa.

Ein Format, das für den Ausdruck optimiert ist, wird diesem Alltag nicht
gerecht. PDFs sind deshalb keine neutrale Wahl. Sie machen das Lesen unnötig
anstrengend. Und was anstrengend ist, wird weniger gelesen.

HTML ist dafür gebaut, Inhalte auf unterschiedlichen Geräten gut lesbar zu
machen. Entscheidend ist erst einmal das Ergebnis: Texte, die sich gut lesen
lassen.

Und die naheliegende Frage ist dann natürlich: „Okay -- aber wie schreibt man
sowas, ohne Webentwickler\:in zu sein?"

Das lässt sich erstaunlich einfach halten.

Variante A: Man schreibt sehr simples HTML (wirklich: Überschriften, Absätze,
Listen, Links) -- das reicht für 90%.

Variante B: Man schreibt in einem einfacher zu tippenden Format und lässt daraus
HTML machen. Der Klassiker dafür ist Markdown: Überschriften mit `#`, Listen mit
`-`, Links in einer einfachen Schreibweise. Das ist kein Muss, aber oft der
bequemste Weg.

Variante C: Man lässt es von einer KI erzeugen und schaut nur noch drüber.

Dazu gleich mehr.

## Fazit

PDFs sind ein Überbleibsel aus der Drucklogik. Sie waren für eine andere Zeit
gedacht und für einen anderen Zweck.

Wer Inhalte verschickt, sollte sich fragen, wie sie gelesen werden -- nicht, wie
sie auf Papier aussehen.

**Don't send me PDFs. Schick mir Inhalte.**

[^typst]:
    Wenn ein Dokument wirklich _primär_ zum Ausdrucken gedacht ist (z.B. Brief,
    Vertrag, Formular), dann kann ein Print-orientierter Workflow sinnvoll sein.
    Aber genau dann sollte man es auch als _Print_ behandeln -- nicht als
    Standardformat für Lesen und Zusammenarbeit. Für Strategiepapiere,
    Protokolle, Konzepte usw. ist digitales Lesen der Normalfall, und dafür ist
    HTML die bessere Wahl.
