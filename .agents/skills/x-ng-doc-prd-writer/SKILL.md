---
name: x-ng-doc-prd-writer
description: "WHAT? A functionality's PRD at docs/x/{domain}/{name}/PRD/README.md — its product-level spec, whose Acceptance Criteria (ACs) later map to e2e tests. WHEN? Asked to create or update a PRD, product / scope / feature document, acceptance criteria, or product spec for a functionality; or when a brainstorm concludes and the feature needs its product spec. Not for util, api, or app libs, nor for grab-bag ui/feature libs — those are not functionalities."
metadata:
  kind: writer
  version: '2.1.0'
---

# PRD Writer

## Overview

You are a product owner writing a clear, professional PRD for a **functionality** (a product feature classified as `abstract` / `visual` / `visual+` / `mixed` / `mixed+`, made of one or more of `map` / `data-access` / **single-purpose** `ui` / `feature` / `page`). The PRD is the product-level source of truth: who the users are, what data is involved, how the experience flows, and — most importantly — the **Acceptance Criteria (ACs)**, the observable outcomes that later map to e2e test cases.

This PRD does **not** contain Functional Requirements or Business Rules — those are granular, test-level rules that live in the TSD, which derives them from this PRD's ACs and description.

Output: the **folder** `docs/x/{domain}/{name}/PRD/` — `README.md` (the PRD itself) plus `DECISIONS.md` (retired ACs · rejected product approaches · reversed decisions), in that functionality's folder. The TSD lives beside it under `docs/x/{domain}/{name}/TSD/`.

## When to use

- Asked to create or update a PRD / product / scope / feature document for a **functionality**.
- A brainstorm has concluded and the result is a **functionality** that needs its product spec.
- Asked to define or revise a functionality's acceptance criteria.

Do **not** use when the target is only a `util`, `api`, or `app` lib — those are never functionalities (see Prerequisites). Do not use to write technical / library specs (the TSD) or to write tests.

## Prerequisites

**Gate — functionality only.** Before anything else, decide: is the target a **functionality**, or just a lib?

- If it is (or would be) only a `util`, `api`, or `app` lib → **STOP. Write no PRD.** Say so and exit. Example: brainstorm concludes "shared date-formatting util" → that is a `util` lib, not a functionality — no `docs/x/…/PRD/`.
- If it is a **grab-bag** `ui` or `feature` lib (`CONTEXT.md`) → **STOP. Write no PRD.** Its requirements live in a `requirements/` beside each item's inner version README, never in a PRD. **Adding an item to a grab-bag never creates a functionality**, so "add a directive to the shared directives lib" is not a PRD job. The test for telling one from a single-purpose lib: `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag.
- `app` is a final product under `apps/`, not a functionality and not a reusable lib.
- A single **single-purpose** `data-access`, `ui`, `feature`, or `page` lib **can** be a functionality; a `map` lib alone cannot (it always pairs with `data-access` under `abstract` / `mixed` / `mixed+`).

Classify using `docs/getting-started/library-types-and-their-relationship.md` (Functionality types). Do not invent a sixth type.

**Required input:** a feature description (or brainstorm conclusions) for one functionality. If it is missing or unclear, STOP and ask — do not research or invent it.

If the functionality already has a PRD, read it first and **update** it rather than starting over. Look for `docs/x/{domain}/{name}/PRD/README.md`; when `{domain}` is not yet known, look for `docs/x/*/{name}/PRD/README.md`. **Read its `ACs Approved` field before touching any AC**, because it decides which of two procedures you are in:

