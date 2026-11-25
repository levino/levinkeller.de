---
title: "Compute: rent, don't buy"
description: 'Rent a powerful server in a data centre instead of buying a powerful laptop.'
sidebar:
  position: 1
---

# Compute: rent, don't buy

## What it is

A single rented bare-metal server in a data centre that runs all development
environments. Since November 2026 mine is a
[Hetzner EX63](https://www.hetzner.com/dedicated-rootserver/ex63/) in Falkenstein,
Germany[^before]:

- Intel Core Ultra 7 265 with 20 cores (8 performance, 12 efficiency)
- 64 GB of DDR5 RAM
- 2× 1 TB NVMe
- €149 net per month including IPv4, plus a one-off €74 setup fee
- no minimum term, billed by the hour, cancellable at any time

**Rent, don't buy** is the most important decision in the whole setup. A laptop with
64 GB of RAM costs several thousand euros, is outdated after a few years and still has
only one battery and one fan. For that money the rented server runs for years, and if
it's no longer enough, I cancel it and rent a bigger one.

## Its role

It's the workhorse. Every repository an agent works on gets its own container there,
with its own toolchain, dependencies, dev server and tests. Five to ten of them at
the same time is normal.

The maths is simple: the bigger the machine, the more agents can work at the same
time without waiting for each other – builds, tests, dev servers, browsers for
end-to-end tests, Android emulators. Whether the limit is CPU, RAM or disk at any given
moment doesn't matter. More power is better. How much money you put on the table for
it and how hard you push the machine is up to you.

## What it buys you: rent the machine, don't buy a powerful laptop

That's the real punchline. When the work happens on the server, the laptop is just a
terminal with a nice screen. I work on a MacBook Neo: light, long battery life, great
display, and more than fast enough for what it has to do. It doesn't get warm when ten
agents run `npm install` at the same time, because that happens elsewhere.

Also: with agents, I hardly type. I talk. For dictation I use
[Whispering](https://github.com/epicenter-so/epicenter), an open-source speech-to-text
tool. Explaining to an agent for two minutes what I want is faster and usually more
precise than writing it down.

And the agents keep working when the laptop lid is closed.

## Alternatives

- **Locally on the laptop.** Works as long as it's one or two agents. After that the
  laptop gets loud, hot and drained, and every trip interrupts the work.
- **Cloud VMs billed by the hour** (AWS, GCP, Hetzner Cloud). Flexible, but for a
  machine that runs all day anyway, much more expensive than dedicated hardware.
- **Hosted environments** like GitHub Codespaces. No plain SSH access, environments get
  stopped when idle, billed per hour and core, and you're tied to one vendor. More on
  that under
  [Hatchery](/en/docs/dev-setup/hatchery).
- **A machine at home.** Works, but depends on your home connection and your home
  power supply.

## Why this way

A rented dedicated server is the cheapest way to have lots of computing power
permanently available, and the most convenient: I don't have to buy, upgrade or carry any hardware.
Development environments don't need high availability: if the server dies, the code is
still on GitHub, and the environments can be rebuilt on any other machine from their
`devcontainer.json` files.

[^before]: Before this I had a smaller, cheaper server: an Intel quad-core with 62 GB
    of RAM for a two-digit euro amount per month. At some point it simply wasn't
    enough any more, so now I have the bigger one.
