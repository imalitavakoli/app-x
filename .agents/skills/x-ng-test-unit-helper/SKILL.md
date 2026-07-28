---
name: x-ng-test-unit-helper
description: "WHAT? Supplies the workspace conventions for writing or updating a lib's Jest unit tests — how `describe` / `it` map to the functionality's TFS Functional-Requirement (FR) and Business-Rule (BR) IDs, what `jest.preset.js` already provides (so specs don't re-stub native modules or crash), and the comment-divider / Given-When-Then / AAA formatting, with an annotated example in `assets/examples/`. WHEN? Before writing or updating any `*.spec.ts` unit test for a map / data-access / ui / feature lib — or for a component or service inside one; when deciding a spec's IDs, structure, native/Capacitor/Firebase mocking, or readability."
metadata:
  version: '1.0.0'
---

# Test Unit Helper

## Overview

This skill is a **reference**: it puts the workspace's unit-test conventions into your context. It **produces nothing** — whoever is doing the work writes the tests, following these conventions.

Unit tests trace to the functionality's **TFS**: **FR → `describe`, BR → `it`**.

It only adds **workspace specifics** (TFS IDs, test config, formatting) on top of good unit-testing practice. For _how_ to write the tests themselves, follow standard **TDD**: test real, observable behavior — **never assert on a mock** — and mock only what is unavoidable, at the lowest level, keeping mocks complete.

## When to use

Writing or updating a `*.spec.ts` for any testable TypeScript/JavaScript in a workspace lib (`map` / `data-access` / `ui` / `feature` / `page`) — a component, service, directive, pipe, guard, or a pure util function.

## Map each block to a TFS ID

The functionality's TFS (`docs/x/TFS_{name}.md`) is the source of the IDs — each exported component and helper service owns its own. Use the **exact IDs written in the TFS** (the TFS defines their format; don't invent your own).

- **`describe`** ↔ a **Functional Requirement (FR)** — titled `<FR-ID>: <what it tests>`.
- **`it`** ↔ a **Business Rule (BR)** — titled `<BR-ID>: Given <…>; When <…>; Then <…>`, and use **AAA** (Arrange / Act / Assert) in the body.

Every test that asserts a **functionality behavior** uses the **exact FR/BR ID from the TFS** — the TFS is the source of truth for IDs; a test never invents one. In the rare case you hit a real behavior the TFS doesn't cover, don't write an untraceable test and **don't edit the TFS here** — **flag it as a TFS gap** so the FR/BR is added to the TFS by its author (a separate step); the test then uses that new ID. Reserve a plain (ID-less) title only for tests of purely-internal helpers the TFS does not track.

## Read the test config first (Jest today)

If you are writing tests with the workspace's current runner — **Jest** today (re-check; the runner can change) — first read `jest.preset.js` and the files it references in `tools/jest/`. **Read it rather than assuming**: what it stubs and provides changes over time. Broadly, today it:

- stubs certain **native modules by scope** so their imports don't crash the suite;
- installs **browser globals** before module evaluation;
- sets **`transformIgnorePatterns`** so certain ES-module packages transpile.

Two rules that outlive the specifics:

- **Don't re-do what the preset already handles** — read it to see what's covered before adding any stub or global.
- **Don't declare a project-level `transformIgnorePatterns` or `moduleNameMapper`** — Jest _replaces_ these arrays (it doesn't merge), dropping the preset's. A lib should inherit the preset, not override it.

**Mocking — follow TDD, not the local habit.** Because the preset already makes native imports safe, most specs need no import-safety mocks. If a barrel genuinely cannot load in the test environment (a real circular-dependency or a native chain the preset doesn't cover), a **minimal** hoisted `jest.mock` of that barrel is acceptable **only to make the import loadable** — keep it complete and at the lowest level. Never mock a dependency just to assert it was called; test the unit's real, observable output instead (asserting on mocks is a TDD anti-pattern). Needing to mock _everything_ is a design signal, not a testing problem — per TDD, lean on dependency injection and exercise real collaborators rather than piling up mocks; if a unit is genuinely too hard to test, raise it as a design issue instead of burying it under mocks.

## Format for readability

Separate each `describe` (FR) block — and the file's mock-data / mock-service / helper sections — with a comment divider:

```
/* ////////////////////////////////////////////////////////////////////////// */
/* <FR-ID>: Test ...                                                          */
/* ////////////////////////////////////////////////////////////////////////// */
```

## Examples

See [assets/examples/unit-spec.md](assets/examples/unit-spec.md) — a feature-component spec showing the FR/BR dividers, `Given/When/Then` + AAA, the `jest.preset.js` handling (native modules not re-stubbed; a hoisted barrel mock **only** for import safety), and **observable-effect** assertions rather than mock-call assertions.

## Common mistakes

| Mistake                                                            | Fix                                                                                                                                                         |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `describe` / `it` without FR / BR IDs                              | Tag each from the TFS: FR → `describe`, BR → `it`, using the exact TFS IDs.                                                                                 |
| A real behavior tested without a TFS ID                            | Don't invent an ID or write an untraceable test; flag it as a TFS gap (the TFS author adds the FR/BR, then the test uses it). Don't edit the TFS from here. |
| Asserting a mock was called                                        | Test the unit's real observable output; asserting on mocks is a TDD anti-pattern.                                                                           |
| Re-stubbing Capacitor / Firebase for import safety                 | The preset already makes their imports safe — read it before adding any stub.                                                                               |
| Manually setting up jQuery / browser globals                       | The preset installs them before module evaluation.                                                                                                          |
| Declaring a project `transformIgnorePatterns` / `moduleNameMapper` | Don't — it replaces the preset's. Inherit the preset.                                                                                                       |
| `jest.mock` below the imports                                      | Hoist the (minimal, necessary) mock above the imports that touch the chain.                                                                                 |
| No comment dividers                                                | Divide each FR `describe` block (and the mock/helper sections).                                                                                             |
