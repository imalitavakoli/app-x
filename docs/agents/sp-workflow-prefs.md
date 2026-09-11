[🔙](../../README.md#agents)

# Superpowers workflow — personal preferences 🔧

How the workflow **resolves and persists** `pref.*` keys, and the workflow meaning of each key.

Read this **in full** at **cycle start** — entering or rejoining a path — and **before the first question put to the user**, whoever asks it (`sp-workflow-shared.md` → Required reads and when they are due).

**Not this file.** Key names, allowed values, and match/write rules: [agents-md-format-local.md](agents-md-format-local.md). The value itself: `AGENTS.local.md`. The **contract** of a `one-path` key (what the value does on that path): the consuming path. Workspace preferences declared to Superpowers: `sp-workflow-shared.md` — a different family; do not mix them.

This file does **not** name a path letter, hook ID, or step. Those move. The consuming step points here; this file does not point back.

&nbsp;

## Resolve any key

Parameterised by **key**, that key's **In the plan** field (below), and the consuming step's **fallback** when the key is unset.

First match wins:

1. **In the plan** is not `none`, a plan exists, and a line under that plan's `## Global Constraints` starts with that text → use it (this cycle already chose).
2. Else `AGENTS.local.md` has a valid `pref.{key}` (match rules: the catalog) → use it. Announce in one sentence; do not block.
3. Else the key is **unset — ASK the user, once, now.** A missing `AGENTS.local.md` is the **normal** state of this workspace, not a signal that there is nothing to resolve: being unset is what makes the ask **due**, not what excuses it. A consuming step may name a narrower fallback — deriving the value without asking, as Path A's app-serve does — and where it names none, the fallback **is** the ask.

**Run this ladder once per key, not once per cycle.** A key resolved at rule 1 says nothing about any other key. A key whose **In the plan** is `none` can never match rule 1 at all — no plan line will ever carry it — so for that key the ladder always runs on to rule 2, and with no `AGENTS.local.md`, to rule 3's ask. Today `pref.audience` is that key: a plan carrying `Execution mode:` and `App serve:` resolves those two and leaves `audience` exactly as unresolved as it was. Finish the ladder, before the first question, for every key **due at that moment** — every-path keys, and any one-path key whose consumer is the ask about to fire — and put whatever is still unset of those into **one** ask rather than returning to the user twice. A one-path key whose consumer is later stays unresolved until that consumer.

A user override **this cycle / this conversation** always wins. Do not rewrite `pref.{key}` unless they ask to change the default. If **In the plan** is not `none`, still write that line into the plan.

**Off-path only — this paragraph does not apply once a path has been entered.** For a casual question that has not entered a path: if the key is set, use it; if it is unset, do **not** interview — use that key's **Casual default** (below), or skip the key if it has none. **On a path, unset means ask (rule 3); only off-path does unset mean skip.** Keep the two apart: with no `AGENTS.local.md` every key is unset, so this is the case that arises on nearly every cycle, and reading the off-path answer onto a path silently drops the interview the cycle depends on.

&nbsp;

## Persist and discovery

When the fallback is an ask, the ask includes a one-clause hint: add `pref.{key}: {value}` to `AGENTS.local.md` to skip this next time (or ask me to). After they answer, offer **once** to append that exact line (create the file if needed; do not restructure). If they decline, do not re-pitch the file again this cycle or on later asks; keep only the short hint on later asks.

&nbsp;

## Keys

Every key is a `###` block in this shape. Add, update, or delete a block — do not invent a second layout. Values live in the catalog; do not repeat them here.

**In the plan** — some answers must be copied into **this cycle's Superpowers plan** (the `## Global Constraints` section). A later session, or an implementer who never reads `AGENTS.local.md`, can only see what the plan carries. The field is **how that sentence starts** (so resolve can find it again), or `none` if this pref must not go in the plan (chat-only). The consuming path owns the rest of the sentence.

```markdown
### `pref.{key}`

- **Scope:** every-path | one-path
- **In the plan:** {how the plan sentence starts} | none
- **Casual default:** {value} | none
- **Does:** {one sentence}
```

Optional **Rules** after the list — only what is true of the **key**, never a path or step address.

&nbsp;

### `pref.audience`

- **Scope:** every-path
- **In the plan:** none
- **Casual default:** none
- **Does:** chat register only — same work, different words.

**Rules.** Resolve at **cycle start**, **before the first question put to the user** — whoever asks it. `developer` is today's register (paths, libs, code). `product` is a PM / PRD owner: they know **ACs**, not HTML/JS/TS/SCSS/CSS/Angular or other framework syntax.

`product` changes **only the chat**. Routing, hooks, skills, Superpowers specs, plans, PRD, TSD, and every other file stay exactly as today. Same decisions, same gates — simpler words. Never skip a question because the audience is `product`. Rephrase it in product terms, or say an engineer is needed.

To `product`: speak naturally, not in workflow jargon — and still use the **real names** the listener already knows or needs. Never swap in a softer synonym (`helpers` for **subagents**). Hide path letters, hook IDs, step IDs, framework / code syntax, and FR/BR IDs. ACs are the shared product language. Name **subagents**; skills that are loaded; the Nx project / app / lib you will imitate; and file paths the listener needs in order to decide (the files a fix will change is the standing example). Describe the **work** in product terms. Examples, not a map: say “we're defining what the product should do” not a path letter; “here's the build plan” not a hook ID; “AC-03” not an FR/BR ID; behaviour, not a `.ts` snippet.

**Explicit switch, this conversation only.** “Talk like a developer,” “go back to normal,” “show me the code” — use the `developer` register for the rest of **this session**. The other way too. Do not infer a flip from one technical question. Do not rewrite `pref.audience` unless they ask to save it. Confirm in one line, naming the saved default. A later session or a fresh handoff reads the file again.

&nbsp;

### `pref.mode`

- **Scope:** one-path
- **In the plan:** `Execution mode:`
- **Casual default:** none
- **Does:** selects which execution skill runs and who commits.

**Rules.** The consuming path owns the contract (skill, git, the full sentence after that start).

&nbsp;

### `pref.app-serve`

- **Scope:** one-path
- **In the plan:** `App serve:`
- **Casual default:** none
- **Does:** names the Nx app to serve during execution, or `not-needed`.

**Rules.** The consuming path owns when to derive vs ask, and the serve-check. A stored value is a usual app, not a law.

&nbsp;

### `pref.diff-review`

- **Scope:** one-path
- **In the plan:** none
- **Casual default:** none
- **Does:** whether the outstanding-changes review runs before finishing.

**Rules.** Resolve on the paths that dispatch that review, immediately before the dispatch — not at cycle start. Unset → ask once (`on` recommended). `off` skips the dispatch; say so in one line naming `pref.diff-review: off` (or this-cycle override). Not a Pass. Loading the skill, or the user asking for a review, still runs it. A this-cycle override wins; do not rewrite the stored default unless they ask.

&nbsp;

### `pref.log-diag`

- **Scope:** one-path
- **In the plan:** none
- **Casual default:** none
- **Does:** whether the changed set is handed to the diagnostic-log editor before finishing.

**Rules.** Resolve on the paths that dispatch that editor, immediately before the dispatch — not at cycle start. Unset → ask once (`on` recommended). `off` skips the dispatch; say so in one line naming `pref.log-diag: off` (or this-cycle override). Not a Pass. The user asking for logs in a named file still runs the skill — this key governs only the unasked-for pass over a whole changed set. A this-cycle override wins; do not rewrite the stored default unless they ask.

&nbsp;

### `pref.log-analytics`

- **Scope:** one-path
- **In the plan:** none
- **Casual default:** none
- **Does:** whether the changed set is handed to the analytics-event editor before finishing.

**Rules.** Same resolution and override rules as `pref.log-diag`, and the same carve-out: an explicit request still runs the skill. Recommend `on` with more care than the diag key — events cannot be retracted once sent and native event names are capped per app user, so a record added here is not undone by deleting the call. That asymmetry is the reason these are two keys and not one.

**Mechanism shape is not this key.** Guard style, prefixes, and which context fields ride along are the editors' own committed team state, under `.agents/_team/skills/{skill}/`. This key decides only whether the workflow raises the subject at all; a value belonging to the other family goes in the other file.

&nbsp;

## Adding or removing a key

1. Catalog row first ([agents-md-format-local.md](agents-md-format-local.md)).
2. A `###` block here, in the shape above.
3. Wire the consumer: cycle-start in the shared rules if **Scope** is `every-path`; a step on the path that needs it if `one-path`.

Removing a key is the same three in reverse. Do not leave a block whose catalog row is gone, or a consumer whose block is gone.

&nbsp;

[🔙](../../README.md#agents)
