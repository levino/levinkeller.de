---
title: FAQ
description: 'Frequently asked questions about the dev setup.'
sidebar:
  position: 8
---

# FAQ

## Why not just `gh auth login` in the environment?

Because then the agent *is* me. The token from `gh auth login` is valid for every
repository in every organisation I have access to, and it doesn't expire. Instead, the
drone fetches a fresh GitHub App token on every access, valid only for its repositories
and useless after an hour at most should it ever get out. More
under [Identity and access](/en/docs/dev-setup/identity).

## Why no SSH keys in the drones?

Same reason. An SSH key for GitHub is bound to my account and opens everything. A key
lying around in a drone can also be copied. My only key lives in the Secure Enclave of my
Mac and can't leave it.

## But you forward the SSH agent with `ssh -A`?

Yes. That's the human channel. The drone can use my key, but only with my fingerprint,
for every single signature. An agent can't do anything with it behind my back. Sometimes
I deliberately keep a connection open for a while so I don't have to confirm constantly –
that's a decision for a limited time.

## Isn't the tailnet the actual security layer?

No. The tailnet makes every drone reachable under its name. Anyone in the tailnet still
needs my key to log in. And the dev server is deliberately reachable via SSH without the
tailnet too, as an emergency exit when the tailnet acts up. See
[Network](/en/docs/dev-setup/network).

## Why not GitHub Codespaces or DevPod?

With Codespaces the way of working was the problem. I can't SSH into one like into any
other machine, only through the `gh codespace ssh` tunnel. So Claude Code ran in the VS
Code terminal, with rendering glitches, sluggishness and dropped sessions. And after an
idle timeout (default: 30 minutes) Codespaces stops the environment, which doesn't fit
agents working in the background for hours. It's also expensive for many always-on
environments and tied to GitHub. A drone I reach with plain `ssh` over the tailnet, the
zellij session survives dropped connections, and nothing idles out.

DevPod keeps the state on the client, and I want to see the same thing from every
device. And neither has a good answer to how the agent gets to GitHub without
getting my identity. The repositories stay compatible though: every `devcontainer.json`
Hatchery uses also works in Codespaces.

## Isn't `--dangerously-skip-permissions` dangerous?

On your own laptop: yes. In a drone: hardly. The drone is disposable, its token only
reaches its repositories, and anything involving my identity needs my finger. The worst
an agent can do is a broken branch in a granted repository.

## Why a weak laptop?

Because it doesn't have to compute anything. The work happens on the server. What I need
from the laptop is a good display, a good keyboard, a good microphone and long battery
life. See [Compute](/en/docs/dev-setup/compute).

## Do you type all of that?

No, I talk. With speech-to-text I explain to an agent in two minutes what I want. That's
faster than typing and usually more precise too, because you give more context when you
speak.

## And from the phone?

No SSH. I switch on Remote Control in a running Claude Code session and steer it from the
Claude app. Only when the agent needs my SSH key do I have to go to the Mac. See
[Workplace](/en/docs/dev-setup/workplace).

## What about iOS apps?

They need macOS. I have a macOS VM on a Mac Studio for that, which agents reach via SSH.
It's not automated and more of a side note, see
[Native apps](/en/docs/dev-setup/native-apps). Android, on the other hand, runs right
inside a drone on the server.

## What does it cost?

The server is a used dedicated machine from the Hetzner server auction and costs a
two-digit euro amount per month. Tailscale is free for personal use, Headscale and
Hatchery are open source. The biggest item is the subscription for the agents
themselves.

## Can I use Hatchery?

Yes, it's [open source](https://github.com/levino/hatchery). It is, however, built for
exactly my use case: one human, one server, GitHub. But the ideas carry over without
Hatchery too: a GitHub App for agent tokens, a hardware-bound SSH key for the human, and
environments you can throw away.
