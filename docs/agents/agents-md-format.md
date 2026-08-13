[🔙](../../README.md#agents)

# `AGENTS.md` format ⚙️

How to edit `AGENTS.md` — the only file an agent reads **in full on every request**.

**What belongs in it at all** is decided by [where-content-lives.md](where-content-lives.md). Read that first; this doc covers editing the file once the fact belongs there. For the notation of the Superpowers path files, see [sp-workflow-format.md](sp-workflow-format.md).

&nbsp;

## The one test

> A line earns its place in `AGENTS.md` only if **every** request needs it.

Everything else goes behind a pointer. Before adding anything, ask what a request that never touches this subject pays for the line — because that is what most requests are.

This is a rule about **what qualifies**, not about length. A line budget would only relocate growth into whatever file received the overflow, so there is no line limit here — there is a bar.

**Pointers are not free.** The wording of an always-loaded pointer is paid every turn too, so it earns harder pruning than the body: name the destination and the condition for reading it, and stop. "See `X` for details" is a no-op — it gives an agent nothing to decide with. "Read `X` when you meet a term you cannot define from the request alone" is a trigger.

&nbsp;

## What the file is

`AGENTS.md` is a **router**, not a manual. It holds:

- workspace facts every request needs (stack, package manager, off-limits directories, MCP priority);
- the conventions and pointers that decide where to look next;
- the **path selector**: how to tell A from B from C, and the instruction to read that path's file in full before acting.

It does **not** hold the paths themselves, the rules they share, their notation, or the reasoning behind them. Those are `docs/agents/sp-workflow-*.md`, each loaded only when it is actually needed — including [sp-workflow-shared.md](sp-workflow-shared.md), which holds the Operating rules, the Workspace preferences declared to Superpowers, and the Git contract.

&nbsp;

## Adding a rule to the Superpowers workflow

1. **Does every path need it?** → `AGENTS.md`, in the cross-path section it belongs to.
2. **Does one path need it?** → that path's `sp-workflow-path-{a,b,c}.md`.
3. **Is it the reason behind a rule rather than the rule?** → [sp-workflow-rationale.md](sp-workflow-rationale.md).
4. **Is it how to perform a step?** → the skill that owns the step. `AGENTS.md` says *when* and *which*; the skill says *how*.

A rule that lands in two of these is a rule that will drift. Pick one and point from the others.

&nbsp;

## Editing conventions

- **`&nbsp;` between top-level sections** — the spacer this file uses so sections stay visually separated in rendered Markdown.
- **`#` for top-level sections, `##` for the workflow's own subsections.** Inside a path file, only a 🪝 hook takes a `####` heading — see [sp-workflow-format.md](sp-workflow-format.md).
- **Absolute repo paths** (`/docs/…`, `/CONTEXT.md`) when pointing out of the file, so the reference resolves the same whichever directory an agent is working from.
- **State the trigger, not the topic**, in every pointer. See the pointer rule above.
- **Never use the path files' notation here.** No 🚧 gate, 📌 constraint, `[gated]` / `[close-out]`, set names, or hook IDs. `AGENTS.md` is read *before* [sp-workflow-format.md](sp-workflow-format.md), so every one of those is a forward reference to vocabulary the reader does not have yet. Say the thing plainly instead; if a path file names the same rule under a landmark, that is the path file's job. Checkable in one grep before you commit.

&nbsp;

## Before calling an edit done

`AGENTS.md` is one of the places a rule commonly has a second copy — a rule moved out of here often leaves one behind, and a rule moved *in* often duplicates one already in a path file or a skill. Run the sweep in [where-content-lives.md](where-content-lives.md) → _When a rule already exists in more than one place_ before calling the edit done.

[🔙](../../README.md#agents)
