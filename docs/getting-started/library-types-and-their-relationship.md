[🔙](../../README.md#getting-started)

# Library types & their relationship 📚

Nx module boundaries (`@nx/enforce-module-boundaries` in `.eslintrc.json`) control which libs may depend on which others. Each lib declares tags in its `project.json` (e.g. `["type:feature", "domain:shared"]`). This workspace uses **two** tag dimensions:

| Dimension  | Meaning                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **domain** | Horizontal slice — which app the lib belongs to (one domain per app + `shared`). `shared` libs may be imported from any domain. |
| **type**   | Vertical slice — the lib's responsibility (the eight library types below).                                                      |

A functionality belongs to **one** domain (the same dimension as its owned libs). Its PRD and TSD live at `docs/x/{domain}/{name}/`.

**Tip!** Inspired by Nx [Library Types](https://nx.dev/concepts/more-concepts/library-types) and [Using Nx at Enterprises](<https://nx.dev/concepts/more-concepts/monorepo-nx-enterprise#type-(what-is-in-the-library)>).

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Library type vs functionality type

|                       | **Library type**                                                    | **Functionality type**                                          |
| --------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------- |
| **What it describes** | What a **single** lib is allowed to do                              | A **product feature** made of one or more libs working together |
| **Values**            | `api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app` | `abstract`, `visual`, `visual+`, `mixed`, `mixed+`              |
| **PRD / TSD**         | Not by themselves                                                   | Yes — under `docs/x/{domain}/{name}/` for functionalities only  |

**PRD and TSD exist only for functionalities.** They do **not** exist for a bare library that is not a functionality.

- `util`, `api`, and `app` **never** form a functionality — alone or as part of one. Editing one of these does **not** call for a PRD or TSD.
  - `util` / `api` — supporting libs (utilities / proxy doors).
  - `app` — a final product under `apps/`, not a functionality and not a reusable lib.
- `data-access`, `ui`, `feature`, and `page` **can** each be a functionality on their own, or part of a larger one — then PRD/TSD **do** apply — **but only when the lib is single-purpose**. A **grab-bag** `ui` or `feature` lib is never a functionality; see [Single-purpose vs grab-bag](#single-purpose-vs-grab-bag).
- `map` is never a functionality by itself: if present, it always sits under an `abstract` / `mixed` / `mixed+` functionality together with `data-access`.

Before writing or updating a PRD/TSD, ask: _"Is this a functionality (a product feature), or just a lib?"_ If it is only a `util`, `api`, or `app` lib — or a **grab-bag** `ui` / `feature` lib — stop; no functionality docs.

Details and valid shapes: [Functionality types](#functionality-types).

&nbsp;

### Single-purpose vs grab-bag

Two shapes of the same library type. Only the first can be a functionality.

|                                     | **Single-purpose**                                                             | **Grab-bag**                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **What it holds**                   | one product concern — everything in the lib serves it                          | several unrelated items sharing only a technical kind (directives, pipes, animations)               |
| **Version folders** (shared domain) | the whole lib versions as one unit — `src/lib/v1/`                             | each item versions on its own — `src/lib/toggle-me-v1/`                                             |
| **Examples**                        | `shared-ui-ng-popup`, `shared-feature-ng-x-profile-info`                       | `shared-ui-ng-directives`, `shared-ui-ng-pipes`                                                     |
| **A functionality?**                | **yes** — PRD + TSD under `docs/x/{domain}/{name}/`                            | **no** — it is shared infrastructure                                                                |
| **Requirements live in**            | `docs/x/{domain}/{name}/PRD/README.md` + `docs/x/{domain}/{name}/TSD/`         | a `requirements/` folder (`README.md` + `DECISIONS.md`) beside **each item’s** inner version README |

**The test:** does the lib have **one** product concern, or is it a bucket of unrelated items that merely share a mechanism? For a **shared** lib the folder shape is the tell — independently versioned items _are_ independent concerns. **App-domain** libs have no version folders ([Versioning shared libs](#versioning-shared-libs)), so apply the concern test directly.

**Only three lib types can be a grab-bag: `util`, `ui`, `feature`.** A `map` and a `data-access` are bound to one functionality by construction, and a `page` is one screen — so never ask the question for those.

**A `util` may be either shape, and it changes nothing:** a `util` is never a functionality either way, and its `requirements/` folder already lives beside the **inner version README** — which resolves per item for a grab-bag (`formatters/src/lib/date-v1/requirements/`) and per lib for a single-purpose one (`ng-capacitor/src/lib/v1/requirements/`). The distinction matters only for `ui` and `feature`, where it decides whether the lib is a functionality at all.

**Why a grab-bag is not a functionality:** a single PRD would have to state Acceptance Criteria spanning every unrelated item in the bucket — that documents a container, not a product feature. Its items are verified by unit tests against the local `requirements/` registry (`UI-…` / `FEA-…` IDs), and a grab-bag never gets e2e.

**Adding an item to a grab-bag never creates a functionality.** A new directive in `shared-ui-ng-directives` is a new version folder plus its `requirements/` registry — not a new `docs/x/` folder, and not a reason to split the lib.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Quick decision cheat-sheet

- Outside world (HTTP, JSON assets, etc.) → `map` fetches → `data-access` stores. Never put that in `util` or a random service.
- Need data another functionality owns → import that family's `data-access` (not its `map` to call methods).
- `util` needs `data-access` or `feature` → prefer input/arg; if it must import, go through an `api` re-export lib.
- URL query params and route navigation → `page` only; pass values down via inputs.
- Using a functionality as a whole → import its [natural entry lib](#natural-entry-lib).
- PRD/TSD → functionalities only (see above).

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Types

Eight library types, in three groups:

| Group        | Types                        | Responsibility                      |
| ------------ | ---------------------------- | ----------------------------------- |
| **Abstract** | `util`, `map`, `data-access` | Hold logic mostly                   |
| **Visual**   | `ui`, `feature`, `page`      | Represent something visually mostly |
| **Root**     | `api`, `app`                 | Connect or bootstrap everything     |

Sections below follow dependency order (light → composed), then `api` as the boundary escape hatch.

&nbsp;

### Import matrix

What each type **may import** — matches `@nx/enforce-module-boundaries` in `.eslintrc.json`. Rows = consumer; columns = dependency.

| Consumer ↓ / may import → | util | map | data-access | ui  | feature | page | api |
| ------------------------- | :--: | :-: | :---------: | :-: | :-----: | :--: | :-: |
| **util**                  |  ✓   | ✓³  |     —¹      |  —  |   —¹    |  —   |  ✓  |
| **map**                   |  ✓   | ✓³  |      —      |  —  |    —    |  —   |  —  |
| **data-access**           |  ✓   | ✓⁴  |      ✓      |  —  |    —    |  —   |  —  |
| **ui**                    |  ✓   | ✓³  |      —      |  ✓  |    —    |  —   |  —  |
| **feature**               |  ✓   | ✓³  |      ✓      |  ✓  |    ✓    |  —   |  —  |
| **page**                  |  ✓   | ✓³  |      ✓      |  ✓  |    ✓    |  ✓²  |  —  |
| **app**                   |  ✓   | ✓³  |      ✓      |  ✓  |    ✓    |  ✓   |  —  |
| **api**                   |  —   | ✓³  |      ✓      |  ✓  |    ✓    |  ✓   |  —  |

¹ `util` must not import `data-access` or `feature` **directly**. Prefer an input/method argument; if an import is required, expose symbols via an `api` lib, then import that `api` lib.  
² Prefer keeping child routes inside the same `page` lib; importing another `page` is the rare exception (see [Reuse](#reuse-across-functionalities)).  
³ **Types only.** Importing a `map` here means reading its interfaces/types — **not** calling its methods or hitting its API/asset loaders. A `map` importing another `map` is the same: shared types, not another endpoint.  
⁴ **Runtime.** Only `data-access` imports `map` to initialize it and call its methods (fetch / load). Each `map` has a related family `data-access` that owns that; other libs reach the data through that `data-access`, not by driving the `map` themselves.

No type may import `app` via these tags (`app` lives under `apps/` and consumes libs, not the other way around).

&nbsp;

### Cross-cutting contracts

**Fetching from the outside world** — Loading JSON, calling API endpoints, or otherwise fetching from the outside world MUST go through Abstract libs: `map` → `data-access`. `map` fetches (and maps if needed); `data-access` stores and exposes the data. NEVER put that fetching in a plain TS class/service, and NEVER create a `util` lib for it.

**Who may call a `map`** — Only that map's related family `data-access` initializes the `map` and calls its methods. Every other type that imports `map` (including another `map`, `util`, `ui`, `feature`, `page`, `app`, `api`) does so for **types/interfaces only**. Need the data elsewhere → import the owning `data-access`, not the `map` for runtime calls. (Same idea across functionality families — see [Reuse](#reuse-across-functionalities).)

**`page` exclusive ownership** — Only `page` libs may (1) navigate to app routes and (2) read URL Query Params. NEVER read query params in `feature` or `ui` — read them in the `page` and pass values down through inputs. `feature` libs may emit outputs; the page listens and navigates.

**`api` proxy** — An `api` lib has almost no implementation: its `src/index.ts` imports a small set of symbols from another lib and re-exports them. Naming often mirrors the proxied lib (e.g. `shared-api-data-access-ng-auth` → `@x/shared-data-access-ng-auth`, or `shared-api-feature-ng-x-users` → `@x/shared-feature-ng-x-users`). See `libs/shared/api/`.

&nbsp;

### 'util' type

|                 |                                                                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**        | Low-level utilities used by many libs and apps.                                                                                                                                                          |
| **May import**  | `util`, `map` (types only), `api`                                                                                                                                                                        |
| **Owns / does** | Services; non-UI vanilla JS helpers (e.g. format dates, detect device); wrappers around utility services or third-party utility classes (e.g. Capacitor plugin classes) so others depend on our wrapper. |
| **Must not**    | Import `data-access` or `feature` directly; call `map` methods / own outside-world fetching (use the `map` → `data-access` funnel).                                                                      |

**Notes**

- Prefer accepting a `data-access` / `feature` dependency as an input or method argument when that is enough.
- If the `util` lib must import one, first expose the needed symbols through an `api` lib (re-export only what is required), then import that `api` lib.

&nbsp;

### 'map' type

|                 |                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**        | Interact with back-end or external resources; optionally map fetched shapes for consumers.                                                                                         |
| **May import**  | `util`, `map` (types only from other maps)                                                                                                                                         |
| **Owns / does** | Load external resources (e.g. JSON); map object structures (sometimes with `util` help) so they satisfy `ui` inputs; hold Map interfaces (`lib-name.interfaces.ts`) for consumers. |
| **Must not**    | Store app/feature state (that is `data-access`); call another `map`'s methods / endpoints (import other maps for shared types only).                                               |

**Notes**

- Maps prepare structures for presentation; the related family `data-access` is the only lib that initializes this `map` to fetch and then stores the result.

&nbsp;

### 'data-access' type

|                 |                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**        | State management and data-access services for an app, `page`, or `feature`.                                                                       |
| **May import**  | `util`, `map` (runtime — call methods), `data-access`                                                                                             |
| **Owns / does** | NgRx-related state; initializes its related `map` libs to fetch; may hold guards, interceptors, and similar (beside `+state`).                    |
| **Must not**    | Skip `map` when talking to the outside world (use the fetch funnel); initialize another family's `map` (use that family's `data-access` instead). |

**Notes**

- Generate guards/interceptors inside `data-access` libs — they often need heavy data access.
- Local/device async (Local Storage, SQLite, etc.) can live here without a `map`; HTTP/assets still go `map` → `data-access`.
- This is the **only** lib type that imports `map` to call API/asset methods — not merely for types.

&nbsp;

### 'ui' type

|                 |                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Role**        | Presentational only — stylesheets, presentational components, directives, pipes (or plain `.css` / `.scss` libs).            |
| **May import**  | `util`, `map` (types only), `ui`                                                                                             |
| **Owns / does** | Receive inputs and render UI; may import `map` interfaces for input types; may hold mocks (`lib-name.mocks.ts`) for testing. |
| **Must not**    | Access data sources / `data-access`; read URL Query Params.                                                                  |

&nbsp;

### 'feature' type

|                 |                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------- |
| **Role**        | Smart components for an independent functionality — access data via `data-access`, render via `ui`. |
| **May import**  | `util`, `map` (types only), `data-access`, `ui`, `feature`                                          |
| **Owns / does** | Initialize `ui` in templates and `data-access` in TS; pass real data into `ui` inputs.              |
| **Must not**    | Import `page` or `api`; read URL Query Params; navigate routes (page owns that).                    |

**Notes**

- May use `data-access` libs whose state is already provided as the app Root Store or a page Feature Store.

&nbsp;

### 'page' type

|                 |                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Role**        | App pages — compose multiple `feature` libs into a larger surface.                                                                                                                         |
| **May import**  | `util`, `map` (types only), `data-access`, `ui`, `feature`, `page`                                                                                                                         |
| **Owns / does** | May use `data-access`; read URL Query Params and pass them down as inputs; navigate routes in response to `feature` outputs. Usually app-specific (e.g. `libs/ng-boilerplate/page/home/`). |
| **Must not**    | Import `api`; be imported by other libs as “the page” — only the app route file wires a page in (see below).                                                                               |

**Notes**

- Wired into an app **only** from that app's route file — e.g. `apps/{app-name}/src/app/app.routes.ts` (`loadChildren` / exported routes). Nested/child routes may live inside the page lib; the app route file remains the sole outside entry.
- Usually no need to import other `page` libs; keep child pages inside the same lib when possible.

&nbsp;

### 'app' type

|                 |                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| **Role**        | Final products under `apps/` — buildable/deployable applications that compose functionalities for end users.  |
| **May import**  | `util`, `map` (types only), `data-access`, `ui`, `feature`, `page`                                            |
| **Owns / does** | Bootstrap and compose; carries `type:app` so boundaries treat it like other types.                            |
| **Must not**    | Import `api`; be treated as a reusable functionality lib or as something that gets a PRD/TSD under `docs/x/`. |

**Notes**

- Conceptually apps, not libs — the tag is a workspace convention for module boundaries.

&nbsp;

### 'api' type

|                 |                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Role**        | Thin proxy that re-exports a few symbols so a consumer can work around a type-boundary limit.                                |
| **May import**  | `map` (types only), `data-access`, `ui`, `feature`, `page`                                                                   |
| **Owns / does** | Almost no implementation — `src/index.ts` import + re-export only (see [Cross-cutting contracts](#cross-cutting-contracts)). |
| **Must not**    | Hold real business logic or become a dumping ground; import `util` or other `api` libs.                                      |

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Functionality types

A **functionality** is a product feature built for our applications. It is classified into one of the types below and is made of one or more lib types from the Abstract and/or Visual groups (`map`, `data-access`, `ui`, `feature`, `page`) — each of them **single-purpose**; a [grab-bag](#single-purpose-vs-grab-bag) `ui` / `feature` lib is never part of a functionality.

Example — a `profile` functionality for **Angular** (`ng` in the lib names), shared domain, might look like:

- `shared-map-ng-profile`
- `shared-data-access-ng-profile`
- `shared-ui-ng-profile`
- `shared-feature-ng-profile`
- `shared-page-ng-profile`

Lib names are technology-specific (`ng` = Angular). The same functionality on another stack would use that technology's segment instead.

Library type vs functionality type (PRD/TSD rules): see [Library type vs functionality type](#library-type-vs-functionality-type).

**Functionalities must not have their own `util`, `api`, or `app` libs** (libs named after the functionality). Reuse existing `util` libs; `api` libs are proxies only; `app` libs are the products that combine functionalities.

**Pages:** In most cases a functionality does not have its own `page` lib (pages compose multiple functionalities). If the functionality _is_ an entire page (e.g. a profile-only page), a `shared-page-ng-profile` lib is fine.

&nbsp;

### Natural entry lib

When another lib wants to _use_ a functionality as a whole (dispatch, select state, render its smart component / page, etc.), it should import that functionality's **natural entry lib** — the lib type that represents the functionality for interaction.

That does **not** forbid other imports from the same family (e.g. reading `map` interfaces for typing). Entry is about _using_ the functionality, not every possible import.

When the natural entry is `page`, the **only** consumer that imports it to use the functionality as a whole is an **app's route file** (e.g. `apps/{app-name}/src/app/app.routes.ts`) — not another lib.

| Functionality type | Typical shape (shorthand)                                              | Natural entry                   |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------- |
| **abstract**       | `data-access` · optional `map`                                         | `data-access`                   |
| **visual**         | `ui` and/or `feature` · no `page`                                      | `feature` if present, else `ui` |
| **visual+**        | `page` · optional `ui` / `feature`                                     | `page`                          |
| **mixed**          | required `data-access` + `feature` · optional `map` / `ui` · no `page` | `feature`                       |
| **mixed+**         | required `page` + `data-access` · optional `map` / `ui` / `feature`    | `page`                          |

&nbsp;

### 'abstract' type

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Shape**         | Abstract-group libs only — `data-access`, and optionally `map`. |
| **Valid**         | `data-access` only · `map` + `data-access`                      |
| **Natural entry** | `data-access`                                                   |

**Notes**

- `data-access` alone is fine when effects do not call APIs or load external assets (e.g. Local Storage, SQLite).
- If there is a `map` (API or asset), there **must** also be a `data-access` to store the fetched data.

&nbsp;

### 'visual' type

|                   |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| **Shape**         | Visual-group libs — `ui` and/or `feature` — **without** a `page`. |
| **Valid**         | `ui` only · `feature` only · `ui` + `feature`                     |
| **Natural entry** | `feature` if present; else `ui`                                   |

**Notes**

- `ui` only — presentational piece reused by different `feature` libs.
- `feature` only — smart lib that uses `data-access` libs from other (typically abstract) functionalities and `ui` libs from other `ui`-only functionalities (see [Reuse across functionalities](#reuse-across-functionalities)).

&nbsp;

### 'visual+' type

|                   |                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Shape**         | Same idea as `visual`, but **includes a `page`**.                                                                                      |
| **Valid**         | `page` only · `page` + `ui` · `page` + `feature` · `page` + `ui` + `feature`                                                           |
| **Natural entry** | `page` (import only from an app's route file when using as a page; optional `feature` / `ui` may still be imported for partial reuse). |

&nbsp;

### 'mixed' type

|                   |                                                                             |
| ----------------- | --------------------------------------------------------------------------- |
| **Shape**         | Owns its data **and** must represent it — not a full page (no `page`).      |
| **Required**      | `data-access` + `feature`                                                   |
| **Optional**      | `map` (same rule as `abstract`) · `ui` (or reuse `ui`-only functionalities) |
| **Natural entry** | `feature`                                                                   |

&nbsp;

### 'mixed+' type

|                   |                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shape**         | Owns its data **and** exposes it as a **page**.                                                                                               |
| **Required**      | `page` + `data-access`                                                                                                                        |
| **Optional**      | `map`, `ui`, and/or `feature` (same optional rules as `mixed` / `visual+`)                                                                    |
| **Natural entry** | `page` (import only from an app's route file when using as a page; other libs of this functionality may still be imported for partial reuse). |

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Reuse across functionalities

The [import matrix](#import-matrix) says what a lib **may** import by type. This section answers a narrower question: what a lib may import **from another functionality's family** — the libs named after a different functionality.

**Why ESLint cannot enforce this.** `@nx/enforce-module-boundaries` matches tags in each `project.json`, and we tag only `_type_` and `_domain_`. Neither encodes **functionality family**, and we deliberately do not add a third dimension (one rule per family forever). Even then, some rules below cannot be expressed as project edges (type-only vs runtime import; “from the app route file” vs “anywhere in the app”). **So these are conventions: humans and agents enforce them, not lint.**

### What may be reused

| Lib type      | May a **different** functionality import it?                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `data-access` | **Yes** — sanctioned reuse point for owned data. A `feature` or `page` may initialize several `data-access` libs from different families. |
| `feature`     | **Yes** — natural entry of `visual` / `mixed` functionalities.                                                                            |
| `ui`          | **Only if its own family is `ui`-only** (a `visual` functionality with no `feature`). A `ui` beside its family's `feature` is private.    |
| `map`         | **Types only.** Reading interfaces for typing is fine; **initializing** (calling methods) from another family's `data-access` is not.     |
| `page`        | **No** — only an app's route file, and as the one exception another `page` lib (see below).                                               |

**`ui` — why "`ui`-only".** A `ui` built beside a `feature` was shaped for that feature's data and lifecycle; it is part of that functionality. A `ui` that **is** the whole functionality was built to be reused.

**`map` — why types are fine but initialization is not.** Every `map` has its family `data-access`, which is the only lib that should call that `map`'s methods. Do **not** add a facade that calls another family's endpoint from your `data-access`. `feature` / `page` can initialize several `data-access` libs instead. Reading `map` interfaces from any allowed consumer stays fine — see [Who may call a `map`](#cross-cutting-contracts) and [Natural entry lib](#natural-entry-lib).

**`page` — the one exception.** Other functionalities are imported **into** pages, never the other way round. The single exception is another `page` lib: a page usually keeps child routes inside itself, but knowingly importing a separate `page` lib is allowed.

### When reuse is blocked, offer a way forward

Wanting a private `ui` or to initialize another family's `map` means something reusable is trapped inside a family — not that the author is careless. Work down this ladder; stop at the first rung that applies:

**0. A legal route already exists — take it.**

- Need data another family owns → import that family's `data-access`.
- Need a presentational piece that already lives in a `ui`-only functionality → import it.

**1. Refactor now — extract what is genuinely shared.** (Need is real today — YAGNI is satisfied.)

- **Presentation trapped in a family** → split into its own `ui`-only `visual` functionality; import from both families.
- **Endpoint trapped in a non-abstract family** → if already `abstract`, use rung 0. If not, extract `map` + `data-access` into its own `abstract` functionality.

Cost: touches an existing family and its `docs/x/{domain}/{name}/` PRD & TSD.

**2. Duplicate, and skip the refactor.** Build the equivalent inside the functionality being worked on — deliberate trade: lighter change now, two implementations that can drift.

Rung 1 versus rung 2 is the author's call. The blocked import itself is not: it stays blocked either way.

&nbsp;

[🔝](#library-types--their-relationship-📚)

## Versioning shared libs

Always keep shared-library code in versioned folders, e.g. `libs/shared/util/{lib-name}/src/lib/{version}`.

**How to export** — Prefer putting the version in the exported symbol names themselves (e.g. `V1PopupComponent`, `V1ToggleMeDirective`, selectors `x-popup-v1`, `xToggleMeV1`). Avoid `export * as V1NAME from './lib/v1/...'` because: (1) symbols cannot be imported individually under the alias, (2) aliased imports cannot be used directly in HTML templates, (3) components/directives/pipes cannot be exported under an alias, which forces two import styles.

**Important!** If you do use an alias export anyway, search the workspace first — alias names MUST be unique.

Folder names may be `v1` / `v2`, or `name-v1` / `my-thing-v2`, depending on what the lib holds. A grab-bag lib like `shared-ui-ng-directives` may use per-directive folders (`toggle-me-v1`); a single-purpose lib like `ng-popup` uses `v1`, `v2`, etc.

**Why version** — Shared libs from different authors update irregularly; a breaking change can break many dependents. Versioning lets existing consumers keep working while new work adopts a newer version. Workspace/pnpm upgrades are usually smoother; shared libs are the risky layer.

**When to bump vs edit in place** — In the Nx Graph, focus the lib. If ≤ 3 dependents, you may update with breaking changes and fix those dependents. Otherwise create a new version.

**What “v1” means** — Not necessarily an upstream package version. It means “first behaviour of this kind we use in the workspace.”

**Tip!** App-specific libraries do **not** need the versioning folder structure — they belong to an app domain, and apps have their own versions.

&nbsp;

[🔝](#library-types--their-relationship-📚)
