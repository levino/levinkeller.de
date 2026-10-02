---
title: Boundary to the deploy stack
description: 'Where the development setup ends and operations begin – and where the two touch.'
sidebar:
  position: 7
---

# Boundary to the deploy stack

This setup ends where code reaches GitHub. How it gets from there to production is a
system of its own: Kubernetes (k3s), GitOps with Argo CD, identities via ZITADEL,
everything described as code. That will be a separate part of these docs.

The two systems are separate but touch in exactly two places.

## Touch point 1: Git and CI

Agents push branches and open pull requests. From there CI takes over: it builds, tests
and creates preview environments. This website, for instance, gets its own preview at
`pr-<number>.levinkeller.de` for every pull request. After the merge, CI builds an image
and records the new version on a deploy branch that Argo CD rolls out in the cluster.

An agent needs **no access to the cluster** for any of this. It only needs its
repository. That's the main reason the token model from
[Identity and access](/en/docs/dev-setup/identity) is enough.

## Touch point 2: my SSH key

If someone really has to get onto a production server directly, to look at or fix
something, that only works through my key. And therefore through my finger. Agents can
ask me to do it; they can't do it themselves.

## Outlook

Part two will describe the deploy stack: how services come to life, how they get
identities and tokens, and how to set up a new stack from a template (a
[Copier](https://copier.readthedocs.io) template called `agentops-community-stack`).
