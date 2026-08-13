---
name: x-ng-prd-writer
description: "WHAT? A functionality's PRD at docs/x/{name}/PRD/README.md — its product-level spec, whose Acceptance Criteria (ACs) later map to e2e tests. WHEN? Asked to create or update a PRD, product / scope / feature document, acceptance criteria, or product spec for a functionality; or when a brainstorm concludes and the feature needs its product spec. Not for util, api, or app libs, nor for grab-bag ui/feature libs — those are not functionalities."
metadata:
  version: '1.4.0'
---

# PRD Writer

## Overview

You are a product owner writing a clear, professional PRD for a **functionality** (a product feature classified as `abstract` / `visual` / `visual+` / `mixed` / `mixed+`, made of one or more of `map` / `data-access` / **single-purpose** `ui` / `feature` / `page`). The PRD is the product-level source of truth: who the users are, what data is involved, how the experience flows, and — most importantly — the **Acceptance Criteria (ACs)**, the observable outcomes that later map to e2e test cases.

This PRD does **not** contain Functional Requirements or Business Rules — those are granular, test-level rules that live in the TFS, which derives them from this PRD's ACs and description.

Output: the **folder** `docs/x/{functionality-name}/PRD/` — `README.md` (the PRD itself) plus `DECISIONS.md` (retired ACs · rejected product approaches · reversed decisions), in that functionality's folder. The TFS lives beside it under `docs/x/{functionality-name}/TFS/`.

## When to use

- Asked to create or update a PRD / product / scope / feature document for a **functionality**.
- A brainstorm has concluded and the result is a **functionality** that needs its product spec.
- Asked to define or revise a functionality's acceptance criteria.

Do **not** use when the target is only a `util`, `api`, or `app` lib — those are never functionalities (see Prerequisites). Do not use to write technical / library specs (the TFS) or to write tests.

## Prerequisites

**Gate — functionality only.** Before anything else, decide: is the target a **functionality**, or just a lib?

- If it is (or would be) only a `util`, `api`, or `app` lib → **STOP. Write no PRD.** Say so and exit. Example: brainstorm concludes "shared date-formatting util" → that is a `util` lib, not a functionality — no `docs/x/…/PRD/`.
- If it is a **grab-bag** `ui` or `feature` lib → **STOP. Write no PRD.** A grab-bag holds several unrelated items sharing only a technical kind, each versioned on its own (`src/lib/toggle-me-v1/`) — e.g. `shared-ui-ng-directives`. Its requirements live in a `requirements.md` beside each item's inner version README, never in a PRD. **Adding an item to a grab-bag never creates a functionality**, so "add a directive to the shared directives lib" is not a PRD job. Definition and the test: `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.
- `app` is a final product under `apps/`, not a functionality and not a reusable lib.
- A single **single-purpose** `data-access`, `ui`, `feature`, or `page` lib **can** be a functionality; a `map` lib alone cannot (it always pairs with `data-access` under `abstract` / `mixed` / `mixed+`).

Classify using `docs/getting-started/library-types-and-their-relationship.md` (Functionality types). Do not invent a sixth type.

**Required input:** a feature description (or brainstorm conclusions) for one functionality. If it is missing or unclear, STOP and ask — do not research or invent it.

If the functionality already has a `docs/x/{name}/PRD/README.md`, read it first and **update** it rather than starting over: preserve existing AC IDs and add new ones — never renumber. **If an AC already in it is no longer true** — its outcome changed, or that behaviour no longer exists — that is an **amend** or a **retire**, not an add: read [references/amend-and-retire.md](references/amend-and-retire.md) first, because both reverse an AC the user explicitly approved and neither may be done silently. If its **Dependencies & Risks** says a reused lib "does not exist yet" or "must change for us", re-verify each such note and bring it to the present — see [references/reuse-boundary.md](references/reuse-boundary.md).

**First-time for existing libs** — when there is no `docs/x/{name}/PRD/README.md` yet but owned libs already exist in the workspace: read [references/bootstrap-existing.md](references/bootstrap-existing.md) before drafting. Still require a clear description / brainstorm conclusions and user AC approval; never invent product facts from code alone.

## Inputs & output

- **Reads:** the feature description / brainstorm conclusions (and the existing PRD, if any).
- **Writes:** the `docs/x/{functionality-name}/PRD/` folder — `README.md`, and `DECISIONS.md` whenever an AC is retired or an approach is rejected.

## Workflow

