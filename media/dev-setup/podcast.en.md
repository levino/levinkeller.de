# Podcast "Rent the machine" – Levin Keller's dev setup for AI agents

Two voices, both AI-generated, talk about the setup described at
https://levinkeller.de/en/docs/dev-setup/. The only sources are those pages and
`public/en/docs/dev-setup/llms.txt`. Voiced with `scripts/tts/podcast_vertonen.py`.

Arc: first what it feels like to work this way (compute, voice, Hatchery, network, daily
work, Codespaces), then why it's still safe (two channels), then footnotes and wrap-up.

## Intro

**HOST:** Quick heads-up before we start: both voices in this episode are AI-generated. Which feels appropriate, because today's topic is a setup where AIs write almost all the code. Hi, and welcome!

**EXPERT:** Hi! Yes, this is a bit like two robots doing a factory tour of a robot factory. And no, this isn't a how-to. It's architecture: the building blocks, and why.

**HOST:** We're talking about Levin Keller's dev setup. By his own account, he hardly writes code by hand anymore. Several Claude Code agents work on different repositories at the same time, and he reads, steers and decides.

**EXPERT:** So less programmer, more shift supervisor.

**HOST:** And reading through it, I realized there are really two questions in there. One: what does it feel like to run five or ten agents at once without your computer melting into your desk? And two: how do you let them all off the leash without handing them your GitHub account?

**EXPERT:** And both matter equally. A secure setup that's miserable to work in is one you'll quietly stop using. A comfortable setup that gives agents your identity is one you shouldn't be using. Today we start with the comfortable part.

**HOST:** Great, because I am a deeply comfortable person.

## Rent the machine, don't buy a beefy laptop

**HOST:** So let's start with the question everyone asks eventually: what machine do I buy for this?

**EXPERT:** And Levin's answer is right there in the docs: don't buy a powerful laptop.

**HOST:** Nobody has ever told me that. Everyone always says: get the Pro, max out the RAM, you'll regret it otherwise.

**EXPERT:** They're half right. Agents do need resources, but mostly memory, not compute. Every environment holds a Node process, a language server, a test runner, sometimes a browser for end-to-end tests. Five to ten of those at once is a normal day for him.

**HOST:** And all of that on the laptop…

**EXPERT:** …works for one or two agents. After that, the laptop gets loud, hot and drained. And every trip interrupts the work, because when you close the lid, the agents stop.

**HOST:** And the laptop with sixty-four gigs that you'd need does exist. It just costs several thousand euros, is outdated in a few years, and still only has one battery and one fan.

**EXPERT:** Exactly. So Levin flips it around: he rents the machine. A bare-metal server in a data center, second-hand from Hetzner's server auction. An older Intel quad-core with 62 gigs of RAM.

**HOST:** An older quad-core. For an entire army of agents.

**EXPERT:** Nothing fancy, he says so himself. But it runs around the clock, sits on a fast line, and costs a two-digit euro amount per month. A used dedicated server is simply the cheapest way to have lots of RAM permanently available. And when it's no longer enough, he cancels it and rents a bigger one.

**HOST:** How much RAM do you actually need?

**EXPERT:** Rule of thumb: sixteen gigs to start with. With sixty-four, you stop thinking about it. And more cores help when several agents build at the same time.

**HOST:** Why not just a cloud VM, billed by the hour?

**EXPERT:** Flexible, but for a machine that runs all day anyway, much more expensive than dedicated hardware.

**HOST:** Okay. And the laptop?

**EXPERT:** If the work happens on the server, the laptop is just a terminal with a nice screen. Levin uses a MacBook Neo. Light, long battery life, great display. It doesn't even get warm when ten agents run npm install at the same time, because that's happening somewhere else.

**HOST:** Ten parallel npm installs, and the laptop is just sitting there, sipping a smoothie.

**EXPERT:** And here's the best part: the agents keep working when the lid is closed. He shuts the laptop, gets on a train, opens it again, and they've carried on in the meantime.

**HOST:** That's the bit that sells me. My laptop clocks out when I close it. His has staff who keep working. But if the rented server dies, isn't everything gone?

