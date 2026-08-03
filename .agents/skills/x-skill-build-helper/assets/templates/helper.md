# Template — helper skill

A **helper produces nothing.** It loads a rule, a set of guidelines, or examples into the agent's context so that whoever does the actual work follows them. The building, writing or testing is done by someone else.

Examples: `x-ng-test-unit-helper`, `x-ng-lib-build-helper`, `x-ng-test-e2e-helper`.

Smallest useful form is a single rule:

```markdown
---
name: x-{tech}-{domain}-helper
description: 'WHAT? <the rule or guidelines it supplies>. WHEN? <the situations + keywords>'
metadata:
  version: '1.0.0'
---

# {Domain} Helper

## Overview

This skill is a **helper**: it puts <the conventions> into your context. It **produces
nothing** — whoever is doing the work follows these conventions.
<If it only adds workspace specifics on top of a general practice, say so and say which.>

## Rule

<The convention, stated once, with one concrete example.>

## When to use

<Triggers. Then what it does NOT cover.>
```

Grow it only as the subject demands:

```markdown
## Pick the matching example (example-backed helpers)

| Case   | Example                     |
| ------ | --------------------------- |
| <case> | `assets/examples/<name>.md` |

## Fallback — only when the examples don't cover it

<Ask the user what to imitate, then read that. Examples first; a real workspace
file only when the example doesn't cover it, and only the one the user names.>

## Confirm the current tooling before writing

<Name the tool as "X today (re-check; it can change)" and tell the reader to read the
actual config rather than trusting this file. Keeps the skill alive across tool changes.>

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **State the "produces nothing" contract in the Overview.** Without it, agents treat a helper as a builder and start writing code from it.
- Prefer **one excellent example** over many mediocre ones. Keep examples in `assets/examples/`.
- Pin conventions to what is observable in the repo, not to a tool version — a helper that hardcodes today's runner rots the moment the runner changes.