Copy this checklist and track it. Keep the `[prd]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [prd] 1. Gate & analyse — confirm it is a functionality; read the template, library-types doc, description, any existing PRD; if the description names reused libs, read references/reuse-boundary.md
- [ ] [prd] 2. Draft — create PRD/README.md mirroring the template headings
- [ ] [prd] 3. Fill — map the description into each section; classify the functionality and read the matching example
- [ ] [prd] 4. Validate — run the Review Checklist until all items pass
- [ ] [prd] 5. Confirm — put the Open Questions to the user, then present every AC and get explicit approval
- [ ] [prd] 6. Summary — report the saved paths, the AC IDs, any AC amended/retired, and anything still open
```

1. **Gate & analyse** — apply the Prerequisites gate. If it passes, read the templates in [assets/template/](assets/template/) (the `README.md` template + the `DECISIONS.md` template), the feature description, and `docs/getting-started/library-types-and-their-relationship.md` (Functionality types — authoritative shapes and natural entry libs). If a PRD already exists, read it too. **If the description names any lib or functionality this one reuses** — existing, to be created, or needing a change for us — also read [references/reuse-boundary.md](references/reuse-boundary.md) before writing any AC.
2. **Draft** — create `docs/x/{name}/PRD/README.md` (create the `docs/x/{name}/` folder if absent) mirroring the template's headings (content can be incomplete at first). The folder/`{name}` **is** the functionality name (e.g. `ng-chart`). Choose the **Feature key** and record it in the template's field, then use it for every `{NAME}` placeholder (e.g. `ng-profile-info` → `PROFILE`) — see the key's rule below.
3. **Fill** — map the description into the correct sections. Classify the functionality (shapes below — details in the library-types doc), then read the matching example before writing the flows and ACs:
   - **abstract** — `data-access` required; `map` only if API/external assets → [assets/examples/abstract.md](assets/examples/abstract.md)
   - **visual** / **visual+** — `ui` and/or `feature`; `visual+` **owns** a `page` → [assets/examples/visual.md](assets/examples/visual.md)
   - **mixed** / **mixed+** — owns `data-access`; `mixed` **must** have `feature` (optional `map`/`ui`); `mixed+` **must** have `page` + `data-access` (optional `map`/`ui`/`feature`) → [assets/examples/mixed.md](assets/examples/mixed.md)

   **Name match:** every lib this functionality owns uses the **same** functionality name (e.g. `ng-chart` → `shared-data-access-ng-chart`, `shared-feature-ng-chart`, …). Never rename own libs after a consumer.

   **Consumed-by ≠ owns page:** if `ng-chart` is used on `ng-dashboard` and `ng-insights`, those are **other** page libs/functionalities that **import** this one's natural entry lib. That does **not** make this functionality `visual+` / `mixed+`, and it must **not** gain a `page` lib or absorb those pages' names.

   **Page delta** (only when this functionality **owns** a `page`): capture URL query params, navigation, and route outcomes in Data Requirements, flows, and ACs. Natural entry: `visual+` → `page`; `mixed+` → `page`. Keep every requirement atomic and testable. Do not invent facts — mark unknowns as Open Questions and ask.

4. **Validate** — run the Review Checklist below; loop until all items pass.
5. **Confirm with the user** — see below. The PRD is not done until the Open Questions have been put to the user and every AC is approved.
6. **Summary** — see below.

## Template

**Always use the templates in [assets/template/](assets/template/) exactly** — `README.md` for the PRD itself, `DECISIONS.md` for its history — same sections, same order. Remove the `>` quote-helpers from the final draft; keep every section heading. Omit a section only where the template says it is optional for that functionality type (e.g. an abstract functionality has no visual flows).

## Examples

**`DECISIONS.md`** has one example for every functionality type — [assets/examples/decisions.md](assets/examples/decisions.md) — because its shape does not vary by type. Read it whenever this run retires an AC or records a rejected approach; it shows the level of *why* an entry needs to be worth keeping, and how a replacement is recorded.

Read the example matching the functionality's type before filling the User Experience & Flows and Acceptance Criteria — they show the expected granularity and how ACs are written and ID'd. The three examples cover the five functionality types: `visual+` uses the `visual` example and `mixed+` uses the `mixed` example, plus the page delta noted in the Workflow above. Examples may show a full optional lib set for a type; omit libs the classification does not need.

## Rules

