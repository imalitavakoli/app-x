# Template — injector skill

An **injector** edits existing code: it locates a target, injects or transforms something, and leaves the project building. Unlike a writer it creates no document; unlike a helper it does act.

Examples: `x-ng-analytics-injector`, `x-ng-log-injector`.

```markdown
---
name: x-{tech}-{domain}-injector
description: 'WHAT? <what it injects or transforms, one clause>. WHEN? <the situations + keywords>'
metadata:
  version: '1.0.0'
---

# {Domain} Injector

## Overview

<What it injects or edits, and into what kind of target.>

## When to use

<Triggers. Then when NOT to — e.g. generated files, vendored code.>

## Target & scope

<How to locate the target (class / component / service / directive) and which members
to touch. Describe the target conceptually — never a hardcoded path under libs/ or apps/.>

## Prerequisites

The target must exist and be identifiable. If it is ambiguous or you find more than one
candidate, STOP and ask — do not pick one.

## Transform

<Exactly what to inject and where: imports, call sites, naming, ordering.
Prefer a scripts/ AST transform for the mechanical edit over prose instructions.>

## Idempotency

Detect an existing injection before writing. Never duplicate — update in place, or skip
if it is already present and correct. Running the skill twice must leave one result.

## Verify

Build, lint and test the touched project after editing. On failure, fix or revert —
never leave the workspace in a state that does not build.

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **Idempotency and Verify are the two sections that make an injector safe** — they are the reason this kind gets its own template rather than reusing the writer's. Do not drop them.
- If the edit is genuinely mechanical, put it in `scripts/` and let the SKILL.md describe _when_ to run it. Prose instructions for a deterministic edit invite drift between runs.
- An injector that cannot find its target must stop. Injecting into the wrong file is worse than doing nothing.
