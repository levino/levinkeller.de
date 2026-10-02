---
title: Native Apps
description: 'Android-Emulatoren laufen in der Drohne. iOS braucht macOS und ist eine Randnotiz.'
sidebar:
  position: 6
---

# Native Apps

Für Web-Projekte reicht ein Container. Für mobile Apps braucht man Emulatoren, und
die brauchen Virtualisierung.

## Android: auf dem Server

Android-Emulatoren laufen auf Linux, brauchen aber Hardware-Virtualisierung (KVM),
um brauchbar schnell zu sein. Hatchery kann das Gerät `/dev/kvm` in eine Drohne
durchreichen:

```bash
hatchery spawn levino/irgendeine-app --kvm
```

Damit läuft der Emulator direkt in der Drohne, und der Agent kann die App bauen,
installieren und testen wie jeder andere Prozess. Das ist bewusst **opt-in**, weil
fast keine Drohne es braucht.

## iOS: Level 2

iOS-Apps lassen sich nur auf macOS bauen und im Simulator testen, das ist Apples
Regel. Dafür betreibe ich auf meinem Mac Studio eine macOS-VM mit Xcode, Simulator
und `xcodebuild`, in die ein Agent per SSH kommt. Sie hat ihre eigenen, eng
geschnittenen Zugänge, wie eine Drohne.

Das ist von Hand gebaut und nicht von Hatchery automatisiert. macOS-VMs können keine
weitere Virtualisierung, deshalb gibt es darin auch kein Docker. Für das Setup ist
das eine Randnotiz: Es zeigt, dass das Prinzip (eigene Umgebung, eigene Identität,
Agent darf darin alles) auch über Linux-Container hinaus trägt.
