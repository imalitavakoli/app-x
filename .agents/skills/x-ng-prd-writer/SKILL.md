---
name: x-ng-prd-writer
description: "WHAT? A functionality's PRD at docs/x/{name}/PRD.md — its product-level spec, whose Acceptance Criteria (ACs) later map to e2e tests. WHEN? Asked to create or update a PRD, product / scope / feature document, acceptance criteria, or product spec for a functionality; or when a brainstorm concludes and the feature needs its product spec. Not for util, api, or app libs — those are not functionalities."
metadata:
  version: '1.0.0'
---

# PRD Writer

## Overview

You are a product owner writing a clear, professional PRD for a **functionality** (a product feature classified as `abstract` / `visual` / `visual+` / `mixed` / `mixed+`, made of one or more of `map` / `data-access` / `ui` / `feature` / `page`). The PRD is the product-level source of truth: who the users are, what data is involved, how the experience flows, and — most importantly — the **Acceptance Criteria (ACs)**, the observable outcomes that later map to e2e test cases.

This PRD does **not** contain Functional Requirements or Business Rules — those are granular, test-level rules that live in the TFS, which derives them from this PRD's ACs and description.

Output: `docs/x/{functionality-name}/PRD.md` (one doc per functionality, in that functionality's folder — the TFS lives beside it under `docs/x/{functionality-name}/TFS/`).

## When to use

- Asked to create or update a PRD / product / scope / feature document for a **functionality**.
- A brainstorm has concluded and the result is a **functionality** that needs its product spec.
- Asked to define or revise a functionality's acceptance criteria.

Do **not** use when the target is only a `util`, `api`, or `app` lib — those are never functionalities (see Prerequisites). Do not use to write technical / library specs (the TFS) or to write tests.

## Prerequisites

**Gate — functionality only.** Before anything else, decide: is the target a **functionality**, or just a lib?

- If it is (or would be) only a `util`, `api`, or `app` lib → **STOP. Write no PRD.** Say so and exit. Example: brainstorm concludes "shared date-formatting util" → that is a `util` lib, not a functionality — no `docs/x/…/PRD.md`.
- `app` is a final product under `apps/`, not a functionality and not a reusable lib.
- A single `data-access`, `ui`, `feature`, or `page` lib **can** be a functionality; a `map` lib alone cannot (it always pairs with `data-access` under `abstract` / `mixed` / `mixed+`).

Classify using `docs/getting-started/library-types-and-their-relationship.md` (Functionality types). Do not invent a sixth type.

**Required input:** a feature description (or brainstorm conclusions) for one functionality. If it is missing or unclear, STOP and ask — do not research or invent it.

If the functionality already has a `docs/x/{name}/PRD.md`, read it first and **update** it rather than starting over: preserve existing AC IDs and add new ones — never renumber.

## Inputs & output

- **Reads:** the feature description / brainstorm conclusions (and the existing PRD, if any).
- **Writes:** `docs/x/{functionality-name}/PRD.md`.

## Workflow

Copy this checklist and track it. Keep the `[prd]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [prd] 1. Gate & analyse — confirm it is a functionality; read the template, library-types doc, description, any existing PRD
- [ ] [prd] 2. Draft — create the file mirroring the template headings
- [ ] [prd] 3. Fill — map the description into each section; classify the functionality and read the matching example
- [ ] [prd] 4. Validate — run the Review Checklist until all items pass
- [ ] [prd] 5. Confirm — put the Open Questions to the user, then present every AC and get explicit approval
- [ ] [prd] 6. Summary — report the saved path, the AC IDs, and anything still open
```

1. **Gate & analyse** — apply the Prerequisites gate. If it passes, read [assets/template.md](assets/template.md), the feature description, and `docs/getting-started/library-types-and-their-relationship.md` (Functionality types — authoritative shapes and natural entry libs). If a PRD already exists, read it too.
2. **Draft** — create `docs/x/{name}/PRD.md` (create the `docs/x/{name}/` folder if absent) mirroring the template's headings (content can be incomplete at first). The folder/`{name}` **is** the functionality name (e.g. `ng-chart`). Replace the feature-key placeholder `{NAME}` with one consistent key derived from that name (e.g. `ng-profile-info` → `PROFILE`).
3. **Fill** — map the description into the correct sections. Classify the functionality (shapes below — details in the library-types doc), then read the matching example before writing the flows and ACs:
   - **abstract** — `data-access` required; `map` only if API/external assets → [assets/examples/abstract.md](assets/examples/abstract.md)
   - **visual** / **visual+** — `ui` and/or `feature`; `visual+` **owns** a `page` → [assets/examples/visual.md](assets/examples/visual.md)
   - **mixed** / **mixed+** — owns `data-access`; `mixed` **must** have `feature` (optional `map`/`ui`); `mixed+` **must** have `page` + `data-access` (optional `map`/`ui`/`feature`) → [assets/examples/mixed.md](assets/examples/mixed.md)

   **Name match:** every lib this functionality owns uses the **same** functionality name (e.g. `ng-chart` → `shared-data-access-ng-chart`, `shared-feature-ng-chart`, …). Never rename own libs after a consumer.

   **Consumed-by ≠ owns page:** if `ng-chart` is used on `ng-dashboard` and `ng-insights`, those are **other** page libs/functionalities that **import** this one's natural entry lib. That does **not** make this functionality `visual+` / `mixed+`, and it must **not** gain a `page` lib or absorb those pages' names.

   **Page delta** (only when this functionality **owns** a `page`): capture URL query params, navigation, and route outcomes in Data Requirements, flows, and ACs. Natural entry: `mixed+` → `page`; `visual+` → `feature` when present, else `page`. Keep every requirement atomic and testable. Do not invent facts — mark unknowns as Open Questions and ask.

4. **Validate** — run the Review Checklist below; loop until all items pass.
5. **Confirm with the user** — see below. The PRD is not done until the Open Questions have been put to the user and every AC is approved.
6. **Summary** — see below.

## Template

**Always use [assets/template.md](assets/template.md) exactly** — same sections, same order. Remove the `>` quote-helpers from the final draft; keep every section heading. Omit a section only where the template says it is optional for that functionality type (e.g. an abstract functionality has no visual flows).

## Examples

Read the example matching the functionality's type before filling the User Experience & Flows and Acceptance Criteria — they show the expected granularity and how ACs are written and ID'd. The three examples cover the five functionality types: `visual+` uses the `visual` example and `mixed+` uses the `mixed` example, plus the page delta noted in the Workflow above. Examples may show a full optional lib set for a type; omit libs the classification does not need.

## Rules

- **Functionality gate.** Never write a PRD for a bare `util` / `api` / `app` lib. "Brainstorm said create a util" is still not a functionality.
- **Own libs share the functionality name.** Consumers keep their own names; reuse is dependency, not ownership.
- **No Functional Requirements or Business Rules.** They belong to the TFS. If the description states them, capture their intent here as Acceptance Criteria and/or Data Requirements; the TFS will decompose them into FRs/BRs.
- **The user journey starts at functionality initialization, never outside the app.** The first step is the component coming to life — e.g. _"Initialization: the lib is in a 'loading' state until the `userId` input is provided."_ Never begin with "the user opens the app", "logs in", or "navigates to the Dashboard".
- **Acceptance Criteria carry stable, unique IDs** in the form `{NAME}-AC-01`, `{NAME}-AC-02`, … ACs are the feature's observable, product-level outcomes; they map to e2e test cases later. When updating an existing PRD, never renumber existing IDs — add new ones.
- **Write ACs as good, testable criteria.** Each AC is a single, **observable** outcome — one per AC; if it needs an "and", split it — kept **independent and deterministic**, at **product altitude** (the meaningful primary + alternate/error outcomes a user or consumer would notice), and **not** an internal/technical or component-contract detail (an output a feature merely emits to its host is a **BR** in the TFS, not an AC). Where an AC maps depends on the functionality type: **visual / visual+ / mixed / mixed+** (has UI or a page) → user-observable outcomes verified by **e2e** when e2e applies (anchor on stable `[data-cy]` / visible text); **abstract** (no UI) → observable **data-contract** outcomes (data available / loading / error / cache) verified by the **data-access** unit tests. Either way, the TFS decomposes each AC into FRs/BRs.
- **Respect provided granularity.** If the user gave exact details (API endpoints, URL query params, field names), use them verbatim; do not generalise or override them.
- **Minimise re-asking.** Reuse everything already in the brainstorm conclusions / description; only ask about genuine gaps.
- **Do not invent facts.** Unknowns go to Open Questions and are raised with the user.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Target is a functionality (not a bare `util` / `api` / `app` lib).
- [ ] Classification matches the library-types doc (required vs optional libs); being used by other pages did not incorrectly add a `page`.
- [ ] All template sections are present, in order (Introduction first).
- [ ] No Functional Requirements and no Business Rules sections exist.
- [ ] The user journey begins at initialization, not outside the app.
- [ ] Non-Goals & Why records both excluded scope and any approach considered and rejected, each with its reason — not a bare list of exclusions.
- [ ] Every Acceptance Criterion has a unique `{NAME}-AC-01`-style ID.
- [ ] Each AC is one observable outcome (no "and"), independent, and not a component-contract/technical detail (those are BRs).
- [ ] Provided granularity (endpoints, params, field names) is preserved verbatim.
- [ ] No invented facts; unknowns are in Open Questions.

**Validation Steps (iterative loop):**

1. Check every item above.
2. If any item fails → fix the draft and re-check the whole list.
3. Only when all pass → continue to Summary.

## Confirm with the user

**The PRD is not finished until both of these happen.** Run them after the Review Checklist passes, before the Summary:

1. **Put the Open Questions to the user.** If the draft has any, ask them and fold each answer into the PRD. A question they don't answer stays listed under Open Questions — never guess an answer just to close it.
2. **Present every Acceptance Criterion and get explicit approval.** List them all — ID plus its observable outcome — and ask the user to confirm the set: nothing missing, nothing that isn't really an AC. Do not summarise or show only the new ones; they approve the whole set.

Why this one is a gate and not a report: each AC becomes an e2e test case, and the TFS decomposes each into FRs and BRs that become unit tests. An AC that is wrong, missing or mis-scoped propagates into the technical spec and the test suite before anyone looks at it again.

Incorporate whatever they change, re-run the Review Checklist, and ask again. Only once the user has approved the ACs is the PRD done.

## Summary

1. Report the saved path (`docs/x/{name}/PRD.md`).
2. List the AC IDs created or added (ID + one-line description), and confirm the user approved the set.
3. List any Open Questions still unanswered.

## Common mistakes

| Mistake                                            | Fix                                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Writing a PRD for a `util` / `api` / `app` lib     | STOP — not a functionality; no `docs/x/…` PRD.                                     |
| Treating "used on page X/Y" as owning a `page`     | Consumers import this functionality; only own a `page` if _this_ name is the page. |
| Forcing `map`+`ui` on every mixed                  | Mixed requires `data-access`+`feature`; `map`/`ui` are optional.                   |
| Adding Functional Requirements / Business Rules    | Remove them — they live in the TFS. Keep only ACs here.                            |
| Journey starts with "user opens the app / logs in" | Start at initialization (loading state until inputs arrive).                       |
| Acceptance Criteria without IDs                    | Give each a unique `{NAME}-AC-01` ID.                                              |
| Renumbering ACs when updating                      | Never renumber; add new IDs only.                                                  |
| Generalising a provided endpoint / param           | Use the exact value the user gave.                                                 |
| AC bundling several outcomes ("and")               | Split into one AC per observable outcome.                                          |
| AC that only asserts an emitted output/event       | A feature's output is a component contract → a BR in the TFS, not an AC.           |
| Finishing without the user approving the ACs       | Present the full set and wait. They become e2e tests and the TFS's FRs/BRs.        |
| Guessing an answer to close an Open Question       | Ask the user. Unanswered questions stay listed, not silently resolved.             |
