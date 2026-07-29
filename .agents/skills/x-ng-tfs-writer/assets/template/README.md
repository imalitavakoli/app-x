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

> Choose exactly one (see `docs/getting-started/library-types-and-their-relationship.md`): **abstract** (map + data-access) · **visual** (ui + feature) · **visual+** (ui + feature + page) · **mixed** (map + data-access + ui + feature) · **mixed+** (map + data-access + ui + feature + page). This decides which sibling `{libtype}.md` files exist.

### Domain

> The functionality's domain (scope). If you cannot infer it from the PRD/context, ask: is it **shared** (usable by any app) or specific to one app in the workspace? A **shared** functionality's libs live under `libs/shared/…`; an app-specific one under `libs/{domain}/…` (the domain is that app's name). The domain is the first segment of every lib name (`{domain}-{type}-ng-{name}`). Library boundaries per domain are enforced in `.eslintrc.json`.

### Rationale

> Why this classification. Name any existing libs reused (so a lib type may be absent because an existing one covers it).

## 🔗 Existing Dependencies & Reuse

> List only libs that **do not belong to this functionality** — i.e. libs from _other_ functionalities/shared infra that this one reuses. Do not list this functionality's own map/data-access/ui/feature/page libs here. Ask the user what to reuse; do not assume. Flag anything recommended-but-not-yet-built with `[RECOMMENDED]` (it needs its own PRD & TFS).

### Used map / data-access libs

> Per lib: name → class/interface → the methods/observables used, and why. Often `NONE` — a functionality's own map/data-access libs do not rely on other functionalities' map/data-access libs (things like the base URL are provided by the calling page/feature, not fetched by depending on the config libs here).

### Used ui / feature / page libs

> Per lib: name → what it provides. `NONE` if none.

### Used util libs

> Per lib: name → the class/function used, and why reuse is appropriate. (Functionalities never own a `util`/`api`/`app` lib — they reuse shared ones.)

## 🧭 ID Index

> Every FR/BR ID in this TFS in one table — the single place that keeps IDs unique across all lib files and preserves PRD ↔ TFS ↔ test traceability. One row per ID; fill it as you write each lib file.

| ID                         | Lib file   | Maps to PRD AC |
| -------------------------- | ---------- | -------------- |
| {NAME}\_{COMPONENT}\_FR-01 | feature.md | {NAME}-AC-01   |
| {NAME}\_{COMPONENT}\_BR-01 | ui.md      | {NAME}-AC-01   |

## ❓ Open Technical Questions

> Anything unknown/unconfirmed. Raise with the user. `NONE` if all resolved.
