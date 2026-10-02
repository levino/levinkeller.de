# Explainer video "The drone is the sandbox" (EN)

Narration for the video on https://levinkeller.de/en/docs/dev-setup/. One narrator, AI-generated
voice (Gemini TTS, see `stimme.json`). Only sources: the dev-setup pages and `llms.txt`.

Format: every `## <number>` heading is a scene. Lines starting with `>` describe the picture and are
not spoken; everything else is narration. Voice it with `python3 skripte/vertonen.py en`.

## 1 · The question

> Title "The drone is the sandbox". Several agent cursors at work, an ID card that stays locked away.

I hardly write code by hand anymore. Several Claude Code agents work on different repositories at once, and I read, steer and decide. Which raises one question: how do you give agents that much freedom without handing them your digital identity?

## 2 · A server, not a laptop

> Light laptop on the left, a big used server on the right, RAM filling up with drones.

It starts with the metal. Everything runs on one used bare-metal server: an older quad-core with sixty-two gigabytes of RAM. Agents need memory more than compute. So the laptop is just a terminal with a nice screen. And the agents keep working when the lid is closed.

## 3 · Tailnet: reachability, not security

> Drones as named machines in a dashed network. Stamp: "reachability ≠ security".

Every environment joins a private WireGuard network, a tailnet, as a machine of its own, with its own name. No port juggling, nothing open to the internet. But the tailnet is about reachability, not security. Getting into an environment still takes my key.

## 4 · Hatchery and drones

> Terminal: hatchery spawn levino/shipyard. A drone hatches; spawn, burrow, unburrow, slay. Code and Claude state stay on the host.

The environments are managed by Hatchery, a small open-source tool. One devcontainer per repository, built from the repo's own devcontainer dot json. In proper Zerg fashion they are called drones: you spawn them, burrow them, and slay them. A drone is disposable. The code and Claude's memory live on the host.

## 5 · The agent channel

> Credential service, socket into the drone, fresh token on every access, levino/shipyard only, push to GitHub. Another repo: 403.

Now the heart of it: two separate channels. The agent channel runs through a GitHub App. A credential service on the host holds the app's key and mounts a Unix socket into every drone. On every access, git asks the socket for a fresh token, scoped to that drone's repositories. Anything else gets a 403. Nothing is stored on disk. The identity is the mount itself. And a leaked token is useless within the hour.

## 6 · The human channel

> SSH key in the Secure Enclave, Touch ID, ssh -A on a leash. Dashed line to prod: "finger only".

The human channel is me. My SSH key lives in the Secure Enclave of my Mac and cannot be exported. Every single signature wants my fingerprint. So even with agent forwarding, an agent can't quietly hop onto a production server. At most, it can ask me.

## 7 · The workplace

> zellij with several agent panes. Badge "--dangerously-skip-permissions". Phone via Remote Control.

My workplace is a terminal: SSH into a drone, zellij, several agents side by side. They run without permission prompts, because the drone is the sandbox. It's disposable, its token is scoped, and anything sensitive needs my finger. On the go, I pick up the session on my phone, through Claude's Remote Control.

## 8 · Where it ends

> GitHub, then CI and Argo CD to the cluster, in green. Agents stop at GitHub.

This setup ends where code reaches GitHub. From there, CI and Argo CD take over. Agents push branches and open pull requests. They need no access to the cluster at all.

## 9 · Read more

> levinkeller.de/docs/dev-setup, llms.txt, open-source repos. "Voice: AI-generated".

The full architecture, with the reasoning and the alternatives, is on levinkeller dot de, under docs, dev setup. Or hand the llms dot txt to your own AI, and grill it.
