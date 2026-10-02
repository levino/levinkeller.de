---
title: Hatchery and drones
description: 'One container per repository, built from its devcontainer.json and managed by a small open-source tool.'
sidebar:
  position: 3
---

# Hatchery and drones

## What it is

[Hatchery](https://github.com/levino/hatchery) is a small open-source tool I wrote for
exactly this setup. It manages development environments on the server: one devcontainer
per repository (or per task). In Hatchery speak these containers are called **drones**.
The whole tool is named in StarCraft Zerg style because that's fun: drones get spawned,
burrowed (`burrow`), unburrowed (`unburrow`) and slain (`slay`).

## How a drone comes to life

```bash
hatchery spawn levino/shipyard
```

Hatchery clones the repository onto the host and starts a container from it with the
official [devcontainer CLI](https://containers.dev), using the `devcontainer.json` that
lives **in the repository itself**. On top, it sneaks in a few features:

- an SSH server so I can connect,
- Tailscale so the drone becomes [a machine of its own in the tailnet](/en/docs/dev-setup/network),
- the GitHub CLI,
- a Hatchery feature of its own: Claude Code, [zellij](https://zellij.dev), the
  credential helpers for Git and `gh` (see
  [Identity and access](/en/docs/dev-setup/identity)) and a fallback `CLAUDE.md` with
  ground rules for agents.

The repository needs **nothing Hatchery-specific** for this. The same `devcontainer.json`
works unchanged in GitHub Codespaces or locally in VS Code. Hatchery is replaceable; the
repos stay portable.

Optionally Hatchery also loads my [dotfiles](https://github.com/levino/dotfiles) into
every drone: shell configuration, Git settings, a global `CLAUDE.md` and skills with my
coding conventions.

## What survives and what doesn't

A drone is disposable. Whatever must not be disposable lives on the host and is mounted
in:

- **the code**, as a Git worktree on the host,
- **Claude Code's state**: login, settings, memory and history.

So you can rebuild a drone from scratch (say, because the `devcontainer.json` changed)
and the agent still knows what it was working on. I only have to log in to Claude once
per new drone.

## Docker is the single source of truth

Hatchery has no database of its own. Which drones exist is stored in the labels of the
Docker containers and nowhere else. `hatchery list` asks Docker. So Hatchery's state can
never drift from reality, and you can handle drones with plain Docker commands too.

Besides the CLI there's one small service that runs permanently: the **credential
service**. It watches Docker events and sets up GitHub access for every drone that
starts. That's the interesting part and it has
[a page of its own](/en/docs/dev-setup/identity).

## Alternatives and why not

Before writing Hatchery I tried what exists:

- **GitHub Codespaces.** What killed it was the way of working, not the price. I can't
  just SSH into a codespace like into any other machine. There's only
  `gh codespace ssh`, a tunnel through the GitHub CLI that also needs an SSH server in
  the image. So I ended up running Claude Code in the VS Code terminal, and that was
  painful: rendering glitches, sluggishness, and again and
  again the connection dropped and the session was gone. On top of that, Codespaces
  stops an environment once it sits unused for a while (default: 30 minutes idle).
  Agents working in the background for hours don't fit that model. Then there's the
  money: billed by hours and cores, fixed machine sizes, tied to GitHub. Ten
  environments running in parallel all day gets expensive. A drone, by contrast, is a
  perfectly normal machine on the tailnet: `ssh` in, start zellij, and the session
  survives every dropped connection. Nothing gets stopped.
- **DevPod.** Good idea, but the state lives on the client: the laptop you created the
  environments on is the one that knows about them. I want to see the same thing from
  the phone, the laptop and the server.
- **Coder and similar platforms.** Powerful, but they bring Kubernetes or a platform of
  their own that you have to operate. Too much for one person with one server.
- **Plain Docker by hand.** Works, but then you keep rebuilding by hand exactly what
  Hatchery automates: joining the tailnet, SSH keys, tokens.

And one thing spoke against all of them: none of the alternatives has a good answer to
how an agent in the environment gets to GitHub without getting my full identity.
