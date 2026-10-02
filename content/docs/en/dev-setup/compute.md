---
title: Compute
description: 'A powerful server in a data centre instead of a powerful laptop.'
sidebar:
  position: 1
---

# Compute: a server, not a laptop

## What it is

A single bare-metal server in a data centre that runs all development environments.
Mine is a second-hand machine from the Hetzner server auction: an older Intel quad-core
with 62 GB of RAM. Nothing fancy, but it runs around the clock, sits on a fast line
and is pretty cheap second-hand.

## Its role

It's the workhorse. Every repository an agent works on gets its own container there,
with its own toolchain, dependencies, dev server and tests. Five to ten of them at
the same time is normal.

For what agents do, **memory** is the scarce resource, not CPU time: every container
holds its Node process, its language server, its test runner, sometimes a browser for
end-to-end tests. 16 GB is enough to start with; with 64 GB you stop thinking about it.
Many cores help when several agents build at once.

## What it buys you: don't buy a powerful laptop

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
- **Hosted environments** like GitHub Codespaces. Convenient, but billed per hour and
  core, and you're tied to one vendor. More on that under
  [Hatchery](/en/docs/dev-setup/hatchery).
- **A machine at home.** Works, but depends on your home connection and your home
  power supply.

## Why this way

A used dedicated server is the cheapest way to have lots of RAM permanently available.
Development environments don't need high availability: if the server dies, the code is
still on GitHub, and the environments can be rebuilt on any other machine from their
`devcontainer.json` files.