**EXPERT:** Nope. Dev environments don't need high availability. The code is on GitHub anyway, and the environments can be rebuilt on any other machine from their devcontainer dot json files. The server is replaceable. Try saying that about your expensive laptop after a coffee spill.

## Talking instead of typing

**HOST:** So what does he do all day on this light little laptop? Type?

**EXPERT:** Barely. He talks. With an open-source speech-to-text tool called Whispering, he spends two minutes explaining to an agent what he wants.

**HOST:** Two minutes of monologue. To a program.

**EXPERT:** Sounds odd, but it's faster than typing and usually more precise, because you give more context when you speak. You don't just say "fix the bug". You say what you saw and what absolutely must not break.

**HOST:** So basically the briefing you'd give a coworker if you weren't too lazy to type it.

## The Hatchery: spawn and go

**HOST:** Okay: one server, one light laptop, one microphone. How do the agents get onto the server?

**EXPERT:** Through a small open-source tool Levin wrote for exactly this: Hatchery. It manages dev containers on the server, one per repository. And in Hatchery-speak, those containers are called drones.

**HOST:** Hatchery. Drones. Wait. Is this StarCraft? Is this Zerg?

**EXPERT:** It is. The whole tool is named Zerg-style, and the docs say that's simply because it's fun. Drones get spawned, you burrow them to stop them, unburrow them to start them again, and when you're done with one: slay.

**HOST:** Honestly, every infrastructure tool should work like this. Not "stop container". Burrow.

**EXPERT:** And using it is one command: hatchery spawn levino slash shipyard. Hatchery clones the repo onto the host and starts a container with the official dev container CLI, using the devcontainer dot json that lives in the repository itself. Done, there's your environment.

**HOST:** So there's no special Hatchery config format I have to learn first?

**EXPERT:** None, and I think that's one of the nicest decisions in the whole thing. The repo needs nothing Hatchery-specific. The same file works unchanged in GitHub Codespaces or locally in VS Code. Hatchery is replaceable, the repos stay portable. Hatchery just sneaks in a few extras: an SSH server, Tailscale, the GitHub CLI, Claude Code, zellij and the credential helpers. And optionally his dotfiles: shell config, git settings and skills with his coding conventions. So you feel at home in every drone straight away.

**HOST:** How many of these run at once?

**EXPERT:** One per repository, as many as the RAM allows. Five to ten is normal. Each with its own toolchain, its own dev server and its own tests, and none of them stepping on each other's toes.

**HOST:** And if I throw a drone away, is everything gone?

**EXPERT:** No, and that's the second big comfort win. Whatever has to survive lives on the host and gets mounted in. The code, as a git worktree. And the Claude Code state: login, settings, memory, history. You can rebuild a drone from scratch any time, and the agent still knows what it was working on.

**HOST:** That's a little spooky. The drone dies, but its memories live on.

**EXPERT:** Very Zerg. He only has to log in to Claude once per new drone.

## Every drone is its own machine

**HOST:** Now I've got ten containers with ten dev servers. That sounds like memorizing port numbers like phone numbers in the nineties. Three thousand one is project A, three thousand two is…

**EXPERT:** Nope. All his devices and all drones sit in one private network, a tailnet built on WireGuard. He runs his own Headscale to coordinate it, but the free Tailscale plan works just as well to get started.

**HOST:** And each drone shows up as its own machine?

**EXPERT:** Yes, with its own name, like hatchery-levino-shipyard. They all listen on the same ports and only differ by name. Want to see a drone's dev server in the browser? Use its name and the port, from the laptop or the phone. No port juggling, no port forwarding, nothing opened to the internet.

**HOST:** So the tailnet doubles as the security layer.

**EXPERT:** No, and that's the point he stresses most: the tailnet is about reachability, not security. Being on it doesn't get you into a drone, you still need his key to log in. And there's even a deliberate emergency exit: the server is also reachable over plain SSH from the internet, for when the tailnet gets stuck. Which it occasionally does.

**HOST:** On purpose?

**EXPERT:** His line on that: a network you can only repair through itself is a trap.

**HOST:** Someone should print that on every router.