- **`NOT YET`** → these ACs were drafted but never approved. Revising them is ordinary draft work: rewrite freely, mint and drop IDs as needed, burn nothing, and write no `DECISIONS.md` row. Two things that does **not** license:
  - **Check what already points at these ACs — and if anything does, never renumber.** A `TSD/` folder may exist and back-link them; its ID Index maps every FR/BR to an AC. Never assume nothing downstream consumed an unapproved set — look. Where something does: **leave gaps rather than renumbering.** Dropping an AC leaves a back-link **dangling**, which someone eventually notices. Renumbering instead makes every later back-link resolve to the **wrong** AC: nothing dangles, nothing looks broken, and the two specs silently describe different requirements. Closing a gap is only safe when nothing points at these IDs at all. Fixing the TSD is not yours, but **list in the Summary every back-link your changes break — dangling or mis-pointed**, because nothing else will notice.
  - **An ID gap you leave is not a retirement**, and it does not look like one to anybody else. A later reader finding no `AC-04` and no `DECISIONS.md` row cannot tell a draft edit from a silent retirement, so say in the Summary which numbers you dropped and that they were never approved.
- **A date** → preserve existing AC IDs and add new ones, never renumber. **If an AC already in it is no longer true** — its outcome changed, or that behaviour no longer exists — that is an **amend** or a **retire**, not an add: read [references/amend-and-retire.md](references/amend-and-retire.md) first, because both reverse an AC the user explicitly approved and neither may be done silently. If its **Dependencies & Risks** says a reused lib "does not exist yet" or "must change for us", re-verify each such note and bring it to the present — see [references/reuse-boundary.md](references/reuse-boundary.md).

**First-time for existing libs** — when there is no `docs/x/*/{name}/PRD/README.md` yet but owned libs already exist in the workspace: read [references/bootstrap-existing.md](references/bootstrap-existing.md) before drafting. Still require a clear description / brainstorm conclusions and user AC approval; never invent product facts from code alone.

## Inputs & output

- **Reads:** the feature description / brainstorm conclusions (and the existing PRD, if any).
- **Writes:** the `docs/x/{domain}/{name}/PRD/` folder — `README.md`, and `DECISIONS.md` **always**, with `NONE.` under any heading that has no entries yet. An empty heading records that the category was considered; a missing file is indistinguishable from an oversight.

## Workflow

Copy this checklist and track it. Keep the `[prd]` prefix so, if this runs inside a larger workflow, these stay grouped and the outer workflow's todos remain visible:

