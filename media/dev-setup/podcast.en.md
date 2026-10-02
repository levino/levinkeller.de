# Podcast "The drone is the sandbox" – Levin Keller's dev setup for AI agents

Two voices, both AI-generated, talk about the setup described at
https://levinkeller.de/en/docs/dev-setup/. The only sources are those pages and
`public/de/docs/dev-setup/llms.txt`. Voiced with `scripts/tts/podcast_vertonen.py`.

## Intro

**HOST:** Quick heads-up before we start: both voices in this episode are AI-generated. Which feels appropriate, because today's topic is a setup where AIs write almost all the code. Hi, and welcome!

**EXPERT:** Hi! Yes, this is a bit like two robots doing a factory tour of a robot factory.

**HOST:** We're talking about Levin Keller's dev setup. By his own account, he hardly writes code by hand anymore. Several Claude Code agents work on different repositories at the same time, and he reads, steers and decides.

**EXPERT:** So less programmer, more shift supervisor.

**HOST:** And I'll be honest, my first reaction was: hang on. A bunch of agents rummaging around on my machine, logged in as me on GitHub? That makes me a little nervous.

**EXPERT:** Good, because that's exactly the question the whole setup is built around. How do you give agents as much freedom as possible without handing them your digital identity? And no, this isn't a how-to. It's architecture: the building blocks, and why.

## Don't buy a powerful laptop

**HOST:** Let's start with the metal. What does all of this run on?

**EXPERT:** One server in a data center. A used box from Hetzner's server auction: an older Intel quad-core with 62 gigs of RAM.

**HOST:** An older quad-core. For an entire army of agents.

**EXPERT:** That's the first surprise. Agents mostly need memory, not compute. Every environment holds a Node process, a language server, a test runner, sometimes a browser. Five to ten of those at once is a normal day for him.

**HOST:** And the laptop?

**EXPERT:** That's the actual punchline. The docs literally say: don't buy a powerful laptop.

**HOST:** Nobody has ever told me that. Everyone always says: get the Pro, max out the RAM, you'll regret it otherwise.

**EXPERT:** If the work happens on the server, the laptop is just a terminal with a nice screen. Levin uses a MacBook Neo. Light, long battery life, great display. It doesn't even get warm when ten agents run npm install at the same time, because that's happening somewhere else.

**HOST:** Ten parallel npm installs and the laptop is just sitting there, sipping a smoothie.

**EXPERT:** Pretty much. And the agents keep working when the lid is closed. One more detail: he barely types. He talks. With an open-source speech-to-text tool called Whispering, he spends two minutes explaining to an agent what he wants. That's faster than typing, and usually more precise, because you give more context when you speak.

## The Hatchery and its drones

**HOST:** Okay, one server. How do the agents get onto it?

**EXPERT:** Through a small open-source tool Levin wrote for exactly this: Hatchery. It manages dev containers on the server, one per repository. And in Hatchery-speak, those containers are called drones.

**HOST:** Hatchery. Drones. Wait. Is this StarCraft? Is this Zerg?

**EXPERT:** It is. The whole tool is named Zerg-style, and the docs say that's simply because it's fun. Drones get spawned, you burrow them to stop them, unburrow them to start them again, and when you're done with one: slay.

**HOST:** Honestly, every infrastructure tool should work like this. Not "stop container". Burrow.

**EXPERT:** So you run hatchery spawn levino slash shipyard. Hatchery clones the repo onto the host and starts a container with the official dev container CLI, using the devcontainer dot json that lives in the repository itself.

**HOST:** So there's no special Hatchery config format?

**EXPERT:** None, and I think that's one of the nicest decisions in the whole thing. The repo needs nothing Hatchery-specific. The same file works unchanged in GitHub Codespaces or locally in VS Code. Hatchery just sneaks in a few extras: an SSH server, Tailscale, Claude Code, zellij and the credential helpers.

**HOST:** And if I throw a drone away, is everything gone?

**EXPERT:** No. Whatever has to survive lives on the host and gets mounted in. The code, as a git worktree. And the Claude Code state: login, settings, memory, history. You can rebuild a drone from scratch and the agent still knows what it was working on.

**HOST:** That's a little spooky. The drone dies, but its memories live on.

**EXPERT:** Very Zerg. And another nice detail: Hatchery has no database of its own. Which drones exist is stored only in the labels on the Docker containers. Docker is the single source of truth.

**HOST:** Why build this at all, though? Codespaces exists. DevPod exists. Coder exists.

**EXPERT:** He tried them. Codespaces is comfortable, but billed by the hour and by the core, and ten environments running all day gets expensive. With DevPod, only the laptop you created an environment on knows it exists. Coder brings a whole Kubernetes platform along. But what really tipped it was something else.

**HOST:** Let me guess. Credentials.

