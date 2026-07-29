---
name: x-ng-test-e2e-helper
description: "WHAT? Supplies the workspace conventions for writing or updating a functionality's end-to-end (e2e) tests — which libs get e2e, how `describe` / `it` map to the PRD's Acceptance Criteria (ACs) and the per-app User-Story (US) registry, how to find the target e2e app, and the e2e best-practices (observable-only, hermetic, stable `data-cy`, reuse Page Objects / commands / fixtures), with annotated examples in `assets/examples/`. WHEN? Before writing or updating e2e tests for a `page` lib (or a `feature` lib that initializes another `feature`); when deciding an e2e's target app, US/AC IDs, structure, stubbing, or selectors."
metadata:
  version: '1.0.0'
---

# Test E2e Helper

## Overview

This skill is a **reference**: it puts the workspace's e2e conventions into your context. It **produces nothing** — whoever is doing the work writes the e2e tests, following these conventions.

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

## IDs: `describe` ↔ US, `it` ↔ AC

- **`it` ↔ Acceptance Criterion (AC)** from the functionality's **PRD** (`docs/x/{name}/PRD.md`). Title: `<AC-id> | Given <…>; When <…>; Then <…>`; AAA in the body.
- **`describe` ↔ User Story (US)** from the e2e app's **`apps/{app}-e2e/user-stories.md`** registry. Title: `<US-id> | As a …`. A US groups the ACs a user pursues in one story and **may span functionalities** — which is why USs live in the app registry, not a functionality's PRD. **US IDs are unique per e2e app.**
- **The registry is created/updated by the e2e work, not by this skill.** When the e2e is written, if the story isn't registered a new US is added to `apps/{app}-e2e/user-stories.md` (the file is created if absent) with a fresh unique ID; an existing US is reused if it already fits. See [assets/examples/user-stories.md](assets/examples/user-stories.md) for the format.

## e2e best-practices (and anti-patterns)

- **Assert only user-observable behaviour** — what a user sees in the DOM (via stable `data-cy` selectors), a navigation, or a message. **Never assert internal component state/signals** — that's unit territory; e2e proves the libs cooperate as the user experiences them.
- **Independent & deterministic** — each test sets up its own state and can run alone or in any order; cache the login once and restore it; reset between tests. No test relies on another's side-effects.
- **Hermetic** — stub only the **external boundary** (third-party APIs, config assets) to stay deterministic; **never stub internal app modules** (the app runs for real). Make stubbed responses complete and realistic.
- **Stable selectors** — target the workspace's `data-cy` test-ids (added in the `ui` templates), never CSS classes or visible text.
- **Wait by retrying on observable state**, never fixed sleeps — assert "until visible/exists" so tests don't flake.
- **Reuse the app's e2e support, don't reinvent:**
  - **Page Objects** — one per `page`/`feature` lib under test, keeping its `data-cy` selectors + small helpers in one place (`support/page/*.po.ts`). Prefer a **page-owned readiness anchor** so a feature spec can wait on "the page is ready" without coupling to sibling widgets.
  - **Shared commands / helpers** — reuse setup like login; document each with the JSDoc convention "_(Flow / It) is setup based on: `<lib>` (v#) → `<Component>`_", plus a NOTE explaining any non-obvious flow (`support/commands.ts`).
  - **Fixtures** — shared test data in `src/fixtures/`.

## Examples

The conventions above are shown concretely in [assets/examples/](assets/examples/) — read the relevant one before writing:

- **e2e spec** — [assets/examples/e2e-spec.md](assets/examples/e2e-spec.md): folder/file layout, `describe`(US)/`it`(AC), login, hermetic stubs, observable-only asserts.
- **Page Object** — [assets/examples/page-object.md](assets/examples/page-object.md): `data-cy` selectors + the page-owned readiness anchor.
- **Shared command** — [assets/examples/custom-command.md](assets/examples/custom-command.md): the "…is setup based on…" JSDoc convention + cached login.
- **US registry** — [assets/examples/user-stories.md](assets/examples/user-stories.md): the per-app `user-stories.md` format.

## Confirm the current runner before writing

The examples show the conventions independent of the test runner. Confirm the **current e2e runner** and any project-specific setup by reading the target `{app}-e2e` project's own config and `support/` (commands, Page Objects, fixtures) — the runner is **Cypress today** (re-check; it can change). Follow whatever the current runner and that project establish for setup, stubbing, waiting, and file extensions.

## Common mistakes

| Mistake                                                        | Fix                                                                                     |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Asserting internal component state/signals                     | Assert only what the user observes — DOM via `data-cy`, navigation, messages.           |
| Stubbing internal app modules                                  | Stub only the external boundary; keep the app real.                                     |
| Fixed `wait` / sleep for timing                                | Retry on observable state (until visible / exists).                                     |
| CSS or visible-text selectors                                  | Use the stable `data-cy` test-ids.                                                      |
| Order-dependent tests                                          | Each test sets up its own state; independent & deterministic.                           |
| `describe` / `it` without US / AC IDs                          | `describe = <US-id>` (from the app's `user-stories.md`), `it = <AC-id>` (from the PRD). |
| Duplicating selectors across specs                             | Put them in the lib's Page Object (`support/page/*.po.ts`).                             |
| Writing e2e for a `ui` / `data-access` / self-wiring `feature` | Only `page` libs, and a `feature` that initializes another `feature`.                   |
