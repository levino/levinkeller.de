---
title: Identity and access
description: 'Two separate channels: narrowly scoped tokens for the agent and a fingerprint-guarded SSH key for the human.'
sidebar:
  position: 4
---

# Identity and access

This is the heart of the setup. Everything else is convenience; here it's about one
question: **What may an agent that has full rights inside a drone do outside that
drone?**

My answer: there are two separate channels. The agent works through one, I work
through the other.

## The agent channel: a GitHub App instead of my identity

### The problem

The obvious way is to run `gh auth login` in the environment or to pass in your own SSH
key. Then the agent can push. But it can also do everything else I can do: write to
every one of my repositories, in every organisation I'm a member of, delete releases,
change settings. An agent that goes off the rails, a booby-trapped README or a
compromised dependency – and the damage isn't limited to the repository being worked on.

Fine-grained personal access tokens would be an alternative, but creating, expiring and
renewing them by hand per environment is tedious and error-prone.

### The solution

I created my own **GitHub App** and installed it in my organisations. A GitHub App can
issue **installation tokens** that can be limited to single repositories. They don't
belong to my user account but to the app.

Only the credential service on the host knows the app's private key. It mounts a
**Unix socket** into every drone. Whoever asks at that socket gets a fresh token, but
only for the repositories granted to exactly this drone. If the drone asks for another
repo, it gets a `403` along with a hint on how I could grant it.

There are no passwords and no tokens on the drone's disk. **The identity is the mount
itself**: which drone is asking follows from which socket it is. That can't be faked,
because the host creates the socket, not the container.

So as long as the drone runs, the agent has continuous access to its repos: every
access fetches a fresh token, and none is ever stored. That installation tokens expire
after one hour isn't the boundary, just a safety net in case one does get out of the
drone: then it's useless after an hour at most and only ever worked for those repos. A
`gh auth login` token or my personal SSH key, by contrast, works everywhere and doesn't
expire.

### How Git and `gh` find out

The Hatchery feature sets up two things in every drone:

- a **Git credential helper** that asks the socket for a token on every GitHub access.
  SSH URLs are rewritten to HTTPS so `git@github.com:…` works too.
- a **wrapper around `gh`** that fetches a token before every call.

To the agent it feels like a normally logged-in system. `git push` and `gh pr create`
just work. Every drone also gets a `CLAUDE.md` with three rules: never `gh auth login`,
never hardcode tokens, and on authentication errors say so instead of working around
them.

### Grants change at runtime

If an agent needs a second repository, I grant it:

```bash
hatchery repo connect levino/shipyard levino/levinkeller.de
```

That takes effect immediately, without a restart. Taking it back is just as quick:
`hatchery repo disconnect` removes a repo from the grants, `hatchery slay` removes the
drone along with its socket. I don't have to wait for any token to expire.

The list of grants lives on the host
**outside** the drone. So a drone can't widen its own rights, not even by editing a
file and waiting for the next restart.

### A stricter model for comparison

For repositories on my own [Forgejo](https://forgejo.org) instance, Hatchery goes one
step further: the drone doesn't get a real token at all, only a placeholder. Its Git
traffic goes through a per-drone proxy that checks every request against the grant list
and only then swaps in the real token. The agent never sees the secret. That's cleaner,
but also more effort – for GitHub the token model is enough for me.

## The human channel: SSH with a fingerprint

### My key never leaves the Mac

My SSH key lives in the **Secure Enclave** of my Mac, managed with
[Secretive](https://github.com/maxgoedjen/secretive). It can't be exported, copied or
read out. Every signature with it asks for confirmation via Touch ID.

I use this key to log in to the drones. When they start, the drones fetch the allowed
public keys straight from my GitHub profile.

### Agent forwarding on a leash

I often connect with `ssh -A`, i.e. with agent forwarding. That lets the drone *use* my
key, for example to push to a repository that doesn't go through the app, or to hop on
to another server. Classically that would be dangerous: any process in the drone could
log in anywhere as me for as long as the connection is open.

With Secretive it's different. **Every single use** of the key pops up on my Mac and
wants my finger. So an agent can't quietly hop onto the production server. At most it
can ask me, and then I see what it's up to.

To be honest: sometimes I loosen the leash. When an agent is supposed to work on a server
for an hour, I keep a shared SSH connection (`ControlMaster`) open so I don't have to
confirm every minute. That's a conscious decision for a limited time, not a permanent
state.

## Why two channels

The two channels cover different needs:

| | Agent channel | Human channel |
|---|---|---|
| **Who** | the agent, any time | me, with my finger |
| **For** | reading and pushing code, PRs, issues | logging in to drones, servers, anything sensitive |
| **Reach** | only granted repos | everything I'm allowed to |
| **If it leaks** | token works for 1 hour at most, only for these repos | key never leaves the Mac, signing only with my finger |
| **Revoke** | immediately via `repo disconnect` or `slay` | don't put my finger down |
| **Without me** | runs | stops |

The agent can do its work without me. Anything beyond that needs me physically. That
difference is the core of the whole setup.
