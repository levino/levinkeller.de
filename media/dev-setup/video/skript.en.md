# Explainer video "Many agents, one workplace" (EN)

Narration for the video on https://levinkeller.de/en/docs/dev-setup/. One narrator, AI-generated
voice (Gemini TTS, see `stimme.json`). Only sources: the dev-setup pages and `llms.txt`.
Weighting: convenience and security count equally, convenience first (scenes 2–12), security
compact at the end (scenes 13–15).

Format: every `## <number>` heading is a scene. Lines starting with `>` describe the picture and are
not spoken; everything else is narration. Voice it with `python3 skripte/vertonen.py en`.

## 1 · Many agents, one workplace

> Title. Four agent terminals at work in parallel. On the right two questions: "Where do they run?" (convenient) and "What may they do?" (secure).

I hardly write code by hand anymore. Several Claude Code agents work on different repositories at once, and I read, steer and decide. That takes a workplace that answers two questions. Where do all these agents run, comfortably and reachable from anywhere? And what are they allowed to do, without getting my identity?

## 2 · Rent the machine

> Rented server from the Hetzner server auction: 62 GB of RAM, around the clock, a two-digit euro amount per month. The RAM fills up with drones.

The most important decision in the whole setup: the machine is rented, not bought. Mine is a second-hand bare-metal server from the Hetzner server auction with sixty-two gigabytes of RAM. It runs around the clock and costs a two-digit euro amount per month. Five to ten environments run there at once, and what runs out is memory, not CPU.

## 3 · No fat laptop

> Left: the expensive 64 GB laptop, ten npm installs, temperature and fan climb, battery drains. Right: the MacBook Neo, light, cool, full battery. Lid closes, the agents keep working.

The alternative would be a laptop with sixty-four gigabytes. It costs several thousand euros, is outdated after a few years, and has only one battery and one fan. Ten agents running npm install, and it gets loud, hot and drained. My laptop is a MacBook Neo: light, long battery life, great display. It stays cool, because the work happens elsewhere. And when I close the lid, the agents keep working.

## 4 · Work from anywhere

> Server in the middle, around it a desk, a train and a phone. A bigger server. Then the server dies: the code is on GitHub, the drones are rebuilt from their devcontainer.json.

Because the work lives on the server, it doesn't matter where I am: at my desk, on a train, or with nothing but my phone. If the server is no longer enough, I cancel it and rent a bigger one. And if it dies, the code is still on GitHub. Every environment can be rebuilt on another machine from its devcontainer dot json.

## 5 · Talk, don't type

> Microphone and waveform turning into text in an agent's prompt. Whispering, open source.

And I hardly type. I talk. With Whispering, an open-source speech-to-text tool, I spend two minutes explaining to an agent what I want. That's faster than typing and usually more precise, because when you talk, you give more context.

## 6 · Every environment a machine

> Tailnet: laptop and phone, drones with names. Address bar with a drone's name. Stamp "reachability ≠ security".

My devices and all environments sit in a private WireGuard network, a tailnet. In it, every environment is a machine of its own, with its own name. To see an environment's dev server, I just open it by name, from the laptop or from the phone. No port juggling, nothing open to the internet. But: the tailnet is about reachability, not security. Getting in still takes my key.

## 7 · Hatchery: one command

> Terminal: hatchery spawn levino/shipyard. Features move into the drone: SSH server, Tailscale, GitHub CLI, Claude Code, zellij. More drones hatch next to it.

The environments are managed by Hatchery, a small open-source tool. One command, hatchery spawn with the repo's name, and Hatchery builds a devcontainer from the devcontainer dot json in the repo itself. It adds what I need: an SSH server, Tailscale, the GitHub CLI, Claude Code and zellij. One environment per repository, many in parallel.

## 8 · Disposable, not forgetful

> spawn, burrow, unburrow, slay. The drone is deleted and rebuilt, code and Claude state stay on the host. Next to it: works in Codespaces too, dotfiles in every drone.

In true Zerg style they're called drones: you spawn them, burrow them and slay them. A drone is disposable. The code and Claude's state, meaning login, memory and history, live on the host. After a rebuild, the agent still knows what it was working on. The repos stay portable: the same configuration runs in Codespaces too. And my dotfiles go into every drone.

## 9 · The workplace

> zellij with several agents. The connection drops (tunnel), the agents keep working, on reconnect everything is there. Drones as colleagues: done, question, decision.

My workplace is a terminal: SSH into a drone, start zellij, several agents side by side. The session lives on when the connection drops. Train in a tunnel, whatever: next time I connect, everything is still there, and the agents kept working. I switch between drones the way you switch between colleagues: who's done, who has a question, who needs a decision?

## 10 · No permission prompts

> Permission dialogs disappear. Badge "--dangerously-skip-permissions", next to it the reasons with check marks.

Inside the drone, I turn the permission prompts off. That sounds more dangerous than it is, because the drone is the sandbox: it's disposable, its token only covers its own repos, and anything that needs my identity needs my finger. An agent that keeps asking isn't an agent, it's a very slow colleague.

## 11 · Why not Codespaces?

> Side by side: Codespaces and a drone. SSH, terminal, idle.

Why not just use GitHub Codespaces? I can't simply SSH in there, only through a tunnel. So Claude Code ran in the VS Code terminal, with rendering glitches and sessions that were gone whenever the connection dropped. And after thirty minutes of idle time, Codespaces stops the environment. For agents that work for hours, that's useless. A drone is an ordinary machine, and nothing gets stopped.

## 12 · From the phone

> Phone with the Claude app, Remote Control into the running session. The agent asks, I answer by voice.

From my phone I don't use SSH, I use Claude Code's Remote Control. I pick up the running session in the Claude app: see what the agent is doing, answer its questions, give it the next task, often by voice. Only when it needs my SSH key do I have to go to the Mac.

## 13 · The agent channel

> Credential service, socket into the drone, a fresh token on every access, levino/shipyard only, push to GitHub. Another repo: 403. repo connect and disconnect.

Which leaves the second question: what are the agents allowed to do? Two separate channels. The agent channel runs through a GitHub App. A credential service on the host mounts a Unix socket into every drone. On every access, git fetches a fresh token there, scoped to the granted repositories. Anything else: 403. Nothing is stored; the identity is the mount itself. I change grants at runtime and revoke them instantly. The one-hour expiry only matters if a token ever leaks.

## 14 · The human channel

> SSH key in the Secure Enclave, Touch ID, ssh -A on a leash. Dashed line to the prod server: "finger only".

The human channel is me. My SSH key lives in my Mac's Secure Enclave and cannot be exported. Every single signature wants my fingerprint. Even with agent forwarding it stays on a leash: an agent can't sneak onto a production server. At most, it can ask me.

## 15 · Where it ends

> GitHub, then CI and Argo CD to the cluster, in green. Agents stop at GitHub.

The setup ends at GitHub. Agents push branches and open pull requests; from there, CI and Argo CD take over. They need no access to the cluster for that.

## 16 · Read more

> levinkeller.de/docs/dev-setup, llms.txt, open-source repos. "Voice: AI-generated".

The full architecture, with reasoning and alternatives, is on levinkeller dot de, under docs, dev setup. Or hand the llms dot txt to your own AI and grill it.
