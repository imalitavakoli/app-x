[🔙](../../README.md#agents)

# Superpowers workflow — path notation 🧭

The landmark vocabulary the `sp-workflow-path-*.md` files are written in.

**Read it whenever a landmark is unclear** — and always **before editing** a path file, where the `Shape` lines and the authoring rules become the point. Following a path usually needs only the `Meaning` lines, and often not even those: most landmarks state their semantics inline. The exception is a hook's **kind tag** (`[gated]` / `[close-out]`), which decides whether a gate can skip that hook and is not self-evident from the heading.

Rules live in `AGENTS.md`, the path files, and [sp-workflow-shared.md](sp-workflow-shared.md) for what every path assumes; a **procedure** more than one path performs lives in [sp-workflow-procedures.md](sp-workflow-procedures.md) · which surface owns a given fact in [where-content-lives.md](where-content-lives.md). When **editing** a path file, why a decision was made — if it earns an entry: the intro note on [sp-workflow-rationale.md](sp-workflow-rationale.md) (_What earns an entry_) — do not load it to follow a path.

&nbsp;

### How the paths are organised

Each path below is a Superpowers workflow. Hierarchy, used consistently throughout this file:

**Spine:** 🛣️ Path → 🪝 hook → (step bands → steps)  
**On a path (not inside a hook):** set · 🚪 entry · 🚧 gate · 📌 constraint · ⚪ hooks with no step yet  
**Under a hook (not step bands):** 🎛️ mode block · ▶️ resume block

Landmark catalog — one entry per type (**Meaning** → **Shape** → **Example**). Definitions stay path-agnostic; **Example** may cite a concrete path. Add, remove, or edit landmarks by changing only the matching entry (and the spine lines above if placement changes). Future editors (human or agent): put a new landmark under the correct hierarchy group (**Spine** / **On a path (not inside a hook)** / **Under a hook (not step bands)** / **Outside the spine**), in semantic order within that group (follow the spine lines), and give it a reserved icon only if it is a true landmark — never reuse an existing reserved icon.

**Spine — 🛣️ Path → 🪝 hook → (step bands → steps)**

- **🛣️ path** — a Superpowers workflow (A / B / C) with our hooks attached.
  - **Meaning:** Top-level workflow container. Holds path-level landmarks and `####` hooks.
  - **Shape:** `### 🛣️ Path {letter} — {title}`
  - **Example:** `### 🛣️ Path A — Build a feature, or change an existing feature's behavior`

- **🪝 hook** — a point in the Superpowers lifecycle where we attach work. **One hook per Superpowers before/after attach-point** (e.g. one _Before `writing-plans`_, not two). Kind tags (`[gated]` / `[close-out]`) are kinds of hook — not separate landmarks.
  - **Meaning:** `[gated]` — a 🚧 gate's answer may skip the whole hook. `[close-out]` — the hook runs whenever the path reaches that lifecycle point; gates must **not** skip it (it may still contain a skippable `[gated]` step band). Omit the kind when the path has no gates and no close-out. Optional but recommended on a `[gated]` hook when a 🚧 gate on that path can skip it.
  - **Shape:** `#### 🪝 {ID} · {when}` — optionally `[gated]` or `[close-out]`, then optionally `— {condition}` — then step bands / steps. A second paragraph is fine for a caveat that applies to the whole hook; past that, the detail belongs in the named skill or the rationale doc. Close with any `> Override:` / `> Note:` block. Only a hook gets a `####` heading and an `{ID}`.
  - **Example:** `#### 🪝 A1 · Before writing-plans [close-out]`
  - **Granularity is skill-level, deliberately.** A hook attaches **before or after a whole Superpowers skill** — never before or after a _step inside_ one. A skill-level anchor dangles only if the skill is renamed or stops being invoked, which is observable (`ls` the plugin cache; the available-skills listing). A step-level anchor dangles when a step is reworded, renumbered, merged or dropped — detectable only by matching prose inside someone else's `SKILL.md`, so it fails silently. If a finer anchor is ever genuinely needed, it must meet all three: (1) it anchors on an **observable state transition** ("before the first clarifying question"), never a step title or number; (2) it prefers a **durable artifact** ("when the spec file appears under `.superpowers/specs/`") over prose; (3) it carries a **fallback** for the anchor never being observed. What turns a silent break into a reviewed upgrade is making a version change _noticed_; `x-sp-workflow-helper` owns how that happens — today by comparing the installed version against the one the workflow was reviewed against.

- **step band** — a labeled group of **steps** inside a hook (especially a `[close-out]` hook), so readers see what a gate may skip. No landmark icon.
  - **Meaning:** `**[gated]**` — a gate may skip this band only (not the whole close-out hook). `**Always:**` — runs every time the hook runs; not gate-skippable.
  - **Shape:** inside the hook — `**[gated]** — {when}:` or `**Always:**` — then the numbered steps for that band.
  - **Example:** `**[gated]** — part of the docs-in-scope set …` / `**Always:**` (Path A A1)

- **step** — one piece of work inside a step band (or directly under a simple `[gated]` hook). No landmark icon.
  - **Meaning:** Each step becomes one todo (Operating rule 3).
  - **Shape:** numbered list item under its step band (or directly under the hook when there is no band).
  - **Example:** `1. **Write/refresh the PRD & TSD** — …` (Path A A1 gated band)

**On a path (not inside a hook)**

- **set** — a named group of gated hooks/steps that the path's gates control together. No landmark icon.
  - **Meaning:** Declared **once per path**, above that path's gates. Gates, gated hooks, and `[gated]` step bands refer to it **by name** instead of re-listing its members, so a hook joining or leaving the set is one edit. It states three things: its **members**, how multiple gates **combine**, and the **complement** (what runs regardless). Not a landmark and not payload of one block — any block on the path may reference it. A path with a single gate and a single gated hook may skip it.
  - **Shape:** `**{Name} set** — **Members:** {hooks/steps, separated by ·}. **Combine:** {how the path's gates combine}. **Regardless:** {what runs whatever they answer}.` — bold lead on the path, above its gates. No `####`, no `{ID}`. `·` separates items **within** a part; the parts themselves are separated by their bold labels.
  - **Example:** Path A `**Docs-in-scope set** — … **A1's `[gated]` band** · **A2's enricher step** · …`

- **🚪 entry** — join/handoff contract for the path.
  - **Meaning:** Route here when the user is joining or rejoining this path using **existing path state** — e.g. they provide a plan path (or equivalent pointer), or ask to continue/execute work that already has the Global Constraints lines (or other payload) this Entry declares. **Do not** route here when starting the path from the beginning with no such state — follow the path from its first Superpowers skill. May declare the verbatim **durable marker** it reads — the Global Constraints lines a hook writes into the plan, or a field a committed doc carries — but do **not** promote that payload to its own landmark. May route into a ▶️ resume block. Distinct from ▶️ resume (join/rejoin the path vs continue after a hard stop). Not a hook. **A path may carry more than one Entry**, each keyed on a different marker; name each by its trigger, and make every cross-reference say which one it means (`the plan-path 🚪 Entry`) — an unqualified "🚪 Entry" stops being an address the moment a second one exists.
  - **Shape:** `🚪 **Entry — {when}.**` — optional nested payload (the marker this Entry reads), then numbered rules. No `####`, no `{ID}`.
  - **Example:** Path A `🚪 **Entry — user provides a plan path.**` (with nested Plan phase lines)

- **🚧 gate** — a yes/no question whose answer decides whether the path's gated set runs.
  - **Meaning:** A gate **asks** and **answers**; hooks and bands **run** or are **skipped**. Kind tags: `[auto]` — answered from the work itself (lib type, file presence); `[ask]` — answered by the user. Each gate is answered **on its own terms and never references another gate's answer**; **any gate answering No skips the whole set**. A gate names only **gated** hooks/steps — never a close-out hook. Not a guard and not a hook. Promote only conditions that control the whole set or a whole `[gated]` step band; a single-hook `— {condition}` stays in the hook heading.
  - **Shape:** `> 🚧 **{Name} gate** [auto|ask] — **Asks:** {yes/no question}` then a blockquote list: a `**Yes** →` item, a `**No** →` item, and — for an `[ask]` gate that does not always fire — a `**Not asked when:**` item. Prose detail follows after a blank blockquote line. Blockquote on the path (or under a hook only when it narrows that hook's band). No `####`, no `{ID}`.
  - **Example:** Path A `> 🚧 **Functionality gate** [auto] — **Asks:** …`

- **📌 constraint** — path-level rule that **spans** more than one lifecycle point without skipping any of them.
  - **Meaning:** A constraint **spans** — it adds a rule to steps that already run. Not a gate (never skips a hook or band) and not a single-hook `> Note:`. Use when the rule spans docs / plan / enricher (or similar). Constraints never share a **set** the way gates do, and need none however many are added — each governs different steps in a different way, so `Spans:` is the only index they need.
  - **Shape:** `📌 **{Short name}** — **Spans:** {hooks/steps, separated by ·}. **Leaves alone:** {what it does not change}.` then the rule on the following lines. `·` separates items **within** a part; the parts themselves are separated by their bold labels. Bold lead on the path (not a blockquote — so it does not look like a gate). No `####`, no `{ID}`. Do not put it in a hook's `> Note:`. **`Spans:` names hooks by their `{ID}`** (`A1's [gated] band`, `A2 step 1`, `B1`) — never in prose — so "what governs A2?" is one search of this file, with no index to keep in sync.
  - **Example:** Path A `📌 **Companion work — …** — **Spans:** …`
  - **Past ~4 constraints on one path:** move the `Spans:` lines out of the bodies into a single table above them, so spans still live in exactly one place.

- **⚪ hooks with no step yet** — Superpowers lifecycle points on the path that still have no workspace steps.
  - **Meaning:** Still part of the workflow; listed on one bold line per path (not a `####` subsection). Give a hook its own `#### 🪝` subsection the moment it gains a step. For execution and `test-driven-development`, our rules arrive through the enriched plan (Operating rule 4).
  - **Shape:** `⚪ **Hooks with no workspace step yet** — {skill} · {skill} · …`
  - **Example:** Path A `⚪ **Hooks with no workspace step yet** — using-git-worktrees · …`

**Under a hook (not step bands)**

- **🎛️ mode block** — execution-mode contract for the cycle.
  - **Meaning:** Defines auto/interactive and the Plan lines for Global Constraints. Resolved per `sp-workflow-prefs.md`; this table is the contract. Not a step band and not a `####` heading — do not turn it into todos.
  - **Shape:** under the hook that resolves mode — `🎛️ **Execution mode — …**` then the mode table (behaviour + Plan line verbatim) and any short follow-on prose.
  - **Example:** Path A A1 `🎛️ **Execution mode — auto or interactive.** …`

- **▶️ resume block** — post-hard-stop contract: what to do after the user proceeds.
  - **Meaning:** Not a step band. Any hook that hard-stops and waits may add one — **a path may therefore carry more than one**, and one hook may stop in more than one place. Name each by the stop it follows, and make every cross-reference say which one it means (`A2's ▶️ Resume`); an unqualified "▶️ Resume" stops being an address the moment a second one exists. Distinct from 🚪 entry (continue after a hard stop vs join the path).
  - **Shape:** blockquote under the hook, after the band holding the stop it follows: `> ▶️ **Resume** (after {what the user did}). …`
  - **Example:** Path A A2 `> ▶️ **Resume** (after the user proceeds). …`

**Outside the spine (no landmark icon)**

- **guard** — a Superpowers skill that self-triggers on the agent's own behaviour instead of being routed to.
  - **Meaning:** No fixed position in a path; no landmark icon. Do not invent a 🪝 hook just to host a guard.
  - **Shape:** named in prose where relevant (e.g. on a path's ⚪ line or in a short note). No reserved icon.
  - **Example:** `verification-before-completion` (fires on any "it's done" claim); `receiving-code-review` (fires when you give feedback).

**Cross-cutting**

- **Only a hook gets a `####` heading, and only a hook gets an `{ID}`.** Anything else inside a path uses its landmark shape above, so the outline stays a clean list of hooks.
- **Reserved verbs — keep them distinct.** Gates **ask** and **answer** (Yes / No); hooks and step bands **run** or are **skipped**; constraints **span**; entries **route**; mode blocks **select**. Never write "the gate applies" — it reads both as _the gate is in force_ and as _the gate let us through_. Say which way it answered.
- **Constraints never collide and never gate.** A constraint adds a rule to steps that already run — it can never skip a hook or band (that is a 🚧 gate's job). If a new constraint would contradict an existing one on the same step, **amend the existing constraint** rather than adding a second: one step's rule lives in one constraint. Constraints are **path-scoped**, so the same name may appear on two paths carrying different rules; the no-collision rule applies within a path.
- **Icons are landmarks, and these eight are reserved:** 🛣️ path · 🪝 hook · 🚪 entry · ⚪ hooks with no step yet · 🎛️ mode · ▶️ resume · 🚧 gate · 📌 constraint. Never use those eight for anything else; any other section may take its own distinct icon.
- **A path never cites another path.** A step that leans on another path's step cannot be edited without reading that path, and renaming the step there breaks it silently — so when two paths need the same thing, **extract it rather than cross-reference it**: a **rule** every path assumes goes to [sp-workflow-shared.md](sp-workflow-shared.md), a **procedure** more than one path performs goes to [sp-workflow-procedures.md](sp-workflow-procedures.md), parameterised on whatever genuinely differs (the citing hook supplies that — usually just what counts as its changed set). Needed by one path only? Leave it in that path file. Neither file is a landmark: a hook names it in prose, and the citation is part of the step, not an optional aside.
- **Where new content goes:** `/docs/agents/where-content-lives.md` decides the home of every fact an agent reads — term, rule, rationale, procedure — and is the only place that decision is recorded. Keep each fact in exactly one home.

[🔙](../../README.md#agents)