## A day at the office

**HOST:** What does a normal day look like? Is he sitting in front of ten terminals?

**EXPERT:** Pretty much. He SSHes into a drone and starts zellij, a terminal multiplexer, like tmux with friendlier defaults. Several panes each run a Claude Code agent, often with sub-agents of their own.

**HOST:** And when the Wi-Fi wobbles?

**EXPERT:** Doesn't matter. The session lives on in the drone when the connection drops. Close the laptop, train goes into a tunnel, who cares. Next time he connects, everything's still there, and the agents kept working in the meantime.

**HOST:** And across projects?

**EXPERT:** He usually has several drones open, one per project, and he switches between them the way you'd switch between coworkers: who's done, who has a question, who needs a decision?

**HOST:** An open-plan office where all your colleagues live in containers.

**EXPERT:** And nobody steals your yogurt from the fridge. Plus: normally Claude Code asks permission before every command. In the drone, Levin turns that off, with dangerously skip permissions.

**HOST:** Hold on. It says "dangerously" right there in the name!

**EXPERT:** It does. We'll get to why that's fine in the security part. Short version: the drone is the sandbox. And there's a line in the docs I love: an agent that constantly asks for permission isn't an agent, it's a very slow coworker.

**HOST:** Ouch. But fair. And on the go, from the phone? Surely he's not typing into an SSH terminal on a tiny screen.

**EXPERT:** He's not. A phone terminal is painful. Instead he uses Claude Code's Remote Control: he switches it on in a running session and then continues that session from the Claude app on his phone. And voice input fits right in again.

**HOST:** Which is exactly what you do on the go anyway: read, decide, say something short.

**EXPERT:** An agent wants to be read and steered, not operated.

## Why not just Codespaces?

**HOST:** Okay, I have to ask the obvious one. This all sounds a bit like a homemade GitHub Codespaces. Why not just use that?

**EXPERT:** He tried, and what killed it was the way of working, not the price. You can't just SSH into a codespace like any other machine, only through a tunnel. So Claude Code ended up running in the VS Code terminal.

**HOST:** And how was that?

**EXPERT:** Sluggish. Rendering glitches, lag, and the connection kept dropping and taking the session with it. On top of that, Codespaces stops an environment once it's been idle for a while, thirty minutes by default.

**HOST:** Which makes sense for a human. But an agent grinding away for three hours in the background looks a lot like idle from the outside.

**EXPERT:** Exactly, it doesn't fit. And ten environments running all day, billed by the hour and by the core, get expensive on top. A drone, on the other hand, is just a normal machine on the tailnet: ssh in, start zellij, the session survives every dropped connection. Nothing ever gets stopped.

**HOST:** And DevPod, Coder, all the others?

**EXPERT:** He looked at those too. But one thing counted against all of them: none of them has a good answer to how an agent inside the environment gets to GitHub without getting its human's full identity. Which brings us to the other half.

## The other half: two channels

**HOST:** So: ten agents working without asking permission. What are they allowed to do outside their drone?

**EXPERT:** There are two separate channels. The agent works through one. The human works through the other.

**HOST:** Let's start with the agent. The obvious move would be to just run gh auth login inside the drone and call it a day.

**EXPERT:** And now the agent is you. It can write to every repo you have, in every org, delete releases, change settings. One poisoned README, and the damage isn't limited to that one repo anymore.

**HOST:** Okay, I don't want that. What does he do instead?

**EXPERT:** He created his own GitHub App. It can issue tokens that are scoped to individual repositories and belong to the app, not his user account. Only a small service on the host knows the app's key, and it mounts a Unix socket into each drone. Ask that socket and you get a fresh token, but only for the repos that drone has been granted. Ask for any other repo and you get a 403.

**HOST:** A very polite no.

**EXPERT:** And here's my favorite sentence in the entire docs: the identity is the mount itself. No passwords, no tokens on the drone's disk. Which drone is asking follows from which socket it is. And you can't fake that, because the host creates the socket, not the container.

**HOST:** Like a pneumatic tube system: whoever is attached to the tube is automatically the sender.