- **Functionality gate.** Never write a PRD for a bare `util` / `api` / `app` lib, nor for a **grab-bag** `ui` / `feature` lib. "Brainstorm said create a util" is still not a functionality — and neither is "add one more directive to the shared directives lib".
- **Own libs share the functionality name.** Consumers keep their own names; reuse is dependency, not ownership.
- **No Functional Requirements or Business Rules.** They belong to the TFS. If the description states them, capture their intent here as Acceptance Criteria and/or Data Requirements; the TFS will decompose them into FRs/BRs.
- **The user journey starts at functionality initialization, never outside the app.** The first step is the component coming to life — e.g. _"Initialization: the lib is in a 'loading' state until the `userId` input is provided."_ Never begin with "the user opens the app", "logs in", or "navigates to the Dashboard".
- **The Feature key is chosen once, recorded, and never re-derived.** It is the short uppercase key prefixing every ID this functionality produces — this PRD's ACs, the TFS's FR/BRs, and the test titles carrying them — so it is recorded in the PRD's **Feature key** field and everything downstream copies it verbatim. Drop the `ng-` prefix and keep it short and unmistakable (`ng-balance-card` → `BALANCE`, `ng-user-geo` → `GEO`, `ng-x-profile` → `XPROFILE`); **grep `docs/x/` first — it must be unique across functionalities.** Never leave it to be re-derived from the folder name later: `ng-alert-badge` yields `ALERTBADGE` or `ALERT` depending on who derives it, and one functionality ends up with two ID namespaces.
- **Acceptance Criteria carry stable, unique IDs** in the form `{NAME}-AC-01`, `{NAME}-AC-02`, … ACs are the feature's observable, product-level outcomes; they map to e2e test cases later. When updating an existing PRD, never renumber existing IDs — add new ones.
- **Write ACs as good, testable criteria.** Each AC is a single, **observable** outcome — one per AC; if it needs an "and", split it — kept **independent and deterministic**, at **product altitude** (the meaningful primary + alternate/error outcomes a user or consumer would notice), and **not** an internal/technical or component-contract detail (an output a feature merely emits to its host is a **BR** in the TFS, not an AC). Where an AC maps depends on the functionality type: **visual / visual+ / mixed / mixed+** (has UI or a page) → user-observable outcomes verified by **e2e** when e2e applies (anchor on stable `[data-cy]` / visible text); **abstract** (no UI) → observable **data-contract** outcomes (data available / loading / error / cache) verified by the **data-access** unit tests. Either way, the TFS decomposes each AC into FRs/BRs.
- **Give this PRD only ACs whose subject is ours.** Every AC asserts something about a subject; here that subject is one of four things — **data** this functionality produces or exposes, a **state** it owns (loading / empty / error / data), a **decision** it makes (which items qualify, their order, which remain after an action), or the **presence or absence** of something it places on screen. A reused component's visual attributes (colour, styling, animation) and a reused util's output format (date pattern, rounding, truncation) are their owner's subject; record the reuse under **Dependencies & Risks** / **Non-Goals & Why** instead, with no AC ID. When one sentence contains both — _"an over-threshold alert shows in the banner's red critical styling"_ — **keep the decision, shed the rendering**: the AC is that the alert is _presented as critical_; that critical looks red belongs to the banner's own PRD. This holds even when the reused lib must change **for us**: requirements follow the lib, not the requester. See [references/reuse-boundary.md](references/reuse-boundary.md).
- **Lib versions usually change nothing here.** Versions are per **lib**; a functionality has none of its own, and a `ui` going v1 → v2 for a renamed input is invisible to the product. So AC IDs carry **no** version by default. Only when a new version changes **product-observable** behaviour *and both versions stay user-reachable* do the new version's ACs need distinguishing — then suffix the version on the **new** ones (`{NAME}-V2-AC-01`) and leave the existing ACs untouched, exactly as with any other addition. If that divergence is so wide it needs a whole parallel AC set, stop and ask whether this is really a new **functionality** rather than a version.
- **Respect provided granularity.** If the user gave exact details (API endpoints, URL query params, field names), use them verbatim; do not generalise or override them.
- **Minimise re-asking.** Reuse everything already in the brainstorm conclusions / description; only ask about genuine gaps.
- **Do not invent facts.** Unknowns go to Open Questions and are raised with the user.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Target is a functionality — not a bare `util` / `api` / `app` lib, and not a **grab-bag** `ui` / `feature` lib.
- [ ] Classification matches the library-types doc (required vs optional libs); being used by other pages did not incorrectly add a `page`.
- [ ] All template sections are present, in order (Introduction first).
- [ ] No Functional Requirements and no Business Rules sections exist.
- [ ] The user journey begins at initialization, not outside the app.
- [ ] Non-Goals & Why in `README.md` records **current** excluded scope with a reason each — not a bare list, and not a history of rejected approaches (those belong in `DECISIONS.md`).
- [ ] `DECISIONS.md` exists whenever an AC was retired or an approach was rejected this cycle, with the date and reason per entry; no retired AC remains in the Acceptance Criteria section, and no retired number was recycled.
- [ ] The **Feature key** field is filled in, unique across `docs/x/` (grepped, not assumed), and used for every `{NAME}` in the document.
- [ ] Every Acceptance Criterion has a unique `{NAME}-AC-01`-style ID.
- [ ] No AC ID carries a version segment — unless a new lib version changed **product-observable** behaviour *and* both versions stay user-reachable, in which case only the **new** ACs are suffixed (`{NAME}-V2-AC-01`) and every existing AC was left untouched.
- [ ] Each AC is one observable outcome (no "and"), independent, and not a component-contract/technical detail (those are BRs).
- [ ] Every AC's subject is ours — our data, state, decision, or what we place on screen — and none asserts a reused component's visual attributes or a reused util's output format, even where that lib must change for us.
- [ ] Reused libs/functionalities appear under Dependencies & Risks / Non-Goals & Why / Data Requirements, never as an AC.
- [ ] **On update only:** every "does not exist yet" / "must change for us" note in Dependencies & Risks was re-verified — cleared where the work landed, narrowed where it partly landed, or left with an Open Question where it could not be determined.
- [ ] **No AC describes an outcome the product no longer has**, and none states an outcome the shipped behaviour contradicts — every pre-existing AC was checked, not just the new ones.
- [ ] **On amend / retire only:** the ID was kept (amend) or burned and never recycled (retire); the old text was shown beside the new and explicitly confirmed; the orphaned TFS FR/BRs and any e2e `it` were reported; the flow text and Non-Goals were reconciled.
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

