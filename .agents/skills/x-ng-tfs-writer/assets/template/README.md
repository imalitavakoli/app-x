<!--
Template for `docs/x/{name}/TFS/README.md` — the functionality-level sections only.
Replace `{NAME}` with the same feature key used in the PRD (e.g. `ng-balance-card` → `BALANCE`).
Remove every `>` helper note from the final draft; keep every heading you use.
The per-lib specs live in sibling files (map.md / data-access.md / ui.md / feature.md / page.md) — NOT here.
-->

# TFS — {name}

- **Last Updated** (YYYY-MM-DD): {date}
- **Owner**: {owner}

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
> Emit only the sibling `{libtype}.md` files for libs this functionality **owns**. Also state the **natural entry lib** (same doc).

### Domain

> The functionality's domain (scope). If you cannot infer it from the PRD/context, ask: is it **shared** (usable by any app) or specific to one app in the workspace? A **shared** functionality's libs live under `libs/shared/…`; an app-specific one under `libs/{domain}/…` (the domain is that app's name). The domain is the first segment of every **owned** lib name (`{domain}-{type}-{name}`), and every owned lib uses this functionality's **same** `{name}`. Library boundaries per domain are enforced in `.eslintrc.json`.

### Rationale

> Why this classification and which natural entry lib. Name any existing libs **reused** (other functionalities) so a lib type may be absent here. If other pages compose this functionality, say so — that does **not** add an owned `page`.

### Non-Goals & Why

> What this functionality deliberately does **not** do technically — and the reason for each. Include any **approach considered and rejected**: a different lib split, another `data-access` structure, a shared lib deliberately not reused, a pattern ruled out. State why each lost. This keeps a future reader from re-litigating a settled decision, and it is the only durable record of the alternatives — the planning documents that discussed them do not survive the cycle.

## 🔗 Existing Dependencies & Reuse

> List only libs that **do not belong to this functionality** — i.e. libs from _other_ functionalities/shared infra that this one reuses. Do not list this functionality's own map/data-access/ui/feature/page libs here. Ask the user what to reuse; do not assume. Flag anything recommended-but-not-yet-built with `[RECOMMENDED]`. Meaning of that flag depends on lib type: a recommended **functionality** (`map` / `data-access` / `ui` / `feature` / `page`) needs its **own** PRD & TFS; a recommended `util` / `api` / `app` **never** gets `docs/x/` — list it here as shared reuse (creating/updating it is plan work, not an owned lib of this TFS).

### Used map / data-access libs

> Per lib: name → class/interface → the methods/observables used, and why. Often `NONE` — a functionality's own map/data-access libs do not rely on other functionalities' map/data-access libs (things like the base URL are provided by the calling page/feature, not fetched by depending on the config libs here). Use `[RECOMMENDED]` when the reused functionality is not built yet.

### Used ui / feature / page libs

> Per lib: name → what it provides. `NONE` if none. Use `[RECOMMENDED]` when the reused functionality is not built yet.

### Used util libs

> Per lib: name → the class/function used, and why reuse is appropriate. (Functionalities never own a `util`/`api`/`app` lib — they reuse shared ones.) Use `[RECOMMENDED]` when that shared util is not built yet — still not a PRD/TFS target.

## 🧭 ID Index

> Every FR/BR ID in this TFS in one table — the single place that keeps IDs unique across all lib files and preserves PRD ↔ TFS ↔ test traceability. One row per ID; fill it as you write each lib file.

| ID                         | Lib file   | Maps to PRD AC |
| -------------------------- | ---------- | -------------- |
| {NAME}\_{COMPONENT}\_FR-01 | feature.md | {NAME}-AC-01   |
| {NAME}\_{COMPONENT}\_BR-01 | ui.md      | {NAME}-AC-01   |

## ❓ Open Technical Questions

> Anything unknown/unconfirmed. Raise with the user. `NONE` if all resolved.