```
- [ ] [prd] 1. Gate & analyse — confirm it is a functionality; derive Domain (ladder); confirm `{name}` with the stack's technology prefix; look for an existing PRD at `docs/x/*/{name}/PRD/README.md` when Domain is not yet known; read the template, library-types doc, description, any existing PRD; if the description names reused libs, read references/reuse-boundary.md
- [ ] [prd] 2. Draft — write under `docs/x/{domain}/{name}/PRD/`; create README.md and DECISIONS.md mirroring the template headings (DECISIONS.md always, NONE. under empty headings); Last Verified: NOT YET on first create; record Domain and Feature key
- [ ] [prd] 3. Fill — map the description into each section; classify the functionality and read the matching example; send every undecided outcome to Open Questions, never to a provisional AC
- [ ] [prd] 4. Validate — run the Review Checklist until all items pass
- [ ] [prd] 5. Confirm — put the Open Questions to the user, then present every AC and get explicit approval; stamp ACs Approved with that date, or leave it NOT YET
- [ ] [prd] 6. Summary — report the saved paths, the AC IDs, the ACs Approved state, any AC amended/retired, any AC number dropped, any TSD back-link broken, and anything still open
```

1. **Gate & analyse** — apply the Prerequisites gate. If it passes, derive **Domain** (ladder in Rules) and confirm `{name}` with the stack's technology prefix. Look for an existing PRD at `docs/x/{domain}/{name}/PRD/README.md`; when `{domain}` is not yet known, look for `docs/x/*/{name}/PRD/README.md`. Read the templates in [assets/template/](assets/template/) (the `README.md` template + the `DECISIONS.md` template), the feature description, and `docs/getting-started/library-types-and-their-relationship.md` (Functionality types — authoritative shapes and natural entry libs). If a PRD already exists, read it too. **If the description names any lib or functionality this one reuses** — existing, to be created, or needing a change for us — also read [references/reuse-boundary.md](references/reuse-boundary.md) before writing any AC.
2. **Draft** — create `docs/x/{domain}/{name}/PRD/README.md` (create the `docs/x/{domain}/{name}/` folder if absent) mirroring the template's headings (content can be incomplete at first). Create `DECISIONS.md` from its template in the same step, with `NONE.` under every heading until something qualifies. Record **Domain** in the header — it must match the parent folder. On first create, write **Last Verified** as `NOT YET`. Choose the **Feature key** and record it in the template's field, then use it for every `{NAME}` placeholder (e.g. `ng-profile-info` → `PROFILE`) — see the key's rule below.
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

**`DECISIONS.md`** has one example for every functionality type — [assets/examples/decisions.md](assets/examples/decisions.md) — because its shape does not vary by type. Read it whenever this run retires an AC or records a rejected approach; it shows the level of _why_ an entry needs to be worth keeping, and how a replacement is recorded.

Read the example matching the functionality's type before filling the User Experience & Flows and Acceptance Criteria — they show the expected granularity and how ACs are written and ID'd. The three examples cover the five functionality types: `visual+` uses the `visual` example and `mixed+` uses the `mixed` example, plus the page delta noted in the Workflow above. Examples may show a full optional lib set for a type; omit libs the classification does not need.

## Rules

- **Functionality gate.** Never write a PRD for a bare `util` / `api` / `app` lib, nor for a **grab-bag** `ui` / `feature` lib. "Brainstorm said create a util" is still not a functionality — and neither is "add one more directive to the shared directives lib".
- **Own libs share the functionality name.** Consumers keep their own names; reuse is dependency, not ownership.
- **No Functional Requirements or Business Rules.** They belong to the TSD. If the description states them, capture their intent here as Acceptance Criteria and/or Data Requirements; the TSD will decompose them into FRs/BRs.
- **The user journey starts at functionality initialization, never outside the app.** The first step is the component coming to life — e.g. _"Initialization: the lib is in a 'loading' state until the `userId` input is provided."_ Never begin with "the user opens the app", "logs in", or "navigates to the Dashboard".
- **Domain (PRD derives; first match wins).** `{domain}` is **Domain** (`CONTEXT.md`). Record it in the PRD header; it must match the parent folder `docs/x/{domain}/{name}/`. First match wins:
  1. Docs already exist at `docs/x/{domain}/{name}/` → keep that folder and header. If folder `{domain}` and the `Domain` field disagree → stop and ask.
  2. Owned libs already exist → their `domain:` tags. All must agree; if they disagree → stop and ask.
  3. No docs, no owned libs — from the description / planned names: `shared-…` / said to be shared / **belongs to more than one app** → `shared`; belongs to **exactly one** app → that app's Nx name (`ng-x-boilerplate-web`, never `web`).
  4. Still unclear → stop and ask. Never default to `shared`.

  Step 2 beats step 3 (libs already under one app *are* the domain).
- **Functionality name (PRD confirms).** `{name}` takes the technology prefix of the stack it belongs to (`docs/guidelines/naming-conventions.md` → Folders). The user said "chart" and it belongs to Angular (an Angular app, or shared Angular libs) → `ng-chart`. Domain and technology are independent. Do not copy the colloquial word as `{name}`.
- **The Feature key is chosen once, recorded, and never re-derived.** It is the short uppercase key prefixing every ID this functionality produces — this PRD's ACs, the TSD's FR/BRs, and the test titles carrying them — so it is recorded in the PRD's **Feature key** field and everything downstream copies it verbatim. Drop the technology prefix and keep it short and unmistakable (`ng-chart` → `CHART`, `ng-balance-card` → `BALANCE`, `ng-user-geo` → `GEO`, `ng-x-profile` → `XPROFILE`); **grep `docs/x/` first — it must be unique across functionalities.** Never leave it to be re-derived from the folder name later: `ng-alert-badge` yields `ALERTBADGE` or `ALERT` depending on who derives it, and one functionality ends up with two ID namespaces.
- **Last Verified at create.** Write `NOT YET`. A writer cannot stamp a date. Do not copy example dates. `Last Updated` is today.
- **Acceptance Criteria carry stable, unique IDs** in the form `{NAME}-AC-01`, `{NAME}-AC-02`, … ACs are the feature's observable, product-level outcomes; they map to e2e test cases later. When updating an existing PRD, never renumber existing IDs — add new ones.
- **Write ACs as good, testable criteria.** Each AC is a single, **observable** outcome — one per AC; if it needs an "and", split it — kept **independent and deterministic**, at **product altitude** (the meaningful primary + alternate/error outcomes a user or consumer would notice), and **not** an internal/technical or component-contract detail (an output a feature merely emits to its host is a **BR** in the TSD, not an AC). Where an AC maps depends on the functionality type: **visual / visual+ / mixed / mixed+** (has UI or a page) → user-observable outcomes verified by **e2e** when e2e applies (anchor on stable `[data-cy]` / visible text); **abstract** (no UI) → observable **data-contract** outcomes (data available / loading / error / cache) verified by the **data-access** unit tests. Either way, the TSD decomposes each AC into FRs/BRs.
- **Give this PRD only ACs whose subject is ours.** Every AC asserts something about a subject; here that subject is one of four things — **data** this functionality produces or exposes, a **state** it owns (loading / empty / error / data), a **decision** it makes (which items qualify, their order, which remain after an action), or the **presence or absence** of something it places on screen. A reused component's visual attributes (colour, styling, animation) and a reused util's output format (date pattern, rounding, truncation) are their owner's subject; record the reuse under **Dependencies & Risks** / **Non-Goals & Why** instead, with no AC ID. When one sentence contains both — _"an over-threshold alert shows in the banner's red critical styling"_ — **keep the decision, shed the rendering**: the AC is that the alert is _presented as critical_; that critical looks red belongs to the banner's own PRD. This holds even when the reused lib must change **for us**: requirements follow the lib, not the requester. See [references/reuse-boundary.md](references/reuse-boundary.md).
- **Lib versions usually change nothing here.** Versions are per **lib**; a functionality has none of its own, and a `ui` going v1 → v2 for a renamed input is invisible to the product. So AC IDs carry **no** version by default. Only when a new version changes **product-observable** behaviour _and both versions stay user-reachable_ do the new version's ACs need distinguishing — then suffix the version on the **new** ones (`{NAME}-V2-AC-01`) and leave the existing ACs untouched, exactly as with any other addition. If that divergence is so wide it needs a whole parallel AC set, stop and ask whether this is really a new **functionality** rather than a version.
- **Respect provided granularity.** If the user gave exact details (API endpoints, URL query params, field names), use them verbatim; do not generalise or override them.
- **Minimise re-asking.** Reuse everything already in the brainstorm conclusions / description; only ask about genuine gaps.
- **Do not invent facts.** Unknowns go to Open Questions and are raised with the user.
- **A gap you noticed is not a requirement you may create.** Drafting surfaces outcomes the description never settled — a state with no chosen behaviour, a failure mode nobody ruled on. **The test is whether someone actually decided it**, not whether the outcome is real: undecided goes to Open Questions, and gains an AC only once answered. Never do both — a provisional AC beside an open question on the same gap is the worst case of all, because that AC is already an e2e case and a set of TSD FR/BRs by the time anyone reads the question. Write the Open Question so its answer can become an AC directly ("the goal endpoint reports no goal set — what should the card show?"), leave the state described as unspecified in the flow text, and if you believe the gap is product-critical say so in the Summary instead of closing it yourself. Covering alternate and error outcomes means covering the ones that were **decided**; it is never licence to decide them.

## Validate

**Review Checklist** — before finalising, verify:

- [ ] Target is a functionality — not a bare `util` / `api` / `app` lib, and not a **grab-bag** `ui` / `feature` lib.
- [ ] Classification matches the library-types doc (required vs optional libs); being used by other pages did not incorrectly add a `page`.
- [ ] All template sections are present, in order (Introduction first).
- [ ] No Functional Requirements and no Business Rules sections exist.
- [ ] The user journey begins at initialization, not outside the app.
- [ ] Non-Goals & Why in `README.md` records **current** excluded scope with a reason each — not a bare list, and not a history of rejected approaches (those belong in `DECISIONS.md`).
- [ ] `DECISIONS.md` exists, with `NONE.` under every heading that has no entries. Where an AC was retired or an approach rejected this cycle, that entry carries its date and reason; no retired AC remains in the Acceptance Criteria section, and no retired number was recycled.
- [ ] Every **Rejected approaches** entry names a direction the **user** weighed and dropped — none is an alternative you considered while drafting and did not pick.
- [ ] **On a `NOT YET` revision only:** an existing `TSD/` was checked for back-links, no existing AC ID was renumbered while something pointed at it, every back-link this revision breaks (dangling or mis-pointed) is listed in the Summary, and any AC number dropped is named there as a draft edit rather than left to read as a retirement.
- [ ] The **Feature key** field is filled in, unique across `docs/x/` (grepped, not assumed), and used for every `{NAME}` in the document.
- [ ] The **Domain** field is filled in and matches the parent folder `docs/x/{domain}/{name}/`.
- [ ] **On a first create:** **Last Verified** is `NOT YET`. A date was not copied from an example and today's date was not stamped.
- [ ] The **ACs Approved** field is filled in — a date **only** if the user actually approved the set during this run, otherwise `NOT YET`. No date was stamped that was not witnessed.
- [ ] Every Acceptance Criterion has a unique `{NAME}-AC-01`-style ID.
- [ ] No AC ID carries a version segment — unless a new lib version changed **product-observable** behaviour _and_ both versions stay user-reachable, in which case only the **new** ACs are suffixed (`{NAME}-V2-AC-01`) and every existing AC was left untouched.
- [ ] Each AC is one observable outcome (no "and"), independent, and not a component-contract/technical detail (those are BRs).
- [ ] Every AC's subject is ours — our data, state, decision, or what we place on screen — and none asserts a reused component's visual attributes or a reused util's output format, even where that lib must change for us.
- [ ] Reused libs/functionalities appear under Dependencies & Risks / Non-Goals & Why / Data Requirements, never as an AC.
- [ ] **On update only:** every "does not exist yet" / "must change for us" note in Dependencies & Risks was re-verified — cleared where the work landed, narrowed where it partly landed, or left with an Open Question where it could not be determined.
- [ ] **No AC describes an outcome the product no longer has**, and none states an outcome the shipped behaviour contradicts — every pre-existing AC was checked, not just the new ones.
- [ ] **On amend / retire only** — and only where **ACs Approved** carries a date, never on a `NOT YET` draft: the ID was kept (amend) or burned and never recycled (retire); the old text was shown beside the new and explicitly confirmed; the orphaned TSD FR/BRs and any e2e `it` were reported; the flow text and Non-Goals were reconciled.
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

Why this one is a gate and not a report: each AC becomes an e2e test case, and the TSD decomposes each into FRs and BRs that become unit tests. An AC that is wrong, missing or mis-scoped propagates into the technical spec and the test suite before anyone looks at it again.

Incorporate whatever they change, re-run the Review Checklist, and ask again. Only once the user has approved the ACs is the PRD done.

3. **Record the outcome in the document, not only in your report.** Stamp the PRD's **ACs Approved** field with the date the user approved the set. If you could not reach them — no channel, or they never answered — leave it reading **`NOT YET`** and say so in the Summary. **Never stamp a date you did not witness.** Your report is read once and then gone; that field is all a later reader, a plan, or the next writer has to go on, and it is what tells a future revision whether it is editing a draft or overturning an approval.

## Summary

1. Report the saved path (`docs/x/{domain}/{name}/PRD/README.md`).
2. List the AC IDs created or added (ID + one-line description), and confirm the user approved the set.
3. List any Open Questions still unanswered.

## Common mistakes

| Mistake                                               | Fix                                                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Writing a PRD for a `util` / `api` / `app` lib        | STOP — not a functionality; no `docs/x/…` PRD.                                                           |
| Writing a PRD for a grab-bag `ui` / `feature` lib     | STOP — no PRD; its items use a local `requirements/`.                                                    |
| Treating "used on page X/Y" as owning a `page`        | Consumers import this functionality; only own a `page` if _this_ name is the page.                       |
| Forcing `map`+`ui` on every mixed                     | Mixed requires `data-access`+`feature`; `map`/`ui` are optional.                                         |
| Adding Functional Requirements / Business Rules       | Remove them — they live in the TSD. Keep only ACs here.                                                  |
| Journey starts with "user opens the app / logs in"    | Start at initialization (loading state until inputs arrive).                                             |
| Acceptance Criteria without IDs                       | Give each a unique `{NAME}-AC-01` ID.                                                                    |
| Renumbering ACs when updating                         | Never renumber; add new IDs only.                                                                        |
| Minting a new AC because an outcome changed           | Same outcome, corrected wording → **amend** under the existing ID. See `references/amend-and-retire.md`. |
| Recycling a retired AC number                         | A burned number stays burned, so old test titles never resolve to a different outcome.                   |
| Retiring an AC and leaving its FR/BRs pointing at it  | Report every orphaned FR/BR and e2e `it`; they are fixed in their own runs.                              |
| Amending or retiring an AC silently                   | It reverses a user approval — show old beside new, get confirmation, name the reusers.                   |
| Generalising a provided endpoint / param              | Use the exact value the user gave.                                                                       |
| AC bundling several outcomes ("and")                  | Split into one AC per observable outcome.                                                                |
| AC that only asserts an emitted output/event          | A feature's output is a component contract → a BR in the TSD, not an AC.                                 |
| AC asserting a reused component's colour/styling      | Its owner's PRD. Keep only the decision that drove it (_presented as critical_).                         |
| AC asserting a reused util's format or rounding       | The util's own `requirements/`. Keep only that the value is displayed.                                   |
| AC covering a change we asked another team to make    | Requirements follow the lib, not the requester → Dependencies & Risks.                                   |
| Fusing our decision with their rendering in one AC    | Split: keep the decision, shed the rendering.                                                            |
| Finishing without the user approving the ACs          | Present the full set and wait. They become e2e tests and the TSD's FRs/BRs.                              |
| Guessing an answer to close an Open Question          | Ask the user. Unanswered questions stay listed, not silently resolved.                                   |
| Provisional AC for an undecided gap                   | Open Question only; the AC waits for the answer.                                                         |
| Stamping ACs Approved with a date you did not witness | Leave it NOT YET and say so in the Summary.                                                              |
| Amend/retire ceremony on a NOT YET draft              | Draft revision: rewrite freely, burn no ID, no DECISIONS.md row.                                         |
| Own unchosen alternative recorded as rejected         | Only directions the user weighed and dropped belong there.                                               |
| DECISIONS.md skipped because nothing qualified        | Always create it; NONE. under every empty heading.                                                       |
| Draft rewrite that breaks TSD back-links silently     | Check the ID Index first; list every one, dangling or mis-pointed.                                       |
| Dropped AC number left unexplained                    | Say in the Summary which numbers went and that none was approved.                                        |
| Renumbering an AC a TSD back-links                    | Leave the gap; renumbering re-points back-links at the wrong AC.                                         |
| Omitting `{domain}` from the docs path                 | Write `docs/x/{domain}/{name}/` after deriving Domain                                                     |
| Using the colloquial name as `{name}`                 | Apply the stack's technology prefix (`chart` + Angular → `ng-chart`)                                     |
| Stamping Last Verified with today's date at create    | Write `NOT YET`                                                                                          |
| Defaulting Domain to `shared`                         | Stop and ask when the ladder does not settle it                                                          |
