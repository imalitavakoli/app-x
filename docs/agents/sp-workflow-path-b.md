[🔙](../../README.md#agents)

# 🛣️ Path B — Fix a bug, a test failure, or anything else technically broken

> **Read [sp-workflow-shared.md](sp-workflow-shared.md) first — required, not optional.** It owns the rules this path assumes and cites by name: the **Operating rules**, the **Workspace preferences** declared to Superpowers, and the **Git contract**. The notation used below is defined in [sp-workflow-format.md](sp-workflow-format.md); the reasoning is in [sp-workflow-rationale.md](sp-workflow-rationale.md).

&nbsp;

**Typical flow** — each hook's own condition is what actually governs: `systematic-debugging` → `test-driven-development` → `verification-before-completion` → **verify docs vs. the proven fix** _(B1 — always; actions conditional)_ → `finishing-a-development-branch` _(only if the fix is on its own branch)_

No execution mode here — that question belongs to path A only. For git, see _Git contract_.

**Docs-in-scope set** — **Members:** **B1's `[gated]` band**. **Combine:** each gate below is answered on its own terms, and **any gate answering No skips that band** for this fix. **Regardless:** `systematic-debugging`, `test-driven-development`, `verification-before-completion`, and **B1's Always band** (verifying `util` / `app` / grab-bag `requirements/`).

> 🚧 **Functionality gate** [auto] — **Asks:** is the fix to a **single-purpose** lib from `map` / `data-access` / `ui` / `feature` / `page`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** (`util` / `api` / `app`, or a **grab-bag** `ui` / `feature`) → **skip that band**: those never have `docs/x/` docs to verify. B1’s Always band still verifies their local `requirements/` registry.
>
> Grab-bag `ui` / `feature` libs are defined in `/docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag. Unit tests for all of these libs still follow TDD and `x-ng-test-unit-helper` when tests are in scope — retag their IDs as part of normal test edits, not via B1's PRD/TFS writers.

> 🚧 **Missing-docs gate** [auto] — **Asks:** does that lib's functionality already have `docs/x/{name}/`?
>
> - **Yes** → B1's `[gated]` band runs.
> - **No** → **skip that band**: with no `docs/x/{name}/`, that functionality has no ID namespace at all — no PRD ACs, no TFS FR/BRs — so there is nothing to verify, amend, retire or re-tag.
>
> `[auto]` here, not `[ask]` as on Path A: a bug fix is not the place for a first-time PRD/TFS interview. If the user wants that functionality documented, that is a Path A cycle.

📌 **Companion work — `util`/`api`/`app`, or another functionality's libs** — **Spans:** both gates (answered per functionality) · B1's `[gated]` band (once per functionality). **Leaves alone:** the fix and its tests, and the order of any of it — Path B has no plan, so nothing here orders work.

When the fix touches a `util`, `api`, or `app` lib, or libs belonging to more than one functionality:

1. **Gates answer per functionality.** A `util` / `api` / `app` part, or a **grab-bag** `ui` / `feature` part, always answers **No** — none of them has `docs/x/` to update. Each functionality's part is answered on its own lib types and its own `docs/x/{name}/`.
2. **B1's `[gated]` band runs per functionality** whose gates both answer **Yes** — each against its own `docs/x/{name}/`. It runs whether or not that part of the fix minted an ID: verifying is the point, and an amended or retired requirement mints nothing.
3. **One level deep — deeper companions are surfaced, never absorbed.** Rules 1–2 cover the libs **this fix touches**. If fixing one of them turns out to require work in a **further** lib, that is not this fix's scope: report it to the user and let them decide. Do not widen the fix, and do not run B1 for a functionality this fix never touched.

#### 🪝 B1 · After `verification-before-completion` [close-out]

Always runs on Path B once the fix is proven. **This hook verifies; only its actions are conditional.** Path B has no plan and no A1, so this is the _only_ point at which the docs meet what shipped — and a bug fix very often means the documented behaviour was the thing that was wrong.

**[gated]** — part of the docs-in-scope set; runs only when both gates answer **Yes**:

1. **Verify the PRD & TFS against the proven fix**, once per functionality (📌 _Companion work_), on the same four outcomes as Path A's A3 — **added** (mint + re-tag, rename only) · **amended** (correct the text under its existing ID) · **retired** (remove the entry, its ID Index row and its AC back-link; never recycle the number) · **unchanged** (record it, no edit). Use `x-ng-prd-writer`, then `x-ng-tfs-writer`.

   **Same read order and scoping as A3, from a different source.** Path B has no plan and often no branch and no commits (_Git contract_), so the changed set is **the files the fix touched** — which `systematic-debugging` already established. Open the TFS README's **ID Index** first, intersect it with those files, walk in full only the entries they own plus the ACs those back-link, and open a `{libtype}-v{n}.md` only when the Index says an in-scope ID lives in it. Everything else is **unchanged** by construction. The shared-lib carve-out holds here too, and `Last Verified` is stamped only on the files you actually walked.

   A one-line fix is where this matters most: without scoping, proving one behaviour would re-read every AC and every ID the functionality has.
2. **Amending or retiring is never silent** — the writers show old beside new, get explicit confirmation, and name the other functionalities that reuse the affected lib.
3. **Stamp `Last Verified`** on every doc checked, including those needing no edit.

**Always:**

4. **Verify the local `requirements/` registry** of any `util`, product `app`, or grab-bag `ui`/`feature` lib the fix touched, on the same four outcomes, per `x-ng-test-unit-helper`. An `api` lib has none. Stamp `Last Verified` here too. As on Path A, step 2's confirmation gate does **not** apply — those entries were never approved — but **report** any amend or retire, and name a shared lib's consumers. Report, don't block.

Docs come **after** the fix is proven, never before, so nothing documents behaviour that verification might still reject. The cycle is not done until this hook has run — make the final completion report after it, not before.

⚪ **Hooks with no workspace step yet** — `systematic-debugging` · `test-driven-development` · `finishing-a-development-branch` (only if the user put the fix on its own branch and asks to wrap it up)

[🔙](../../README.md#agents)