**EXPERT:** Nice. And for the agent it just feels like a normal logged-in machine. Git and gh fetch the token in the background, and git push just works. That's usability again, by the way: the agent doesn't even notice all the security.

**HOST:** Wait, don't those tokens expire after an hour? So the agent finds the door locked after lunch?

**EXPERT:** No, it fetches a new one every time. As long as the drone runs, it has continuous access. The boundary isn't the clock, it's the grant list and that one socket. The hour only matters if a token ever leaks: then it's useless within an hour at most, and it only ever worked for those repos.

**HOST:** What if the agent needs a second repo?

**EXPERT:** hatchery repo connect, effective immediately. Taking it back is just as quick: repo disconnect, or remove the drone. And the list lives outside the drone, so a drone can't widen its own permissions.

**HOST:** And the second channel, the human one?

**EXPERT:** That's SSH. Levin's key lives in the Secure Enclave of his Mac, managed by an app called Secretive. It can't be exported, copied or read out. And every single signature needs Touch ID.

**HOST:** Every single one? Okay, that's not comfortable anymore.

**EXPERT:** His own words: occasionally annoying, and exactly as intended. And it's what makes agent forwarding safe. He often connects with ssh dash A, so the drone can use his key, for example to hop onto another server. But every use pops up on his Mac and wants a fingerprint. So an agent can't sneak onto the production server. The most it can do is ask.

**HOST:** Agent forwarding on a leash.

**EXPERT:** That's what he calls it. Sometimes he deliberately loosens it for a while, when an agent needs a server for a longer stretch. And that's also the catch with the phone: if the agent needs his key, he has to get to the Mac. In practice that rarely matters, because the real work goes through the agent channel.

**HOST:** Then let me cash in the promise from earlier. Why is dangerously skip permissions fine in a drone?

**EXPERT:** Because the drone is disposable and can be rebuilt at any time. Everything important goes through pull requests. Its token only reaches the granted repos. And anything that needs his identity needs his finger. The worst an agent can realistically do is break a branch in a repo it was allowed to touch. On your own laptop, that flag would be dangerous. In a drone, barely. The safety comes from the environment, not from the prompts.

**HOST:** So if I sum it up: the agent channel works without Levin for as long as the drone runs, but only for granted repos. The human channel can do everything Levin can do, but only with his finger on the sensor.

**EXPERT:** Exactly. Without him, one keeps running and the other stops.

## Footnotes: apps and deploys

**HOST:** Two footnotes. Mobile apps? Emulators in containers sounds like pain.

**EXPERT:** Android works surprisingly well. Hatchery can pass hardware virtualization into a drone on request, and then the emulator runs right there and the agent tests the app like any other process. For iOS there's a hand-built macOS VM on a Mac Studio.

**HOST:** And where does the setup end?

**EXPERT:** Where the code reaches GitHub. Agents push branches and open pull requests, CI takes over, and after the merge Argo CD rolls things out to a k3s cluster. An agent needs no access to the cluster at all, just its repository. The deploy stack, with a template called agentops-community-stack, is going to be its own part two.

## Wrap-up

**HOST:** So what do I take away if my name isn't Levin and I don't want to run Hatchery?

**EXPERT:** One: rent the machine. A used server with lots of RAM for a two-digit amount per month, plus a light laptop with a long battery life. Two: environments built from the devcontainer json that you can throw away. And three: a GitHub App for agent tokens and a hardware-bound SSH key for the human. The biggest line item, by the way, ends up being the subscription for the agents themselves.

**HOST:** My takeaway: don't buy an expensive laptop, rent a server that never closes its lid. And give the agent all the freedom in its drone, but not your passport.

**EXPERT:** And when your Mac asks for your fingerprint again: that's not a bug, that's the architecture.

**HOST:** You'll find all of it at levinkeller dot de, slash docs, slash dev-setup. And if you'd rather talk it through with your own AI, there's a compact version as an llms dot txt file. Throw the link at your language model and grill it.

**EXPERT:** Hatchery, the dotfiles, the devcontainer template and the website itself are all open source on GitHub.

**HOST:** Thanks for listening, and happy spawning!

**EXPERT:** Bye!
