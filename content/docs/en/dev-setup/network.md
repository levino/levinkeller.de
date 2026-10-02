---
title: Network
description: 'A tailnet makes every environment reachable. It is not in charge of security.'
sidebar:
  position: 2
---

# Network: reachability, not security

## What it is

All my devices and all development environments sit in one shared private network, a
**tailnet** based on WireGuard. I use [Tailscale](https://tailscale.com) as the client.
Coordination is done by [Headscale](https://github.com/juanfont/headscale), the
open-source implementation of the Tailscale control server. I run it myself and log in
through my own identity provider. To get started, Tailscale's free tier is just as good;
Headscale is a side note for people who want to self-host everything.

## Its role

Every development environment joins the tailnet as **a machine of its own**, with its
own name. They all listen on the same ports and differ only by name:
`hatchery-levino-shipyard`, `hatchery-levino-levinkeller-de` and so on. Instead of
remembering which environment is on which port of the server, I address it directly.
I don't hand out ports on the server, don't maintain port forwards and don't open
anything to the internet. To look at an environment's dev server in the browser, I
just open its name plus the port, from the laptop or the phone.

The environments are registered as **ephemeral** nodes: delete one, and after a while it
disappears from the device list by itself.

## What it is *not*

The tailnet is **not** my security layer. It's convenient and it reduces the attack
surface, but I don't rely on it. Being in the tailnet doesn't get anyone into an
environment: each one requires my key for SSH login, and that key needs my fingerprint
(see [Identity and access](/en/docs/dev-setup/identity)). Password login is off.

There's a practical reason for that: a network that gets misconfigured once, a device
that gets lost, a share you forgot about – all of that happens. If security depends on a
single layer, that's one too few.

## A back door, on purpose

The server itself is also reachable via plain SSH from the internet. That's deliberate:
when the tailnet acts up (and it occasionally does), I can still get in and fix it. A
network that can only be repaired through itself is a trap.

## Alternatives

- **Opening ports on the host** and working through SSH tunnels. Works, but scales
  poorly: every environment needs its own ports and you have to remember them.
- **A classic VPN** (OpenVPN, plain WireGuard). Works, but you maintain keys and IP
  addresses by hand, and new environments don't show up on their own.
- **ZeroTier, Nebula, NetBird.** Similar idea to Tailscale. Tailscale won for me because
  there's a ready-made devcontainer feature and because Headscale exists as a free
  control server.
