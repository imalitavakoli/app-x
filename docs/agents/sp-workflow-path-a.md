[🔙](../../README.md#agents)

# 🛣️ Path A — Build a feature, or change an existing feature's behavior

> **Read [sp-workflow-shared.md](sp-workflow-shared.md) first — required, not optional.** It owns the rules this path assumes and cites by name: the **Operating rules**, the **Workspace preferences** declared to Superpowers, the **Git contract**, and **Required reads and when they are due** — the one table naming which docs are due at which moment, [sp-workflow-prefs.md](sp-workflow-prefs.md) among them, due before the first question put to the user. Without it you will miss that the plan is the only carrier into execution subagents (Operating rule 4). The notation used below (🪝 hook · 🚧 gate · 📌 constraint · 🚪 entry · 🎛️ mode · ▶️ resume) is defined in [sp-workflow-format.md](sp-workflow-format.md). Procedures this path shares with another live in [sp-workflow-procedures.md](sp-workflow-procedures.md) — read one only when a hook below cites it, never up front.

&nbsp;

**Typical flow** — bold = our steps, the rest is Superpowers' own; each hook's own condition is what actually governs: `brainstorming` → **PRD (+ AC approval stop) + TSD + spec sync + e2e verdict** _(A1 `[gated]` band)_ → **mode + app-serve + codeowners load (if create) + `writing-plans`** _(A1 Always band)_ → **(enricher |) docs commit-ask + plan-review stop** _(A2)_ → _(user proceeds)_ → branch → execution (`test-driven-development`) → `requesting-code-review` _(auto only)_ → **verify docs vs. what shipped** _(A3 — always; actions conditional)_ → `finishing-a-development-branch`

Path A has two parts: **Documentation** (through the plan-review stop) and **Execution** (after the user proceeds — same session or another session with the plan path).

🚪 **Entry — user provides a plan path.** (continue / execute / “use this plan” in this or another session).

**Plan phase (Global Constraints)** — payload this Entry reads (not a landmark). Hooks write exactly one of these lines (same key, distinguishable values); replace the draft line with the ready line at hard stop — do not keep both:

| When written                                               | Verbatim line                                     |
| ---------------------------------------------------------- | ------------------------------------------------- |
| After `writing-plans` creates/updates the plan (A1 Always) | `Path A phase: Documentation (draft).`            |
| At A2 hard stop (after enricher-or-skip, before wait)      | `Path A phase: ready for Execution (YYYY-MM-DD).` |

The **date** on the ready line is when the plan was declared ready. It exists because the plan lives at a git-ignored path, so nothing else can date it — and a plan is only safe to execute against the docs and code it was written from.

**Before you put any question to the user here** — the draft-vs-ready ask below included — the cycle-start reads are already due: [sp-workflow-shared.md](sp-workflow-shared.md) → _Required reads and when they are due_. A rejoin **is** a cycle start, and this Entry is usually where the first question gets asked, so this is the moment they fall due, not some later one. Resolve whatever is still unset first, and fold it into the same ask rather than returning to the user twice.

Read `Path A phase` from the plan's Global Constraints, then:

1. **`Path A phase: ready for Execution (YYYY-MM-DD).`** → **first check the plan is still current**, then enter **A2's ▶️ Resume** (skip Documentation). Do not re-run A1/A2 close-out unless the user asks to revise the plan.

   **Freshness check** — has anything under this functionality's `docs/x/{name}/`, or the libs the plan's tasks touch, been committed **since that date**? If **no**, resume. If **yes**, the plan may have been written against docs or code that have since moved: re-read the PRD/TSD and confirm the plan's IDs, paths and companion entries still hold. Where they no longer do, return to A1/A2 rather than executing — a plan is only valid against the state it was written from. If the line carries **no date** (written before this rule), treat it as unknown and run the check.

2. **`Path A phase: Documentation (draft).`** or **phase missing** → **ask**: is this plan ready to execute, or still a draft?
   - **Ready** → set/confirm `Path A phase: ready for Execution (YYYY-MM-DD).` with today's date, then **A2's ▶️ Resume**. (Dating it now is honest: the user has just confirmed the plan against the current state.)
   - **Draft** → stay in **Documentation** (continue from the appropriate A1/A2 point; do not start Execution).
3. User may override (“execute anyway” / “keep drafting”).

🚪 **Entry — a functionality's PRD exists but its ACs were never approved.** (a cycle that stopped during Documentation, in this or another session; no plan yet, or a plan that predates approval).

**ACs Approved (PRD header)** — payload this Entry reads (not a landmark). `x-ng-doc-prd-writer` writes exactly one of these into `docs/x/{name}/PRD/README.md`:

| When written                            | Verbatim value                                 |
| --------------------------------------- | ---------------------------------------------- |
| The user approved the AC set            | `- **ACs Approved** (YYYY-MM-DD): {that date}` |
| The writer could not reach the approver | `- **ACs Approved** (YYYY-MM-DD): NOT YET`     |

Read `ACs Approved`, then:

1. **`NOT YET`** → the set was drafted but never approved. Do **not** re-run `brainstorming` and do **not** start the PRD over: enter **A1's ▶️ Resume**, which re-presents the set for approval. Say that you are resuming an unapproved PRD and what is still open.
2. **A date** → approval already happened, so resume at the first A1 step whose output is missing (no TSD folder → step 1's TSD dispatch; TSD present but no synced spec → step 2; and so on). If a **plan** also exists, follow the plan-path 🚪 **Entry** above instead — it is further along.
3. **The field is absent** (a PRD written before it existed) → treat it as `NOT YET`: nothing recorded an approval, so nothing may be assumed. Rule 1 applies.
4. User may override (“redo the PRD”, “the ACs are fine, carry on”). Taking their word here is legitimate — they are the approver; stamp the field with today's date.

**Docs-in-scope set** — **Members:** **A1's `[gated]` band** · **A2's `[gated]` band** · **A3's `[gated]` band**. **Combine:** each gate below is answered on its own terms, and **any gate answering No skips the whole set** for this cycle. **Regardless:** Superpowers' `brainstorming`, A1's Always band (mode → app-serve → codeowners load (if create) → `writing-plans` with those in the plan), A2's hard stop, **A3's Always band** (verifying `util` / `app` / grab-bag `requirements/`), and `test-driven-development` when tests are in scope.

> 🚧 **Functionality gate** [auto] — **Asks:** is the work (or does it produce) a **single-purpose** lib from `map` / `data-access` / `ui` / `feature` / `page`?
>
> - **Yes** → the docs-in-scope set runs.
> - **No** (`util` / `api` / `app`, or a **grab-bag** `ui` / `feature`) → **skip the set**: no PRD/TSD writers, no e2e verdict, no enricher, none of our FR/BR/AC ID conventions.
>
> `util`, `api`, and `app` **never** form a functionality, and neither does a **grab-bag** `ui` / `feature` lib (`/CONTEXT.md`). The test for telling a grab-bag from a single-purpose lib: `/docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag. None of them get `docs/x/{name}/` PRD or TSD, and therefore no PRD ACs. Adding an item to a grab-bag never creates a functionality. For lib shape, load `x-ng-lib-build-helper`. When unit tests are in scope, load `x-ng-test-unit-helper` — it owns where those libs' FR/BR IDs come from.

> 🚧 **Missing-docs gate** [ask] — **Asks:** the work updates an **existing** `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` lib that has no `docs/x/{name}/` for its functionality name — document it now?
>
> - **Yes** → the docs-in-scope set runs (first-time PRD/TSD).
> - **No** → **skip the set** for this cycle: no writers, no e2e verdict, no enricher, none of our FR/BR/AC ID conventions.
> - **Not asked when:** the lib already has `docs/x/{name}/`; the functionality is **new** (not yet in the workspace) — creating it is creating the functionality, so it always documents, never offer skip; or the lib is a **grab-bag** — it has no functionality name, so there is nothing to offer to document.
>
> Ask before A1, once the docs work is about to begin.

📌 **PRD/TSD over cycle spec** — **Spans:** `writing-plans` · A2 step 1 (the enricher's coverage check). **Leaves alone:** which hooks run — that is the gates' answer, not this rule.

When A1's `[gated]` band ran this cycle, for `writing-plans` (and A2's enricher coverage check): (1) read `docs/x/{name}/` **PRD and TSD as the primary source of truth**; (2) on any **conflict** with the Superpowers brainstorm spec under `.superpowers/specs/`, **PRD/TSD win** (user decisions during the writers win); (3) for anything the plan still needs that PRD/TSD **do not cover** (e.g. companion-lib tasks, plan-level narrative), use the **synced** brainstorm spec; (4) do **not invent** requirements that appear in neither — ask. A1 syncs the spec so Superpowers' native "plan from the spec" path stays aligned with (1)–(2). When that band was skipped, the brainstorm spec alone remains the plan's requirements source (vanilla Superpowers); A1's Always band still resolves mode and app-serve, still loads `x-codeowners-helper` when this cycle creates a path, and `writing-plans` still records them, then A2 hard-stops.

📌 **Companion work — `util`/`api`/`app`, or another functionality's libs** — **Spans:** `writing-plans` (task order) · both gates (re-answered for the companion) · A1's `[gated]` band, A2's `[gated]` band and A3's `[gated]` band (once per functionality). **Leaves alone:** the current functionality's own gate answers and its docs.

When brainstorm concludes that a `util`, `api`, `app`, or **grab-bag** `ui` / `feature` lib — or a `map` / `data-access` / **single-purpose** `ui` / `feature` / `page` lib belonging to **another** functionality (not the one this cycle is creating or updating) — must be created or updated in the **same cycle**:

1. **Order.** `writing-plans` must include the create/update tasks for that companion lib **before** any task of the current functionality that depends on it.
2. **Gates re-answer per companion.** The Functionality gate and the Missing-docs gate are answered for the companion work on its own terms: a companion `util` / `api` / `app`, or a **grab-bag** `ui` / `feature`, always answers **No**; another functionality's libs answer by their own lib types and their own `docs/x/{name}/`.
3. **Docs are per functionality.** When the gates answer **Yes** for more than one functionality this cycle, A1's `[gated]` band, A2's `[gated]` band and **A3's `[gated]` band** each run **once per functionality**, against that functionality's own `docs/x/{name}/` — including A3's verification of a companion functionality's docs against what implementation actually did to its libs. (A companion `util` / `app` has no `docs/x/`, so A3 never applies to it: its `requirements/` IDs are re-tagged as part of that lib's normal test edits.) **Give each functionality its own todo at A1 and A3** rather than one todo for the step — after a long A1 the second functionality is the one that gets dropped.
4. **One level deep — deeper companions are surfaced, never absorbed.** Rules 1–3 apply to the companions of **this cycle's** functionality only. If a companion turns out to need work in a **further** lib (its own companion), that is **not** this cycle's work: report the chain to the user — naming the libs and the ACs it puts at risk — and let them choose to widen the cycle, do the deeper work first in its own cycle, or defer it. Do **not** re-answer the gates for it, do **not** run A1's band or A2's `[gated]` band for it, and do **not** add its tasks to the plan. Resolving companions recursively would turn one requested feature into an unbounded number of documentation cycles, each with its own AC-approval interview, that the user never asked for.

📌 **Served-app check** — **Spans:** `writing-plans` · A2's ▶️ Resume · execution (each implementation task). **Leaves alone:** mode, which hooks run, the e2e verdict, `audience`.

When `App serve:` is an Nx project name: (1) `writing-plans` writes that line into Global Constraints **and** puts the per-task check into each **implementation** task's text (not only Global Constraints — Operating rule 4); (2) the **controller** starts `nx serve {app}` once at Execution start if it is not already running — never a second serve, never an implementer-started serve; (3) after each implementation task, before commit (auto) or before the next task (interactive), read **that** serve's terminal for compile errors/warnings **this task introduced** and fix them before continuing. Pre-existing warnings do not block. When the line is `App serve: not-needed.`, skip all of this. This is a compile check, not a browser walkthrough.

#### 🪝 A1 · Before `writing-plans` [close-out]

Always runs on Path A before invoking `writing-plans`. One hook at this attach-point (do not split into a second before-`writing-plans` hook).

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Write/refresh the PRD & TSD** — `x-ng-doc-prd-writer`, then `x-ng-doc-tsd-writer`, **once per functionality in scope this cycle** (📌 _Companion work_). **Dispatch each writer to its own subagent**, and keep that subagent alive for the length of its run (_Operating rule 5_). A writer carries a large body of templates and worked examples that this session never emits; what this session needs back is the document it wrote and its Summary.

   Dispatch each with the functionality name, the brainstorm spec path, and — for the TSD — the PRD path, then follow [sp-workflow-procedures.md](sp-workflow-procedures.md) → _Relaying a writer's confirmation_ — part of this step, not an optional aside. This session is the channel, because a subagent cannot reach the user: the PRD's ACs must come back explicitly approved, and both writers' open questions answered rather than guessed.

   **AC approval gates the TSD, not just the PRD — run the two writers in series, never together.** Take the PRD relay all the way to the end first: the user approves the AC set, and the PRD's **ACs Approved** field carries that date. Only then dispatch `x-ng-doc-tsd-writer`. The TSD decomposes every AC into FR/BRs and back-links them, so a TSD built on unapproved ACs turns one rejected AC into orphaned FR/BRs and burned IDs across **two** documents — and burned numbers never come back. Dispatching both writers at once to save a round-trip is the one shortcut this step forbids.

   **The product-observable gap loop.** If `x-ng-doc-tsd-writer` flags a `(new — suggest a PRD AC)` entry, put it to the user; if approved, dispatch `x-ng-doc-prd-writer` to add the AC, then send the new AC ID back to the TSD subagent to back-link it — that skill never edits the PRD itself.

   **What returns to this session** is each writer's Summary — saved paths, the AC and FR/BR IDs with one-line descriptions, the companion `[TO-CREATE]` / `[TO-UPDATE]` entries, and anything still unanswered. That plus the written docs is what `writing-plans` reads (📌 _PRD/TSD over cycle spec_); the writers' templates stay in the subagents that used them.

2. **Sync the Superpowers spec** — update this cycle's brainstorm spec under `.superpowers/specs/` so it matches the approved PRD/TSD on overlapping decisions (step 1 wins on conflicts). Fix conflicting sections in the spec body; at minimum put a short note at the top that `docs/x/{name}/` PRD and TSD are primary and win on conflicts, and link those paths. Keep spec-only material that PRD/TSD never cover (gap filler for planning). Do **not** commit the spec (see _Workspace preferences_).
3. **Decide e2e now** — e2e is in scope only if the functionality has a `page` lib, or a `feature` that **composes another functionality's `feature`** (renders its exported entry component — "renders it" is "initializes it") **and some app page hosts that composition — already, or by the end of this cycle** (i.e. a page task is in **this** plan; a host merely intended for some future cycle does not count, and the hosting page may belong to any functionality — ownership is not the test), **and** the PRD ACs describe user-observable cases (taken as a set — not every AC need be e2e-coverable). A `feature` lib is not routable, so with no hosting page there is nothing to drive: if none exists and this cycle does not create one, e2e waits for a later cycle rather than inventing a harness page. State the verdict and a one-line why — naming the hosting page when the second case is what put e2e in scope.

   Everything this decision needs is in the PRD/TSD and the workspace, so derive it rather than asking. Ask the user only when the **target** is genuinely unsettled: which page will host it, **or** — when that page is composed by more than one app — which app's `{app}-e2e` the spec belongs in. That second question is the e2e skill's own rule; do not treat a settled page as settling it.

4. **Load the reference guidelines — each helper's `SKILL.md`, not its `assets/`** — `x-ng-lib-build-helper` and `x-ng-test-unit-helper` always, and `x-ng-test-e2e-helper` **only if step 3 put e2e in scope** — so `writing-plans` drafts from PRD/TSD first, then the synced spec for gaps (📌 _PRD/TSD over cycle spec_).

   **Leave their `assets/` examples unread here** (_Operating rule 5_). An example exists for whoever **builds** the lib or writes the spec, and it never reaches them through this session's context anyway: `x-ng-sp-plan-enricher` writes the **resolvable repo-relative path** to each one into the plan (A2 step 1), and the implementer opens it there. They are the largest single load on this path and change nothing this session emits. What `writing-plans` needs is each helper's rules — which lib types exist and what each owns, the `data-access` variant question, where FR/BR IDs come from, and what an e2e task must carry.

> **Override:** the `[gated]` band overrides `brainstorming`'s stated exclusive exit ("the ONLY skill you invoke after brainstorming is `writing-plans`"). Authorized by the precedence rule: that exclusivity guards against _implementation_ skills jumping to code — these write documents only. The Always band below still ends in `writing-plans`.

> **Note:** `writing-plans` natively plans from the Superpowers spec — that is why gated step 2 syncs it. Requirements layering for this cycle: PRD/TSD primary → conflicts favor PRD/TSD → gaps may use the synced spec (📌 _PRD/TSD over cycle spec_).

**Always:**

5. **Resolve the execution mode** for this cycle — auto (recommended) or interactive; see the 🎛️ block below. Resolve `pref.mode` per [sp-workflow-prefs.md](sp-workflow-prefs.md) (**In the plan:** `Execution mode:`). Match/write: [agents-md-format-local.md](agents-md-format-local.md).
6. **Resolve app-serve** for this cycle — `not-needed` or an Nx project name. **Derive first** (do not ask when this settles it): work cannot affect a running app (util / api / docs-only, or no app imports the changed libs) → `not-needed`; e2e already settled an app this cycle → that app (announce); exactly one app will load the changed libs → that app (announce). Else resolve `pref.app-serve` per [sp-workflow-prefs.md](sp-workflow-prefs.md) (**In the plan:** `App serve:`). A stored value is a usual app, not a law — this cycle may override without rewriting the default. Do not ask a second time for an app e2e already settled. Match/write: [agents-md-format-local.md](agents-md-format-local.md). Write into the plan: `App serve: not-needed.` or `App serve: {nx-project}.`
7. **Load `x-codeowners-helper` when this cycle creates an owned path** — a new app, lib, or shared version-folder (any lib type, including `util` / `api` / `app` / grab-bag). Load that helper's `SKILL.md` so `writing-plans` is born with a same-commit `CODEOWNERS` step on the create-path task. If this cycle only updates existing paths, skip — unless the user stated an ownership handoff (path + new owner); then load it because they asked. Do not infer a handoff from file edits.
8. **Invoke `writing-plans`** so the plan's `## Global Constraints` includes (merge; do not omit): the mode sentence from the 🎛️ block, the `App serve:` line from step 6, and `Path A phase: Documentation (draft).` Do **not** let vanilla `writing-plans` re-ask mode at the end as a substitute. When `App serve:` is an app name, each implementation task carries the per-task check (📌 _Served-app check_).

🎛️ **Execution mode — auto or interactive.** The mode decides which Superpowers skill runs execution and whether the agent commits. **Resolve once per cycle** (not per task), **before** `writing-plans`, so the plan is born with the answer and handoff works whether or not the enricher runs later. **Auto is the recommended default.** Resolve per [sp-workflow-prefs.md](sp-workflow-prefs.md). Still write the plan line.

| Mode                   | Execution skill               | Behaviour                                                                                                                                                                              | Plan line (verbatim)                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto** (recommended) | `subagent-driven-development` | Exactly as Superpowers defines it: an implementer subagent per task, a commit per task, task reviews + final whole-branch review, then finishing.                                      | `Execution mode: AUTO. Execute with subagent-driven-development as Superpowers defines it (implementer subagent per task, commit per task, task + final reviews).`                                                                                                                                                            |
| **Interactive**        | `executing-plans`             | In-session, no implementer subagents. After each task, stop: summarize the files changed and how to verify them, then wait for the user. No commit/push/merge/PR — see _Git contract_. | `Execution mode: INTERACTIVE. Execute with executing-plans (in-session, no implementer subagents). Work on the feature branch but do NOT commit, push, merge, or open a PR. After each task, stop: summarize the files changed and how to verify them, then wait for the user. The user verifies and decides when to commit.` |

Interactive trades away `subagent-driven-development`'s per-task and final whole-branch reviews — the user is the reviewer at each stop. Everything else (TDD, task order, `systematic-debugging`, `verification-before-completion`) is identical in both modes.

> ▶️ **Resume** (after the user answers step 1's relay). Not a step band — this is where step 1's wait for AC approval comes back, so this hook has two stopping points, not one: this, and A2's plan review. The relay itself is [sp-workflow-procedures.md](sp-workflow-procedures.md) → _Relaying a writer's confirmation_; what follows is only what this hook adds.
>
> - **The writer subagent is gone** (its session ended, or it was killed mid-run) → dispatch a fresh one. It reads the PRD, finds `ACs Approved: NOT YET`, and treats the set as a draft; hand it the user's answers and let it re-present. Nothing is lost — the PRD is on disk and the field says where the cycle stopped.
> - **The user declined to approve at all** → stop here. Leave `ACs Approved: NOT YET`, do **not** dispatch `x-ng-doc-tsd-writer`, and do **not** continue to step 2. An unapproved PRD is a safe resting state; a TSD or a plan built on one is not.

#### 🪝 A2 · After `writing-plans`, before execution [close-out]

Always runs on Path A after `writing-plans` produces a plan. This is the end of **Documentation**; **Execution** starts only on resume.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Enrich** — run **`x-ng-sp-plan-enricher`**: fold into the plan's Global Constraints the PRD/TSD IDs and rules, the commit-message pointer, and the CODEOWNERS pointer when the plan creates owned paths or explicitly states a handoff; carry in the e2e verdict from A1 and tag the test tasks. Run it **once per functionality documented this cycle** (📌 _Companion work_): each run folds only its own `docs/x/{name}/` and tags only that functionality's test tasks, and Global Constraints are merged, never replaced.

2. **Ask the user to commit the functionality's docs.** Nobody else does — Documentation-phase commits belong to the user (_Git contract_), and no hook on this path commits them. Name the paths (`docs/x/{name}/PRD/` and `docs/x/{name}/TSD/`) and point at `/docs/guidelines/naming-conventions.md#git` for the message rather than inventing one, **once per functionality documented this cycle** (📌 _Companion work_). **Never offer to commit a PRD whose `ACs Approved` reads `NOT YET`** — say it needs approval first. This is an **ask, not a gate**: if the user declines or ignores it, say plainly that the docs remain uncommitted and continue to the hard stop. Do not commit them yourself, and do not block on it.

**Always:**

3. **Hard stop — plan review gate.** In the plan's Global Constraints, **replace** `Path A phase: Documentation (draft).` with `Path A phase: ready for Execution (YYYY-MM-DD).`, using today's date (one phase line only — the date is what lets the plan-path 🚪 **Entry** tell a fresh plan from a stale one). Do **not** create the feature branch and do **not** start execution. Tell the user the plan is ready at its path and that they can review it. Then **recommend they execute it in a fresh session**, by giving that path to a new agent: this session has just written the PRD, the TSD and the plan, none of which executing the plan requires — the plan already carries everything (_Operating rules 4 and 5_), and the plan-path 🚪 **Entry**'s freshness check is what makes handing it over safe. Continuing in this session stays available; it costs nothing but depth. Then **wait**.

> ▶️ **Resume** (after the user proceeds). Not a step band — Execution starts here. For other-session / plan-path entry, also follow the plan-path 🚪 **Entry** at the top of Path A.
>
> - **Other session (recommended)** — user provides the plan path. Follow Path A's plan-path 🚪 **Entry** (phase line → Resume or ask draft vs ready). If mode or app-serve is missing after they confirm ready, resolve the missing key per [sp-workflow-prefs.md](sp-workflow-prefs.md), then ensure the plan records it before executing. Then start `nx serve` when 📌 _Served-app check_ requires it.
> - **Same session** — do not re-ask mode or app-serve unless the user explicitly changes them. Continue from `using-git-worktrees` (work in place per _Workspace preferences_) → start `nx serve` when 📌 _Served-app check_ requires it → the execution skill for the mode already in the plan.

#### 🪝 A3 · Before `finishing-a-development-branch` [close-out]

Always runs on Path A before finishing. **This hook verifies; only its actions are conditional** — there is no "did we mint IDs?" question to answer wrongly. The plan is the only carrier _into_ execution; this hook is the only carrier _out_ of it, so nothing else will catch what implementation changed.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Verify the PRD & TSD against what was actually built**, once per functionality (📌 _Companion work_), following [sp-workflow-procedures.md](sp-workflow-procedures.md) → _Verifying a functionality's docs against what shipped_. That procedure carries the scoped read, the two carve-outs, the four outcomes, the never-silent amend/retire and the `Last Verified` stamps — all of it part of this step, none of it optional.

   **The changed set here is the libs this cycle's feature branch touched.** An amend matters more at this point than anywhere else on the path: the hook runs at the cycle's deepest, and an amend is the one action that can quietly overwrite text the user already approved.

**Always:**

2. **Verify the local `requirements/` registry** of any `util`, product `app`, or grab-bag `ui`/`feature` lib this cycle touched — the same shared procedure's closing rule, report-don't-block carve-out included. Changed set as above.

3. **Verify CODEOWNERS when this cycle created or handed off an owned path.** If it did not, skip. If it did, confirm root `CODEOWNERS` has a line for each new or handed-off path. If a line is missing, load `x-codeowners-helper` and add it, and say it is a late fix (the same-commit step was missed). Do not change ownership for ordinary edits under an existing path.

In **auto** mode the tree has already been reviewed, so route every resulting test-file change through a fix dispatch + scoped re-review like any other post-review change — never edit it from the controller session. Follow `x-ng-test-unit-helper` and `x-ng-test-e2e-helper` — **re-read their `SKILL.md` here rather than checking whether A1's copy survived** (_Operating rule 5_). This hook runs after a whole execution phase, so treat them as gone by default: a half-remembered convention does not announce itself, and a re-read costs one file.

> **Note:** a stale doc does not stay a local problem. 📌 _PRD/TSD over cycle spec_ makes the PRD/TSD the **primary** source for the next cycle, so an uncorrected doc outranks a correct fresh brainstorm — and the next cycle to meet it, a bug fix included, sees a documented functionality and carries the error forward again. Verifying here is what stops drift compounding.

⚪ **Hooks with no workspace step yet** — `using-git-worktrees` (after the user proceeds from A2; work in place per _Workspace preferences_, so just create the branch, in both modes. If the user declines a feature branch, that skips only this skill — execution and finishing still run, so A3 still runs; see _Skipping one Superpowers skill does not skip a later hook_ in the shared rules. Warn that docs stay on the current branch and stay uncommitted unless they commit) · execution (`subagent-driven-development` / `executing-plans`, picked by the mode) · `test-driven-development` · `requesting-code-review`

[🔙](../../README.md#agents)
