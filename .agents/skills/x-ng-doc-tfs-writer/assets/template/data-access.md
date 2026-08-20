<!--
Template for `docs/x/{name}/TFS/data-access-v{n}.md` (a **shared** lib is versioned, so the version is in the filename; an **app-domain** lib is unversioned and keeps the plain name) — the `data-access` lib spec + its FR/BR.
A `map` lib ALWAYS has a sister `data-access` lib, so include this whenever this functionality OWNS a map lib.
Ownership decides the file set — never include this because a REUSED lib has a map/data-access pair.
For an ABSTRACT functionality (no feature/ui), also add the short facade-consumer note at the end.
Lib name: `{domain}-data-access-ng-{name}`. Remove `>` helpers from the final draft.
Register every FR/BR ID in the README's 🧭 ID Index.
-->

### 🗄️ 'data-access' Library Specification

- **Last Updated** (YYYY-MM-DD): {date}
- **Last Verified** (YYYY-MM-DD): {date}

> **`Last Verified` is per file, deliberately.** Whoever checks these specs against the shipped code walks only the lib files a change actually touched, and stamps only those — so a file still showing an older date is honestly reporting that nobody has re-checked it since. Never stamp a file you did not read, and never bulk-update these across the folder.

> `data-access` initializes `map` methods and holds the result.

#### Lib Name

`{domain}-data-access-ng-{name}`

#### Object Structure

> Choose the structure and justify it:
>
> - **entity** — classic NgRx entity-adapter CRUD (`getAll`/`addOne`/`updateOne`/`removeOne`, `selectedEntity$`, `loaded$`). **Only for a PURE CRUD operation.**
> - **single-instance** — cache-aware, one state object; facade methods take no instance id (`getX(url, …)`, `datas$`/`loadeds$`/`errors$`, `reset()`). Use when the lib is **initialized once per page**.
> - **multi-instance** — cache-aware, instance-keyed via an adapter; `createIfNotExists(id)` then `getX(url, …, id)`, `entityDatas$(id)`/`entityLoadeds$(id)`/`entity$(id)`, `reset(id)`/`resetAll()`. Use when the lib is **initialized multiple times** (by the page, or by several `feature` libs at once).
>
> **Note!** If a Post/Put/Patch must send an `extra` payload **beyond the entity itself** (because that is how the API is designed), it is **not** pure CRUD — use **single-** or **multi-instance** (cache-aware, explicit actions), not the entity structure.

#### Facade API

> The full public surface: every `get*` and mutation (`patch*`/`post*`/`put*`/`delete*`) method AND every observable consumers use (list them all). Cache-aware libs share a common set — the `get*`/mutation dispatchers, resolved observables (`datas$`, `loadeds$`, `errors$`, `hasError$` and their narrow per-key selectors), and cache controls (`configureTtl`, `cacheInvalidate`, `cacheMask`, `reset`); the exact set varies by structure (single-/multi-instance/entity). For the precise per-structure surface, follow the workspace's canonical lib-structure reference.
>
> **Mutations (cache-aware libs):** in a single-/multi-instance lib, a write (`patch*`/`post*`/`put*`/`delete*`) that re-defines a `get*` data-key is declared in the reducer's `CACHE_INVALIDATION_MAP` and applied via `v1BaseReducerInvalidate`, so the next read of that key refetches (its effect uses `concatMap` → `success`/`failure` with an empty `cacheKey`, not the cache-run helper). By contrast, an entity-structure lib expresses writes as the entity adapter's own CRUD ops (`addOne`/`updateOne`/`removeOne`). Note: which structure to use is decided solely by the pure-CRUD test in **Object Structure** above — not by whether the lib has mutations.

#### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. FRs/BRs for the state transitions (loading → data / error, cache behaviour), in `Given/When/Then`. Back-link PRD ACs where relevant.

#### Consumer usage (abstract functionalities only)

> **Include this heading only for an abstract functionality** (no `feature-v{n}.md`). A short note on how a consumer (a page or `feature` component) uses the facade — which methods to call, in what order, and which observables to subscribe to (typically: reset → `getX()` in `_xDataFetch` → await `…Loaded$` → read `…Data$`). Omit this heading entirely when the functionality has a `feature-v{n}.md`.
