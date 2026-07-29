<!--
Template for `docs/x/{name}/TFS/page.md` — the `page` lib spec + its FR/BR.
Include this file only for visual+ / mixed+ functionalities. Lib name: `{domain}-page-ng-{name}`.
Remove `>` helpers from the final draft. Register every FR/BR ID in the README's 🧭 ID Index.
-->

### 📄 'page' Library Specification

> A `page` composes `feature` libs and owns routing. Inputs arrive as **URL query params**. For naming and folder structure, follow the workspace's canonical `page`-lib reference (parent + child route components, a `lib.routes.ts`, versioned selectors).

#### Lib Name

`{domain}-page-ng-{name}`

#### Routes

> The lib's `lib.routes.ts`: parent route + child routes. Child page components are named by responsibility — one of `V1{Name}AllPageComponent`, `V1{Name}NewPageComponent`, `V1{Name}OnePageComponent`, `V1{Name}EditPageComponent`.

#### Parent Page: `V1{Name}PageComponent`

```ts
@Component(...)
export class V1{Name}PageComponent extends V2BasePageParentComponent {}
```

> Required URL query params (`_xHasRequiredInputs`); **starter libs** (which `feature` must be ready before others — `_xHasInitStarterLibs` / `onReadyStarterLibN`); child routes gated by starter-ready flags; error aggregation (`$errors` / `xOnError`); navigation handled here in response to `feature` outputs.

#### Child Pages: `V1{Name}{All|New|One|Edit}PageComponent`

```ts
@Component(...)
export class V1{Name}OnePageComponent extends V2BasePageChildComponent {}
```

> Per child: `_pageName` / `_urlRoot`, `$id` (from route param, for One/Edit), which `feature`(s) it composes, and `xOnError` (forwards to the parent via the communication service).

#### Functional Requirements & Business Rule Breakdown

> Page-level FR/BR: required-param gating, navigation on `feature` outputs, starter-lib ordering, error aggregation. Back-link PRD ACs (esp. navigation/route ACs). New unique IDs.
