[🔙](../../README.md#agents)

# `AGENTS.md` format ⚙️

How to edit `AGENTS.md` — the only file an agent reads **in full on every request**.

**What belongs in it at all** is decided by [where-content-lives.md](where-content-lives.md). Read that first; this doc covers editing the file once the fact belongs there. For the notation of the Superpowers path files, see [sp-workflow-format.md](sp-workflow-format.md).

&nbsp;

## The one test

> A line earns its place in `AGENTS.md` only if **every** request needs it.

Everything else goes behind a pointer. Before adding anything, ask what a request that never touches this subject pays for the line — because that is what most requests are.

This is a rule about **what qualifies**, not about length. A line budget would only relocate growth into whatever file received the overflow, so there is no line limit here — there is a bar.

**Pointers are not free — and here they are paid twice.** The wording of an always-loaded pointer costs on every turn _whether or not it fires_, so in this file it earns harder pruning than anywhere else: name the destination and the condition, and stop. And when it does fire, the real bill is the target — a stray pointer here can pull an entire reference doc into a turn that never needed it.

**How to write the pointer itself** — the condition, the verb, and the rule that every _other_ inbound pointer to the same target must filter too — is in [where-content-lives.md](where-content-lives.md) → _Writing a pointer_. Adding a reference to `AGENTS.md` without reading that is how a doc ends up loaded on turns that had no use for it.

&nbsp;

## What the file is

`AGENTS.md` is a **router**, not a manual. It holds:

- workspace facts every request needs (stack, package manager, off-limits directories, MCP priority);
- the conventions and pointers that decide where to look next;
- the **path selector**: how to tell A from B from C, and the instruction to read that path's file in full before acting.

It does **not** hold the paths themselves, the rules they share, their notation, or the reasoning behind them. Those are `docs/agents/sp-workflow-*.md`, each loaded only when it is actually needed — including [sp-workflow-shared.md](sp-workflow-shared.md), which holds the Operating rules, the Workspace preferences declared to Superpowers, the Git contract, and the pointer at personal preferences.

Standing `pref.*` values for the team live in this file (`## Team preferences`) — the overlay target is the only home a clone or Cloud VM without `AGENTS.local.md` can see. Keep that section to catalog one-liners plus a pointer at [sp-workflow-prefs.md](sp-workflow-prefs.md). Do not explain the overlay or the resolve there.

The gitignored companion is `AGENTS.local.md` — no forced shape, and the `pref.*` catalog: [agents-md-format-local.md](agents-md-format-local.md). How the workflow resolves those keys: [sp-workflow-prefs.md](sp-workflow-prefs.md). Load either when writing or resolving a `pref.*` key, not when editing this file.

&nbsp;

## Adding a rule to the Superpowers workflow

1. **Does every path need it?** → `AGENTS.md`, in the cross-path section it belongs to.
2. **Does one path need it?** → that path's `sp-workflow-path-{a,b,c}.md`.
3. **Is it the reason behind a rule rather than the rule?** → [sp-workflow-rationale.md](sp-workflow-rationale.md) (intro note: _What earns an entry_). Read that file when **editing** the workflow or **questioning** a decision — not when executing a cycle.
4. **Is it how to perform a step?** → the skill that owns the step. `AGENTS.md` says _when_ and _which_; the skill says _how_.

A rule that lands in two of these is a rule that will drift. Pick one and point from the others.

&nbsp;

## Adding a pre-flight check

A check belongs in `AGENTS.md` → Pre-flight only if Superpowers' first skill would act wrongly without it. If it can wait until a path file is loaded, it is a path step, not pre-flight.

Each check is **agent-answered** — never interview the user. Shape:

    N. {plain-English question, or a CONTEXT.md term used as-is}

       **Yes** → read {docs} and/or load {skill} (load means read that skill's `SKILL.md` now)
       **No** → skip this check.

**Unsure → Yes** is list-wide in Pre-flight. Do not repeat it per check unless a Yes is unusually cheap (as check 1 is).

Do not use the path files' notation here. Do not add a second pointer from Pre-flight to this file — `AGENTS.md` already points here under "Before editing this file."

&nbsp;

## Editing conventions

- **`&nbsp;` between top-level sections** — the spacer this file uses so sections stay visually separated in rendered Markdown.
- **`#` for top-level sections, `##` for the workflow's own subsections.** Inside a path file, only a 🪝 hook takes a `####` heading — see [sp-workflow-format.md](sp-workflow-format.md).
- **Absolute repo paths** (`/docs/…`, `/CONTEXT.md`) when pointing out of the file, so the reference resolves the same whichever directory an agent is working from.
- **State the trigger, not the topic**, in every pointer. See the pointer rule above.
- **Never leave the path files' notation unresolvable here.** `AGENTS.md` is read _before_ [sp-workflow-format.md](sp-workflow-format.md), so its notation is vocabulary the reader does not have yet — and a reader who cannot resolve a token does not stop, they invent a meaning. Two cases, and they differ:
  - **A 🚧 gate, 📌 constraint, `[gated]` / `[close-out]` tag, or set name: never.** Their meaning _is_ the catalog entry, so no short gloss makes them resolvable. Say the thing plainly; if a path file names the same rule under a landmark, that is the path file's job.
  - **A hook ID: only if this file defines it.** A bare `A1` in a table is the forward reference — three agents each invented the same wrong meaning for one. The same `A1` beside a legend that says what it is costs one line and keeps a cross-reference table readable at a glance. Define every ID the file uses, outside the table that uses them.

  The `agents-notation` checker rule enforces both, so this is checkable rather than remembered.

&nbsp;

## What a harness enforces is not a reason to trim

A rule in this file may also be enforced by a tool — a permission deny, a hook, a generator's own config. That is a **floor under** the prose, never a replacement for it: it covers the one tool that implements it, and it can be reconfigured without any document noticing. So "the harness already blocks this" does not qualify a rule for removal, and neither does "a hook already says it".

What that argument **does** license is cutting the rule's **rationale** — the paragraph explaining why the rule exists or why humans want the thing it governs. That is not what an agent needs in order to obey, and it has homes: a subsystem page in `docs/`, or [sp-workflow-rationale.md](sp-workflow-rationale.md) for a workflow decision. Keep the mandate whole; move the reasoning and cite it with a skip-condition.

&nbsp;

## Before calling an edit done

`AGENTS.md` is one of the places a rule commonly has a second copy — a rule moved out of here often leaves one behind, and a rule moved _in_ often duplicates one already in a path file or a skill. Run the sweep in [where-content-lives.md](where-content-lives.md) → _When a rule already exists in more than one place_ before calling the edit done.

[🔙](../../README.md#agents)