**EXPERT:** Exactly. None of the alternatives has a good answer to: how does an agent inside the environment get to GitHub without getting its human's full identity?

## The heart of it: two channels

**HOST:** Which brings us to the heart of the setup.

**EXPERT:** Right. The question is: an agent has full rights inside its drone. What is it allowed to do outside of it? And Levin's answer is two separate channels. The agent works through one. The human works through the other.

**HOST:** Let's start with the agent. The obvious move would be to just run gh auth login inside the drone and call it a day.

**EXPERT:** And now the agent is you. It can write to every repo you have, in every org you're a member of, delete releases, change settings. One poisoned README, and the damage isn't limited to that one repo anymore.

**HOST:** Okay, I don't want that. What does he do instead?

**EXPERT:** He created his own GitHub App and installed it in his organizations. A GitHub App can issue installation tokens that can be scoped down to individual repositories, and they belong to the app, not to his user account.

**HOST:** And who holds the app's private key?

**EXPERT:** Only a small service on the host, the credential service. It watches Docker events and mounts a Unix socket into every drone that starts. Ask that socket, and you get a fresh token, but only for the repos that drone has been granted. Ask for any other repo and you get a 403, plus a hint on how Levin could grant it.

**HOST:** A very polite no.

**EXPERT:** And here's my favorite sentence in the entire docs: the identity is the mount itself. No passwords, no tokens on the drone's disk. Which drone is asking follows from which socket it is. And you can't fake that, because the host creates the socket, not the container.

**HOST:** I like that. It's like a pneumatic tube system: whoever is attached to the tube is automatically the sender.

**EXPERT:** Nice. For the agent it just feels like a normal logged-in machine: a git credential helper and a wrapper around gh fetch a fresh token from the socket on every access, and git push just works. Every drone also gets a CLAUDE dot md with three rules: never run gh auth login, never hard-code tokens, and if authentication fails, say so instead of building a workaround.

**HOST:** Wait, a fresh one every time? I thought those tokens expire after an hour. So the agent finds the door locked after lunch?

**EXPERT:** No, and that's the part people get wrong. As long as the drone runs, the agent has continuous access, because it just fetches a new token every time. The boundary isn't the clock. It's the grant list, and the fact that tokens only come out of that one socket, which only exists inside that drone. The hour only matters if a token ever leaks: then it's useless within an hour at most, and it only ever worked for those repos. A gh auth login token or your personal SSH key works everywhere, with no expiry at all.

**HOST:** What if the agent needs a second repo?

**EXPERT:** Levin grants it with hatchery repo connect. It takes effect immediately, and so does taking it back: repo disconnect, or just remove the drone. And the list lives outside the drone, so a drone can't widen its own permissions.

**HOST:** And the second channel, the human one?

**EXPERT:** That's SSH. Levin's key lives in the Secure Enclave of his Mac, managed by an app called Secretive. It can't be exported, copied or read out. And every single signature needs Touch ID.

**HOST:** Every single one? That sounds exhausting.

**EXPERT:** His own words: occasionally annoying, and exactly as intended.

**EXPERT:** And that's what makes agent forwarding safe. He often connects with ssh dash A, so the drone can use his key, for example to hop onto another server. Classically, that's dangerous. With Secretive, every use pops up on his Mac and wants a fingerprint. So an agent can't sneak onto the production server. The most it can do is ask. And then Levin sees what it's up to.

**HOST:** Agent forwarding on a leash.

**EXPERT:** That's what he calls it. And he's honest that he sometimes loosens the leash. If an agent needs a server for a longer stretch, he keeps a shared SSH connection open. But deliberately, and only for a while.

**HOST:** So if I sum it up: the agent channel works without Levin for as long as the drone runs, but only for granted repos. The human channel can do everything Levin can do, but only with his finger on the sensor.

**EXPERT:** Exactly. Without him, one keeps running and the other stops. That difference is the core of the whole setup.

## The drone is the sandbox

**HOST:** Okay, confession time. The docs say the agents run with dangerously skip permissions. It says "dangerously" right there in the name!

**EXPERT:** Normally Claude Code asks permission before every command and every file edit. In the drone, Levin turns that off. Which sounds scarier than it is, because the drone is the sandbox.

**HOST:** Unpack that for me.

**EXPERT:** It's disposable and can be rebuilt from the devcontainer json at any time. The code is in git, and everything important goes through pull requests. Its token only reaches the granted repos. And anything that needs his identity needs his finger. The worst an agent can realistically do is break a branch in a repo it was allowed to touch.

**HOST:** I still wouldn't do that on my own laptop.

**EXPERT:** Neither would he. On your laptop, yes, dangerous. In a drone, barely. And there's a line in the docs I love: an agent that constantly asks for permission isn't an agent, it's a very slow coworker.

