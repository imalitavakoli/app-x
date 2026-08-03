---
name: x-ng-test-e2e-helper
description: "WHAT? The workspace conventions for a functionality's end-to-end (e2e) tests — which libs get e2e, the US/AC ID mapping, hermetic stubbing, fixture placement, and selector rules. WHEN? Before writing or updating e2e tests or their fixtures for a `page` lib (or a `feature` lib that initializes another `feature`); when deciding an e2e's target app, US/AC IDs, structure, stubbing, selectors, or where a fixture lives."
metadata:
  version: '1.0.0'
---

# Test E2e Helper

## Overview

This skill is a **helper**: it puts the workspace's e2e conventions into your context. It **produces nothing** — whoever is doing the work writes the e2e tests, following these conventions.

e2e traces to the functionality's **PRD**: **US → `describe`, AC → `it`**. e2e drives the **real app in a real browser** and asserts **only what a user can observe** end-to-end — never internal component state.

## When to use — which libs get e2e

Only libs a user drives end-to-end in a real app:

- **`page`** libs — always (a page composes features into a real screen).
- **`feature`** libs — **only if the feature initializes _another_ `feature` lib** (a cross-functionality interaction worth proving end-to-end). A `feature` that only wires its own `ui` is covered by unit tests, and its composed behaviour is e2e'd via the page that hosts it.
- **Not** `ui` / `map` / `data-access` libs, nor abstract functionalities.

## Find the target e2e app

e2e tests live in the `{app}-e2e` project of the app that **composes** the lib under test:

- A `page` lib → the app whose `src/app/app.routes.ts` loads it.
- A `feature` lib → the app **and page** that initializes it (test it in that composition context).

The lib may be **shared or app-specific** — either way, what matters is which app composes it. Place the spec under `{app}-e2e/src/e2e/page/{page}/`, in a file named after the lib under test, with **no wrapping `describe`** (the file name already names it). If the lib is composed in **more than one app**, ask which app to target.

## Before writing e2e: map external boundaries (hermetic by default)

**Default: hermetic.** e2e must **not** hit real external APIs. Intercept every external network call on the path under test and serve fixtures (or inline stubs). Hit real endpoints **only if the user explicitly asks** for a smoke / live check — never as the normal e2e path.

**Discover what to intercept code-first** — do **not** lead with runtime spying (run app → watch network). A route visit doesn't invent HTTP; the page/feature it loads pulls in `data-access` (and sometimes config assets). Walk that graph:

1. **From the lib under test** (and the page that hosts it), follow into its **`data-access`** (and **`map`** if it shapes requests) — find `HttpClient`, `fetch`, Capacitor HTTP, Firebase, remote config/asset GETs, etc.
2. **Split by when they fire** — **visit/boot** (init, resolvers, guards) vs **action** (only if an AC exercises that click/submit). Stub every call on the path under test.
3. **Reuse what's already there** — existing intercepts / commands / fixtures in that `{app}-e2e` for the same boundary.
4. **Build intercepts + owner-placed fixtures** from that list. Register intercepts **before** `visit` / boot so the app never races the stub. Fixtures must be complete enough for the UI under test to render.
5. **Still unclear?** (opaque SDK, dynamic host only at runtime) → ask the user, or a short exploratory run as a **last resort** — not the default.

Stub **only the external boundary** — never stub internal app modules or sibling libs (the app runs for real).

## Fixtures — place by owner, reuse by reference

Just as a spec/Page Object is placed by _which lib it belongs to_, a **fixture is placed by which lib owns the stubbed data**. Paths stay stable: other specs **reference** that path — they never copy the file and never move it for reuse. All paths are inside the same `{app}-e2e` project, under `src/fixtures/`.

### How to locate a fixture

1. **Already exists?** Search `src/fixtures/` (and existing `fixture:` paths) for the same data. If found → **reference that path**; stop. Do not copy; do not move.
2. **New fixture — who owns it?** The lib that owns the stubbed boundary / domain (usually the lib whose e2e introduces the stub):

| Owner                                              | Path                                              |
| -------------------------------------------------- | ------------------------------------------------- |
| A **`page`** lib                                   | `src/fixtures/page/{page-name}/{name}.json`       |
| A **`feature`** lib                                | `src/fixtures/feature/{feature-name}/{name}.json` |
| **No single owner** (app-wide setup, e.g. session) | `src/fixtures/{name}.json` (flat root)            |

3. **Another lib needs it later?** Keep it where it is; that spec references the existing path (e.g. a page spec may use `fixture: 'feature/x-profile-info/users.json'`). Location does **not** change when reuse appears.

**Naming `{page-name}` / `{feature-name}`:** use the same short name as that lib's spec / Page Object — drop the **scope** (`shared-` / app-domain), **lib-type** (`page-` / `feature-`), and **technology** (`ng-`, …) prefixes. An Angular e2e app only hosts Angular libs, so the tech prefix is noise. e.g. `shared-feature-ng-x-profile-info` → `x-profile-info` → `src/fixtures/feature/x-profile-info/users.json`.

**Owner, not consumer.** A feature-owned fixture stays under `feature/{feature-name}/` even when a page composes that feature or other specs reference it. Flat root is only for data with **no** owning page/feature lib.

## IDs: `describe` ↔ US, `it` ↔ AC