1. Report the saved path (`docs/x/{name}/PRD/README.md`).
2. List the AC IDs created or added (ID + one-line description), and confirm the user approved the set.
3. List any Open Questions still unanswered.

## Common mistakes

| Mistake                                            | Fix                                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Writing a PRD for a `util` / `api` / `app` lib     | STOP — not a functionality; no `docs/x/…` PRD.                                     |
| Writing a PRD for a grab-bag `ui` / `feature` lib  | STOP — a bucket of unrelated items is not a product feature; its items use a local `requirements.md`. |
| Treating "used on page X/Y" as owning a `page`     | Consumers import this functionality; only own a `page` if _this_ name is the page. |
| Forcing `map`+`ui` on every mixed                  | Mixed requires `data-access`+`feature`; `map`/`ui` are optional.                   |
| Adding Functional Requirements / Business Rules    | Remove them — they live in the TFS. Keep only ACs here.                            |
| Journey starts with "user opens the app / logs in" | Start at initialization (loading state until inputs arrive).                       |
| Acceptance Criteria without IDs                    | Give each a unique `{NAME}-AC-01` ID.                                              |
| Renumbering ACs when updating                      | Never renumber; add new IDs only.                                                  |
| Minting a new AC because an outcome changed        | Same outcome, corrected wording → **amend** under the existing ID. See `references/amend-and-retire.md`. |
| Recycling a retired AC number                      | A burned number stays burned, so old test titles never resolve to a different outcome. |
| Retiring an AC and leaving its FR/BRs pointing at it | Report every orphaned FR/BR and e2e `it`; they are fixed in their own runs.        |
| Amending or retiring an AC silently                | It reverses a user approval — show old beside new, get confirmation, name the reusers. |
| Generalising a provided endpoint / param           | Use the exact value the user gave.                                                 |
| AC bundling several outcomes ("and")               | Split into one AC per observable outcome.                                          |
| AC that only asserts an emitted output/event       | A feature's output is a component contract → a BR in the TFS, not an AC.           |
| AC asserting a reused component's colour/styling   | Its owner's PRD. Keep only the decision that drove it (_presented as critical_).   |
| AC asserting a reused util's format or rounding    | The util's own `requirements.md`. Keep only that the value is displayed.           |
| AC covering a change we asked another team to make | Requirements follow the lib, not the requester → Dependencies & Risks.             |
| Fusing our decision with their rendering in one AC | Split: keep the decision, shed the rendering.                                      |
| Finishing without the user approving the ACs       | Present the full set and wait. They become e2e tests and the TFS's FRs/BRs.        |
| Guessing an answer to close an Open Question       | Ask the user. Unanswered questions stay listed, not silently resolved.             |
