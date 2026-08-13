<!--
Template for `docs/x/{name}/TFS/README.md` — the functionality-level sections only.
Replace `{NAME}` with the PRD's **Feature key**, copied verbatim from its field in `docs/x/{name}/PRD/README.md` — never re-derived from the functionality name.
Remove every `>` helper note from the final draft; keep every heading you use.
The per-lib specs live in sibling files, one per LIVE VERSION of each owned lib (map-v1.md / data-access-v2.md / ui-v1.md / ui-v2.md / feature-v1.md / page-v1.md) — NOT here.
A shared lib is versioned, so its version is in the filename from v1; an app-domain lib is unversioned and keeps the plain name (ui.md).
-->

# TFS — {name}

- **Last Updated** (YYYY-MM-DD): {date}
- **Last Verified** (YYYY-MM-DD): {date}
- **Owner**: {owner}

> **Last Updated vs Last Verified** — `Last Updated` is when this document's text last changed. `Last Verified` is when someone last confirmed it still matches the shipped code, **including when nothing needed changing** — that is the outcome a writer can never record, so only the post-execution verification step stamps it. A `Last Verified` older than the functionality's last commit means the TFS is unverified against current behaviour.

## ℹ️ Overview

### Functionality Name

> The technical name (kebab-case; prefix `ng-` when the feature has logic), e.g. `ng-balance-card`.

### Functionality Classification

> Choose exactly one (see `docs/getting-started/library-types-and-their-relationship.md` — Functionality types). Shorthand (required · optional):
>
> - **abstract** — `data-access` · optional `map`
> - **visual** — `ui` and/or `feature` (no owned `page`)
> - **visual+** — owned `page` · optional `ui` / `feature`
> - **mixed** — `data-access` + `feature` · optional `map` / `ui` (no owned `page`)
> - **mixed+** — `page` + `data-access` · optional `map` / `ui` / `feature`
>
> Emit only the sibling `{libtype}-v{n}.md` files (one per live version — a shared lib is versioned, so `ui-v1.md`; an app-domain lib is not, so `ui.md`) for libs this functionality **owns**. Also state the **natural entry lib** (same doc).

### Domain

> The functionality's domain (scope). If you cannot infer it from the PRD/context, ask: is it **shared** (usable by any app) or specific to one app in the workspace? A **shared** functionality's libs live under `libs/shared/…`; an app-specific one under `libs/{domain}/…` (the domain is that app's name). The domain is the first segment of every **owned** lib name (`{domain}-{type}-{name}`), and every owned lib uses this functionality's **same** `{name}`. Library boundaries per domain are enforced in `.eslintrc.json`.

### Rationale

> Why this classification and which natural entry lib. Name any existing libs **reused** (other functionalities) so a lib type may be absent here. If other pages compose this functionality, say so — that does **not** add an owned `page`.

### Non-Goals & Why

> What this functionality deliberately does **not** do technically **today** — and the reason for each. This is **current scope**: e.g. `no owned ui lib — each row is a reused feature, and a ui may not import a feature`. Keep it short; it is what a reader needs to understand the technical boundary.
>
> **An option considered and rejected does not belong here** — a different lib split, another `data-access` structure, a shared lib deliberately not reused, a pattern ruled out. Those are decision _history_ and grow without bound, so they go in `DECISIONS.md` → Rejected approaches, with the date and why each lost. That file is their durable record; the plan and brainstorm that weighed them do not survive the cycle.

## 🔗 Existing Dependencies & Reuse

> List only libs that **do not belong to this functionality** — i.e. libs from _other_ functionalities/shared infra that this one reuses. Do not list this functionality's own map/data-access/ui/feature/page libs here. Ask the user what to reuse; do not assume.
>
> **Mark each entry by its state for this cycle** — unmarked = exists and is used as-is; `[TO-CREATE]` = does not exist yet; `[TO-UPDATE]` = exists but must change for us (a new input/output, a new rendering rule, a new method). Use exactly these two markers so the plan and a future reader can find them; do not coin your own wording.
>
> What the marker implies depends on the lib type: a marked **functionality** (`map` / `data-access` / **single-purpose** `ui` / `feature` / `page`) carries its requirements in its **own** PRD & TFS; a marked `util` / `api` / `app`, or a **grab-bag** `ui` / `feature`, **never** gets `docs/x/` (a `util` / `app` / grab-bag item records them in its own `requirements.md`; an `api` has none). Either way the work is a **companion task in the plan**, never an owned lib of this TFS — so no FR/BR here describes that lib's own behaviour or the surface it must gain. A **boundary** BR asserting what our lib _passes_ it is still ours, and belongs in the owning lib's `{libtype}-v{n}.md`. If a `[TO-UPDATE]` or `[TO-CREATE]` dependency blocks one of this functionality's PRD ACs, say which ones: that is a real delivery risk.
>
> **A marker states this cycle's state, and goes stale when the companion work lands.** So write each one so a reader can retire it without re-deriving the decision — a `[TO-UPDATE]` names the exact surface the lib must gain, so anyone can open that lib and see whether it is still true. And when this TFS is **updated** later, re-verify every marker already here: clear the ones whose work has landed (with their "blocks" note), narrow the ones that partly landed, and leave anything you cannot confirm as an Open Technical Question. Do **not** add a "these were accurate when written" disclaimer — **Last Updated** above already says that.

### Used map / data-access libs

> Per lib: name → class/interface → the methods/observables used, and why. Often `NONE` — a functionality's own map/data-access libs do not rely on other functionalities' map/data-access libs (things like the base URL are provided by the calling page/feature, not fetched by depending on the config libs here). Mark `[TO-CREATE]` / `[TO-UPDATE]` per the state rule above.

### Used ui / feature / page libs

> Per lib: name → what it provides. `NONE` if none. Mark `[TO-CREATE]` / `[TO-UPDATE]` per the state rule above; for a `[TO-UPDATE]`, list the exact inputs/outputs/rules it must gain for us, and name the functionality that owns that work.

### Used util libs

> Per lib: name → the class/function used, and why reuse is appropriate. (Functionalities never own a `util`/`api`/`app` lib — they reuse shared ones.) Mark `[TO-CREATE]` / `[TO-UPDATE]` per the state rule above — either way still not a PRD/TFS target; a `util`'s requirements live in its own `requirements.md`.

## 🧭 ID Index

> Every FR/BR ID in this TFS in one table — the single place that keeps IDs unique across all lib files and preserves PRD ↔ TFS ↔ test traceability. One row per ID; fill it as you write each lib file.

| ID                     | Lib file      | Maps to PRD AC |
| ---------------------- | ------------- | -------------- |
| {NAME}\_{OWNER}\_FR-01 | feature-v1.md | {NAME}-AC-01   |
| {NAME}\_{OWNER}\_BR-01 | ui-v1.md      | {NAME}-AC-01   |

## ❓ Open Technical Questions

> Anything unknown/unconfirmed. Raise with the user. `NONE` if all resolved.