**HOST:** Ouch. But fair.

**EXPERT:** The safety comes from the environment, not from the prompts.

## The network: reachability, not security

**HOST:** How does he even reach all those drones? Ten containers, ten dev servers, that sounds like memorizing port numbers like phone numbers in the nineties.

**EXPERT:** Nope. All his devices and all drones sit in one private network, a tailnet built on WireGuard. Tailscale as the client, coordinated by a self-hosted Headscale. The free Tailscale plan works just as well, though.

**HOST:** And each drone shows up as its own machine?

**EXPERT:** Yes, with its own name, like hatchery-levino-shipyard. They all listen on the same ports and only differ by name. Want to see a drone's dev server in the browser? Use its name and the port, from the laptop or the phone. No port juggling, nothing opened to the internet.

**HOST:** So the tailnet is the security layer.

**EXPERT:** No! And that's the point he stresses most: the tailnet is about reachability, not security. Being on the tailnet doesn't get you into a drone. You still need his key to log in, which means you still need his finger. Password login is off.

**HOST:** Why so suspicious of your own network?

**EXPERT:** Because things happen. A network gets misconfigured, a device gets lost. If your security hangs on a single layer, that's one layer too few. And there's even a deliberate back door: the server is also reachable over plain SSH from the internet.

**HOST:** On purpose?

**EXPERT:** As an emergency exit. When the tailnet gets stuck, and it occasionally does, he can still get in and fix it. His line on that: a network you can only repair through itself is a trap.

**HOST:** Someone should print that on every router.

## Workplace and phone

**HOST:** What does a normal day look like? Is he sitting in front of ten terminals?

**EXPERT:** Pretty much. He SSHes into a drone and starts zellij, a terminal multiplexer, like tmux with friendlier defaults. Several panes each run a Claude Code agent, which spin up sub-agents of their own. The session survives dropped connections. Train goes into a tunnel, who cares. And he switches between drones the way you'd switch between coworkers: who's done, who has a question, who needs a decision?

**HOST:** And from the phone? Surely he's not typing into an SSH terminal on a tiny screen.

**EXPERT:** He's not. A phone terminal is painful, and the key lives on the Mac anyway. Instead he uses Claude Code's Remote Control. He switches it on in a running session and then continues that session from the Claude app on his phone.

**HOST:** Which is exactly what you do on the go anyway: read, decide, say something short.

**EXPERT:** An agent wants to be read and steered, not operated. The catch: if the agent needs his SSH key, he has to get to the Mac, because Touch ID doesn't work from the phone. In practice that rarely matters, because the real work goes through the agent channel and doesn't need him at all.

**HOST:** And the circle closes.

## Native apps and the deploy boundary

**HOST:** Two footnotes. Mobile apps? Emulators in containers sounds like pain.

**EXPERT:** Android works surprisingly well. Hatchery can pass hardware virtualization into a drone on request, and then the emulator runs right there and the agent tests the app like any other process. iOS needs macOS, Apple's rules, so there's a hand-built macOS VM on a Mac Studio that agents reach via SSH. Strictly a footnote.

**HOST:** And where does the setup end?

**EXPERT:** Where the code reaches GitHub. Agents push branches and open pull requests, then CI takes over, and after the merge Argo CD rolls things out to a k3s cluster. An agent needs no access to the cluster at all. Just its repository.

**HOST:** Which is why the token model is enough.

**EXPERT:** Right. If someone really has to get onto a production server, that takes Levin's key, and therefore his finger. The deploy stack itself, with k3s, Argo CD, ZITADEL and a template called agentops-community-stack, is going to be its own part two.

## Wrap-up

**HOST:** So what do I take away if my name isn't Levin and I don't want to run Hatchery?

**EXPERT:** The ideas work without it. A GitHub App for agent tokens that only work for granted repos. A hardware-bound SSH key for the human. And environments you can throw away. Hatchery is built for exactly his case: one human, one server, GitHub.

**HOST:** And what does all this cost?

**EXPERT:** The server is a two-digit euro amount per month. Tailscale is free for personal use, Headscale and Hatchery are open source. The biggest line item is the subscription for the agents themselves.

**HOST:** My takeaway: give the agent all the freedom in its drone, but not your passport. And don't buy an expensive laptop.

**EXPERT:** And when your Mac asks for your fingerprint again: that's not a bug, that's the architecture.

**HOST:** You'll find all of it at levinkeller dot de, slash docs, slash dev-setup. And if you'd rather talk it through with your own AI, there's a compact version as an llms dot txt file. Throw the link at your language model and grill it.

**EXPERT:** Hatchery, the dotfiles, the devcontainer template and the website itself are all open source on GitHub.

**HOST:** Thanks for listening, and happy spawning!

**EXPERT:** Bye!
