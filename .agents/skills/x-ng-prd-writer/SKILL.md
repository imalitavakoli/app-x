---
name: x-ng-prd-writer
description: "WHAT? Generates or updates a functionality's PRD (Product Requirements Document) — the product-level spec covering users, data, UX flows, and Acceptance Criteria (ACs). WHEN? Asked to create or update a PRD, a product / scope / feature document, acceptance criteria, or a product spec for a functionality (feature) to be built or changed in the workspace; or when a brainstorm concludes and the feature needs its product spec written to docs/x/."
metadata:
  version: '1.0.0'
---

# PRD Writer

## Overview

You are a product owner writing a clear, professional PRD for a **functionality** (a feature that may consist of several library types). The PRD is the product-level source of truth: who the users are, what data is involved, how the experience flows, and — most importantly — the **Acceptance Criteria (ACs)**, the observable outcomes that later map to e2e test cases.

This PRD does **not** contain Functional Requirements or Business Rules — those are granular, test-level rules that live in the TFS, which derives them from this PRD's ACs and description.

Output: `docs/x/PRD_{functionality-name}.md`.

## When to use

- Asked to create or update a PRD / product / scope / feature document for a functionality.
- A brainstorm has concluded and the feature needs its product spec.
- Asked to define or revise a functionality's acceptance criteria.

Do not use to write technical / library specs (the TFS) or to write tests.

## Prerequisites

**Required input:** a feature description (or brainstorm conclusions) for one functionality. If it is missing or unclear, STOP and ask — do not research or invent it.

If the functionality already has a `docs/x/PRD_{name}.md`, read it first and **update** it rather than starting over: preserve existing AC IDs and add new ones — never renumber.

## Inputs & output

- **Reads:** the feature description / brainstorm conclusions (and the existing PRD, if any).
- **Writes:** `docs/x/PRD_{functionality-name}.md`.

## Workflow

Copy this checklist and track it. Keep the `[prd]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [prd] 1. Analyse — read the template, the feature description, and any existing PRD
- [ ] [prd] 2. Draft — create the file mirroring the template headings
- [ ] [prd] 3. Fill — map the description into each section; classify the functionality and read the matching example
- [ ] [prd] 4. Validate — run the Review Checklist until all items pass
- [ ] [prd] 5. Summary — report the saved path, the AC IDs, and open questions
```

1. **Analyse** — read [assets/template.md](assets/template.md), the feature description, and `docs/getting-started/library-types-and-their-relationship.md` (to classify the functionality's type). If a PRD already exists, read it too.
2. **Draft** — create `docs/x/PRD_{name}.md` mirroring the template's headings (content can be incomplete at first). Replace the feature-key placeholder `{NAME}` with one consistent key derived from the functionality name (e.g. `ng-profile-info` → `PROFILE`).
3. **Fill** — map the description into the correct sections. Classify the functionality's type (per the library-types doc), then read the matching example before writing the flows and ACs:
   - **abstract** (map + data-access, no UI) → [assets/examples/abstract.md](assets/examples/abstract.md)
   - **visual** / **visual+** (ui + feature [+ page]) → [assets/examples/visual.md](assets/examples/visual.md)
   - **mixed** / **mixed+** (map + data-access + ui + feature [+ page]) → [assets/examples/mixed.md](assets/examples/mixed.md)

   For the `+` (page-level) types, also note the page delta: the `page` lib is the entry point, its inputs arrive as **URL query params**, and it may **navigate** between routes — capture those in Data Requirements, the flows, and the ACs. Keep every requirement atomic and testable. Do not invent facts — mark unknowns as Open Questions and ask.

4. **Validate** — run the Review Checklist below; loop until all items pass.
5. **Summary** — see below.

## Template

**Always use [assets/template.md](assets/template.md) exactly** — same sections, same order. Remove the `>` quote-helpers from the final draft; keep every section heading. Omit a section only where the template says it is optional for that functionality type (e.g. an abstract functionality has no visual flows).

## Examples

Read the example matching the functionality's type before filling the User Experience & Flows and Acceptance Criteria — they show the expected granularity and how ACs are written and ID'd. The three examples cover the five functionality types: `visual+` uses the `visual` example and `mixed+` uses the `mixed` example, plus the page delta noted in the Workflow above.

## Rules

- **No Functional Requirements or Business Rules.** They belong to the TFS. If the description states them, capture their intent here as Acceptance Criteria and/or Data Requirements; the TFS will decompose them into FRs/BRs.
- **The user journey starts at functionality initialization, never outside the app.** The first step is the component coming to life — e.g. _"Initialization: the lib is in a 'loading' state until the `userId` input is provided."_ Never begin with "the user opens the app", "logs in", or "navigates to the Dashboard".
- **Acceptance Criteria carry stable, unique IDs** in the form `{NAME}-AC-01`, `{NAME}-AC-02`, … ACs are the feature's observable, product-level outcomes; they map to e2e test cases later. When updating an existing PRD, never renumber existing IDs — add new ones.
- **Write ACs as good, testable criteria.** Each AC is a single, **observable** outcome — one per AC; if it needs an "and", split it — kept **independent and deterministic**, at **product altitude** (the meaningful primary + alternate/error outcomes a user or consumer would notice), and **not** an internal/technical or component-contract detail (an output a feature merely emits to its host is a **BR** in the TFS, not an AC). Where an AC maps depends on the functionality type: **visual / page** → user-observable outcomes verified by **e2e** (anchor on stable `[data-cy]` / visible text); **abstract** (no UI) → observable **data-contract** outcomes (data available / loading / error / cache) verified by the **data-access** unit tests. Either way, the TFS decomposes each AC into FRs/BRs.
- **Respect provided granularity.** If the user gave exact details (API endpoints, URL query params, field names), use them verbatim; do not generalise or override them.
- **Minimise re-asking.** Reuse everything already in the brainstorm conclusions / description; only ask about genuine gaps.
- **Do not invent facts.** Unknowns go to Open Questions and are raised with the user.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] All template sections are present, in order (Introduction first).
- [ ] No Functional Requirements and no Business Rules sections exist.
- [ ] The user journey begins at initialization, not outside the app.
- [ ] Every Acceptance Criterion has a unique `{NAME}-AC-01`-style ID.
- [ ] Each AC is one observable outcome (no "and"), independent, and not a component-contract/technical detail (those are BRs).
- [ ] Provided granularity (endpoints, params, field names) is preserved verbatim.
- [ ] No invented facts; unknowns are in Open Questions.

**Validation Steps (iterative loop):**

1. Check every item above.
2. If any item fails → fix the draft and re-check the whole list.
3. Only when all pass → continue to Summary.

## Summary

1. Report the saved path (`docs/x/PRD_{name}.md`).
2. List the AC IDs created or added (ID + one-line description).
3. List any Open Questions the user still needs to answer.
4. Incorporate requested changes until the user confirms.

## Common mistakes

| Mistake                                            | Fix                                                                      |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| Adding Functional Requirements / Business Rules    | Remove them — they live in the TFS. Keep only ACs here.                  |
| Journey starts with "user opens the app / logs in" | Start at initialization (loading state until inputs arrive).             |
| Acceptance Criteria without IDs                    | Give each a unique `{NAME}-AC-01` ID.                                    |
| Renumbering ACs when updating                      | Never renumber; add new IDs only.                                        |
| Generalising a provided endpoint / param           | Use the exact value the user gave.                                       |
| AC bundling several outcomes ("and")               | Split into one AC per observable outcome.                                |
| AC that only asserts an emitted output/event       | A feature's output is a component contract → a BR in the TFS, not an AC. |