- **`it` ↔ Acceptance Criterion (AC)** from the functionality's **PRD** (`docs/x/{name}/PRD.md`). Title: `<AC-id> | Given <…>; When <…>; Then <…>`; AAA in the body.
- **`describe` ↔ User Story (US)** from the e2e app's **`apps/{app}-e2e/user-stories.md`** registry. Title: `<US-id> | As a …`. A US groups the ACs a user pursues in one story and **may span functionalities** — which is why USs live in the app registry, not a functionality's PRD. **US IDs are unique per e2e app.**
- **The registry is created/updated by the e2e work, not by this skill.** When the e2e is written, if the story isn't registered a new US is added to `apps/{app}-e2e/user-stories.md` (the file is created if absent) with a fresh unique ID; an existing US is reused if it already fits. See [assets/examples/user-stories.md](assets/examples/user-stories.md) for the format.

## e2e best-practices (and anti-patterns)

- **Assert only user-observable behaviour** — what a user sees in the DOM (via stable `data-cy` selectors), a navigation, or a message. **Never assert internal component state/signals** — that's unit territory; e2e proves the libs cooperate as the user experiences them.
- **Independent & deterministic** — each test sets up its own state and can run alone or in any order; cache the login once and restore it; reset between tests. No test relies on another's side-effects.
- **Hermetic by default** — no real external APIs; intercept + fixtures for every external call on the path under test (see [map external boundaries](#before-writing-e2e-map-external-boundaries-hermetic-by-default)). Real endpoints only when the user explicitly asks for smoke. **Never stub internal app modules** — the app runs for real. Make stubbed responses complete and realistic.
- **Stable selectors** — target the workspace's `data-cy` test-ids (added in the `ui` templates), never CSS classes or visible text.
- **Wait by retrying on observable state**, never fixed sleeps — assert "until visible/exists" so tests don't flake.
- **Reuse the app's e2e support, don't reinvent:**
  - **Page Objects** — one per `page`/`feature` lib under test, keeping its `data-cy` selectors + small helpers in one place (`support/page/*.po.ts`). Prefer a **page-owned readiness anchor** so a feature spec can wait on "the page is ready" without coupling to sibling widgets.
  - **Shared commands / helpers** — reuse setup like login; document each with the JSDoc convention "_(Flow / It) is setup based on: `<lib>` (v#) → `<Component>`_", plus a NOTE explaining any non-obvious flow (`support/commands.ts`).
  - **Fixtures** — test data in `src/fixtures/`, placed by owner; reuse by path reference (see [Fixtures — place by owner, reuse by reference](#fixtures--place-by-owner-reuse-by-reference)).

## Examples

The conventions above are shown concretely in [assets/examples/](assets/examples/) — read the relevant one before writing:

- **e2e spec** — [assets/examples/e2e-spec.md](assets/examples/e2e-spec.md): folder/file layout, `describe`(US)/`it`(AC), login, hermetic intercepts (code-first boundaries), observable-only asserts.
- **Page Object** — [assets/examples/page-object.md](assets/examples/page-object.md): `data-cy` selectors + the page-owned readiness anchor.
- **Shared command** — [assets/examples/custom-command.md](assets/examples/custom-command.md): the "…is setup based on…" JSDoc convention + cached login.
- **Fixtures** — [assets/examples/fixtures.md](assets/examples/fixtures.md): owner-based `src/fixtures/` layout + a sample fixture referenced from a spec.
- **US registry** — [assets/examples/user-stories.md](assets/examples/user-stories.md): the per-app `user-stories.md` format.

**Handing one to a subagent?** These files live under `.agents/skills/x-ng-test-e2e-helper/assets/examples/` — give that full path. An execution agent resolves paths against the repo root and cannot read this skill, so the skill-relative paths above mean nothing to it.

## Confirm the current runner before writing

The examples show the conventions independent of the test runner. Confirm the **current e2e runner** and any project-specific setup by reading the target `{app}-e2e` project's own config and `support/` (commands, Page Objects, fixtures) — the runner is **Cypress today** (re-check; it can change). Follow whatever the current runner and that project establish for setup, stubbing, waiting, and file extensions.

## Common mistakes

| Mistake                                                        | Fix                                                                                                                                                                                 |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asserting internal component state/signals                     | Assert only what the user observes — DOM via `data-cy`, navigation, messages.                                                                                                       |
| Stubbing internal app modules                                  | Stub only the external boundary; keep the app real.                                                                                                                                 |
| Hitting real external APIs in normal e2e                       | Hermetic by default — intercept + fixtures. Real endpoints only if the user asks for smoke.                                                                                         |
| Leading with runtime network spying to find what to stub       | Map boundaries code-first from the page/feature → `data-access` / `map`; spy only as last resort.                                                                                   |
| Intercept registered after `visit`                             | Register intercepts before visit/boot so the app never races the stub.                                                                                                              |
| Fixed `wait` / sleep for timing                                | Retry on observable state (until visible / exists).                                                                                                                                 |
| CSS or visible-text selectors                                  | Use the stable `data-cy` test-ids.                                                                                                                                                  |
| Order-dependent tests                                          | Each test sets up its own state; independent & deterministic.                                                                                                                       |
| `describe` / `it` without US / AC IDs                          | `describe = <US-id>` (from the app's `user-stories.md`), `it = <AC-id>` (from the PRD).                                                                                             |
| Duplicating selectors across specs                             | Put them in the lib's Page Object (`support/page/*.po.ts`).                                                                                                                         |
| Dumping every fixture flat / copying for reuse                 | Place under the owning lib (`page/{page-name}/` or `feature/{feature-name}/`); flat root only when there's no owner. Other specs reference the path — never copy or move for reuse. |
| Writing e2e for a `ui` / `data-access` / self-wiring `feature` | Only `page` libs, and a `feature` that initializes another `feature`.                                                                                                               |
