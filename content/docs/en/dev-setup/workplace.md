---
title: Workplace
description: 'SSH into the drone, zellij, several Claude Code agents in parallel – and Remote Control from the phone.'
sidebar:
  position: 5
---

# Workplace

## At the laptop: SSH, zellij, several agents

My workplace is a terminal. I SSH into a drone and start [zellij](https://zellij.dev)
there, a terminal multiplexer (like tmux, but with friendlier defaults). zellij runs
several tabs and panes, and in several of them a Claude Code agent is at work. The agents
spin up sub-agents of their own for research or reviews when needed.

zellij has an important side effect: the session lives on in the drone when the
connection drops. Close the laptop, the train enters a tunnel, whatever – next time I
connect everything is still there, and the agents kept working in the meantime.

Usually I have several drones open at once, one per project. I switch between them the
way you switch between colleagues: who's done, who has a question, who needs a decision?

## Agents without confirmation prompts

By default Claude Code asks for permission before every command and every file change.
In the drone I turn that off (`--dangerously-skip-permissions`). That sounds more
dangerous than it is, because **the drone is the sandbox**:

- It's disposable and can be rebuilt from the `devcontainer.json` at any time.
- The code lives in Git, and everything important lands on GitHub through pull requests.
- Its GitHub token only reaches the granted repositories.
- Anything that needs my identity needs my finger.

An agent that keeps asking for permission isn't an agent, it's a very slow colleague.
Safety comes from the environment, not from the prompts.

## What agents bring along

Every repository has a detailed `CLAUDE.md` with project knowledge, often plus skills and
sub-agents of its own in `.claude/`. My personal conventions (for example test-driven
development, functional style with [Effect](https://effect.website), no classes) live as
a skill in my [dotfiles](https://github.com/levino/dotfiles) and reach every drone via
Hatchery.

## On the go: Remote Control instead of SSH

From the phone I do **not** connect via SSH. A terminal on the phone is a pain, and my
key lives on the Mac anyway. Instead I use Claude Code's **Remote Control**: I switch it
on in a running session, and then I can continue that session in the Claude app on my
phone. I see what the agent is doing, answer its questions, give it the next task.

That works well for what you actually do on the go: read, decide, say something short.
Voice input on the phone fits right in.

The catch: when the agent needs my SSH key, I have to confirm on the Mac. That doesn't
work from the phone. In practice it rarely matters, because the agent's work runs through
the [agent channel](/en/docs/dev-setup/identity) and doesn't need me.

## Alternatives

- **VS Code Remote-SSH or JetBrains Gateway.** Works with every drone because each has a
  perfectly normal SSH server. I rarely need the IDE because I hardly edit code myself.
- **tmux instead of zellij.** Just as good if you know it.
- **Mobile SSH clients** like Blink or Termius. They work, but an agent wants to be read
  and steered, not operated. A chat interface is better for that.
