---
title: Native apps
description: 'Android emulators run inside the drone. iOS needs macOS and is a side note.'
sidebar:
  position: 6
---

# Native apps

For web projects a container is enough. Mobile apps need emulators, and emulators need
virtualisation.

## Android: on the server

Android emulators run on Linux but need hardware virtualisation (KVM) to be usably fast.
Hatchery can pass the `/dev/kvm` device into a drone:

```bash
hatchery spawn levino/some-app --kvm
```

The emulator then runs right inside the drone, and the agent can build, install and test
the app like any other process. This is deliberately **opt-in**, because almost no drone
needs it.

## iOS: level 2

iOS apps can only be built and tested in the simulator on macOS – Apple's rule. For that
I run a macOS VM on my Mac Studio with Xcode, the simulator and `xcodebuild`, which an
agent reaches via SSH. It has its own narrowly scoped access, just like a drone.

It's hand-built and not automated by Hatchery. macOS VMs can't do nested virtualisation,
so there's no Docker inside either. For this setup it's a side note: it shows that the
principle (own environment, own identity, agent may do anything inside) carries beyond
Linux containers.
