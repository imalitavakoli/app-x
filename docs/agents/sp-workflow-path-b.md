[🔙](../../README.md#agents)

# 🛣️ Path B — Fix a bug, a test failure, or anything else technically broken

> **Read [sp-workflow-shared.md](sp-workflow-shared.md) first — required, not optional.** It owns the rules this path assumes and cites by name: the **Operating rules**, the **Workspace preferences** declared to Superpowers, the **Git contract**, and **Required reads and when they are due** — the one table naming which docs are due at which moment, [sp-workflow-prefs.md](sp-workflow-prefs.md) among them, due before the first question put to the user. The notation used below is defined in [sp-workflow-format.md](sp-workflow-format.md). Procedures this path shares with another live in [sp-workflow-procedures.md](sp-workflow-procedures.md) — read one only when a hook below cites it, never up front.

&nbsp;

**Typical flow** — each hook's own condition is what actually governs: `systematic-debugging` → `test-driven-development` → `verification-before-completion` → **verify docs vs. the proven fix** _(B1 — always; actions conditional)_ → `finishing-a-development-branch` _(only if the fix is on its own branch)_

No execution mode here — that question belongs to path A only. For git, see _Git contract_.

**Docs-in-scope set** — **Members:** **B1's `[gated]` band**. **Combine:** each gate below is answered on its own terms, and **any gate answering No skips that band** for this fix. **Regardless:** `systematic-debugging`, `test-driven-development`, `verification-before-completion`, and **B1's Always band** (verifying `util` / `app` / grab-bag `requirements/`).

> 🚧 **Functionality gate** [auto] — **Asks:** is the fix to a **single-purpose** lib from `map` / `data-access` / `ui` / `feature` / `page`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** (`util` / `api` / `app`, or a **grab-bag** `ui` / `feature`) → **skip that band**: those never have `docs/x/` docs to verify. B1’s Always band still verifies their local `requirements/` registry.
>
> Grab-bag `ui` / `feature` libs are defined in `/docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag. Unit tests for all of these libs still follow TDD and `x-ng-test-unit-helper` when tests are in scope — retag their IDs as part of normal test edits, not via B1's PRD/TSD writers.

> 🚧 **Missing-docs gate** [auto] — **Asks:** does that lib's functionality already have `docs/x/{domain}/{name}/`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** → **skip that band**: with no `docs/x/{domain}/{name}/`, that functionality has no ID namespace at all — no PRD ACs, no TSD FR/BRs — so there is nothing to verify, amend, retire or re-tag.
>
> `[auto]`, not `[ask]`: a bug fix is not the place for a first-time PRD/TSD interview. If the user wants that functionality documented, that is a design-work cycle of its own.

**When no lib is under test at all.** `systematic-debugging` covers more than feature defects — build failures, performance problems, integration issues. A broken CI pipeline, a slow tooling script or a misconfigured executor has no lib under test, so **both gates answer No**, the whole docs-in-scope set is skipped, and this path is exactly `systematic-debugging` → `test-driven-development` → `verification-before-completion`, with B1's Always band finding nothing to verify. That is the correct outcome, not a gap — do not go hunting for docs to update.

📌 **Companion work — `util`/`api`/`app`, or another functionality's libs** — **Spans:** both gates (answered per functionality) · B1's `[gated]` band (once per functionality). **Leaves alone:** the fix and its tests, and the order of any of it — Path B has no plan, so nothing here orders work.

When the fix touches a `util`, `api`, or `app` lib, or libs belonging to more than one functionality:

1. **Gates answer per functionality.** A `util` / `api` / `app` part, or a **grab-bag** `ui` / `feature` part, always answers **No** — none of them has `docs/x/` to update. Each functionality's part is answered on its own lib types and its own `docs/x/{domain}/{name}/`.
2. **B1's `[gated]` band runs per functionality** whose gates both answer **Yes** — each against its own `docs/x/{domain}/{name}/`. It runs whether or not that part of the fix minted an ID: verifying is the point, and an amended or retired requirement mints nothing.
3. **One level deep — deeper companions are surfaced, never absorbed.** Rules 1–2 cover the libs **this fix touches**. If fixing one of them turns out to require work in a **further** lib, that is not this fix's scope: report it to the user (📌 _Change-set paths_) and let them decide. Do not widen the fix, and do not run B1 for a functionality this fix never touched.

📌 **Change-set paths** — **Spans:** `systematic-debugging` · 📌 Companion work (deeper-lib report) · B1. **Leaves alone:** whether to stop, which hypothesis to implement, TDD, B1's verification actions, and the order of any of it.

1. **One fix, no extra stop.** Before the first edit that implements a fix, list the **repo-relative paths** of the files that fix will change, then continue. Do not add a stop of our own — the defect-investigation skill owns whether to stop.
2. **Options already on the table.** Whenever this path **already** stops with more than one valid root-cause-level option — whatever caused that stop — list those paths **per option**. Among those options, recommend the one whose paths sit inside the **lib name**, **functionality name**, or `data-cy` prefix (`CONTEXT.md` → Lib name / Functionality name / `data-cy`) the user already gave. If the only honest option is elsewhere, say so and still show those paths. Do not invent options so there is something to compare, and do not recommend a symptom-layer edit just to match the user's mention.

#### 🪝 B1 · After `verification-before-completion` [close-out]

Always runs on Path B once the fix is proven. **This hook verifies; only its actions are conditional.** Path B has no plan and no A1, so this is the _only_ point at which the docs meet what shipped — and a bug fix very often means the documented behaviour was the thing that was wrong.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Verify the PRD & TSD against the proven fix**, once per functionality (📌 _Companion work_), following [sp-workflow-procedures.md](sp-workflow-procedures.md) → _Verifying a functionality's docs against what shipped_. That procedure carries the scoped read, the two carve-outs, the four outcomes, the never-silent amend/retire and the `Last Verified` stamps — all of it part of this step, none of it optional.

   **The changed set here is the files the fix touched**, which 📌 _Change-set paths_ already reported (`systematic-debugging` established them): this path has no plan, and often no branch and no commits (_Git contract_). A one-line fix is where the scoping earns the most — without it, proving one behaviour would re-read every AC and every ID the functionality has. And a debugging cycle reaches this hook deep with no plan to fall back on, so relay the amend/retire confirmation rather than settling it.

**Always:**

2. **Verify the local `requirements/` registry** of any `util`, product `app`, or grab-bag `ui`/`feature` lib the fix touched — the same shared procedure's closing rule, report-don't-block carve-out included. Changed set as above.

3. **Hand the fix's changed set to the log editors.** The changed set is the files the fix touched, which 📌 _Change-set paths_ already reported. Runs before the review below, because these editors **write code** and the review must judge the tree as it will stand.

   Resolve `pref.log-diag` and `pref.log-analytics` per [sp-workflow-prefs.md](sp-workflow-prefs.md) — both in one ask when both are unset. Match/write: [agents-md-format-local.md](agents-md-format-local.md). Unset → ask once here (`on` recommended; weigh the analytics one more carefully — its records cannot be retracted).
   - **`on`** — **dispatch a subagent** per key that resolved `on`, pointed at `.agents/skills/x-log-diag-editor/SKILL.md` **in `standing` mode** (the committed, sparse kind — never `investigation`) and at `.agents/skills/x-log-analytics-editor/SKILL.md`. Each carries its own methodology and mechanism references, which this session never emits (_Operating rule 5_). Take back the files touched and anything it refused.
   - **`off`** — do not dispatch. Say in one line that the pass was skipped because `pref.log-diag: off` / `pref.log-analytics: off` (or this-cycle override). Not a Pass.

   **Hand over the whole changed set; do not pre-filter by lib type.** Each skill already refuses what its own rules exclude. Filtering here would copy tables those skills own and can change without us.

   Direct invoke of either skill, or the user asking for logs in a named file, still runs it — these keys govern only the unasked-for pass over a whole changed set.

   **`standing` is the only mode this step ever dispatches**, so this step never leaves investigation records behind and owes no removal pass. Ad-hoc instrumentation added while diagnosing is a different thing, and the review below is what judges whatever of it reached the tree.

4. **Review the fix's changes, last.** Runs after steps 2–3, so it judges the tree as it will stand.

   Resolve `pref.diff-review` per [sp-workflow-prefs.md](sp-workflow-prefs.md). Match/write: [agents-md-format-local.md](agents-md-format-local.md). Unset → ask once here (`on` recommended).
   - **`on`** — **Dispatch a subagent** pointed at `.agents/skills/x-code-diff-reviewer/SKILL.md`, and take back only the human-report verdict line (status marker included), the counts, and the report path — the skill's reference loading is heavy and this hook runs deep (_Operating rule 5_). **If this agent cannot dispatch subagents, load the skill here instead** and say that you did.
   - **`off`** — do not dispatch. Say in one line that the review was skipped because `pref.diff-review: off` (or this-cycle override). Not a Pass.

   Direct invoke of that skill, or the user asking for a review, still runs it.

   When it ran: it reports and never edits. This path often has no branch and no commits (_Git contract_), so the review covers whatever the fix actually touched, committed or not — the skill resolves that itself. A report asking for changes **ends this cycle**; the user opens a new one to make them.

Docs come **after** the fix is proven, never before, so nothing documents behaviour that verification might still reject. The cycle is not done until this hook has run — make the final completion report after it, not before.

⚪ **Hooks with no workspace step yet** — `systematic-debugging` · `test-driven-development` · `finishing-a-development-branch` (only if the user put the fix on its own branch and asks to wrap it up)

[🔙](../../README.md#agents)
