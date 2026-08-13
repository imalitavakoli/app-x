# PRD — {name}

> Product Requirements Document for the **{name}** functionality. Replace `{NAME}` throughout with the **Feature key** recorded below. Remove every `>` helper note from the final draft; keep every section heading **with its icon**.

- **Last Updated** (YYYY-MM-DD): {date}
- **Last Verified** (YYYY-MM-DD): {date}
- **Owner**: {owner}
- **Feature key**: {NAME}

> **Feature key** — the short uppercase key that prefixes every ID derived from this functionality: this PRD's ACs (`{NAME}-AC-01`), the TFS's FR/BRs (`{NAME}_{OWNER}_FR-01`), and the test titles that carry them. **Chosen once, here, and never re-derived.** Drop the `ng-` prefix and keep it short and unmistakable — one or more of the name's distinctive segments (`ng-balance-card` → `BALANCE`, `ng-user-geo` → `GEO`, `ng-x-profile` → `XPROFILE`). It must be **unique across all functionalities** in `docs/x/` — grep before choosing. Everything downstream copies this field verbatim; it is not re-derived from the folder name, because two independent derivations of `ng-alert-badge` (`ALERTBADGE` vs `ALERT`) split one functionality's ID space in half.

> **Last Updated vs Last Verified** — `Last Updated` is when this document's text last changed. `Last Verified` is when someone last confirmed it still matches the shipped code, **including when nothing needed changing** — that is the outcome a writer can never record, so only the post-execution verification step stamps it. A `Last Verified` older than the functionality's last commit means the PRD is unverified against current behaviour.

## 📖 Introduction

> One short paragraph: what is the `{name}` functionality and what value does it deliver? A newcomer should understand the feature from this alone.

## 🗺️ Overview

> The bigger picture. What problem does it solve? What is in scope? Where does it appear?

## 🚫 Non-Goals & Why

> What this functionality deliberately does **not** do **today** — and the reason for each. This is **current scope**: e.g. `not building the something view — the X functionality already owns it`. Keep it short; it is what a reader needs to understand the boundary of the feature.
>
> **An approach considered and rejected does not belong here** — it is decision _history_ and grows without bound, so it goes in `DECISIONS.md` → Rejected approaches, with the date and why it lost. The split: this section says _what is out of scope now_; `DECISIONS.md` says _what we weighed and dropped_.
>
> Nothing here becomes an Acceptance Criterion.

## 👥 Users

> Who uses it and in what role (e.g. `logged-in users`, `admins`)? Is an authenticated session required? (For an abstract functionality, the "users" are the other functionalities that consume its data.)

## 🔒 Permissions & Security

> Who can access this feature? Is it guarded (shown to whom, hidden from whom)? Any auth requirements, or sensitive data (e.g. `something` PII) to handle?

## 🗄️ Data Requirements

> What data does the **natural entry lib** (`CONTEXT.md`) need, and where does it come from? Which lib that is per functionality type: `docs/getting-started/library-types-and-their-relationship.md`.
>
> - **Abstract** (entry = `data-access`; optional own `map`): list API endpoints and/or local sources — SQLite, Local Storage, Cookies. e.g. `GET /users/{id}/something` (auth), or `read 'blahblah' from Local Storage`.
> - **Visual** (entry = `feature` when present, else `ui`; data usually from another functionality's `data-access`): list the entry component's **inputs**, and name any shared data-access it reads from.
> - **Mixed** (entry = `feature`; owns `data-access`, optional `map`/`ui`): list the `feature` **inputs** and what it fetches/reads itself (API and/or local).
> - **`visual+`** (owns a `page`; entry = `page`): list page **URL query params**, and any inputs the page (or its optional `feature` / `ui`) needs from elsewhere — data usually from another functionality's `data-access`.
> - **`mixed+`** (must own `page` + `data-access`; entry = `page`): list page **URL query params** and the owned data sources (API and/or local).
>
> Being composed into other pages does **not** add query-param / page requirements here — those belong to the consumer pages' own docs.
>
> If the user provided exact endpoints, params, or field names, record them **verbatim**. Do not invent schemas — mark unknowns as Open Questions.

## 🧭 User Experience & Flows

> The user journey, written from the functionality's own lifecycle.
>
> **Start at initialization — never outside the app.** The first step is the component coming to life. Good: _"Initialization: the lib is in a 'loading' state until the `userId` input is provided."_ Not acceptable: "the user opens the app / logs in / navigates to the Dashboard".
>
> Then describe the primary flow (loading → data → interactions → outcomes) and any alternative / edge flows (empty, error, permission-denied). e.g. `when data is ready, show something` → `on click, emit clickedBlahblah`.
>
> Only when **this** functionality owns a `page` (`visual+` / `mixed+`), include navigation steps and outcomes (route changes) in the flows and the ACs. If other pages merely compose this functionality, do not invent routes for it.
>
> **Abstract functionalities (no UI):** replace this section's body with `N/A — abstract functionality (no UI).` and omit the sub-headings.

### Primary flow

> Numbered steps, starting at initialization.

### Alternative / edge flows

> Loading, empty, error, and any conditional flows.

## 📊 Analytics & Tracking

> What events should be tracked and when? (e.g. `something_clicked` with `{ blahblah }`.) `None.` if not applicable.

## ⚠️ Dependencies & Risks

> Which functionalities / libs / external services does this depend on (e.g. the shared `something` data-access)? What are the known risks (e.g. `blahblah could be slow`)?
>
> **This is where reuse lives — never as an Acceptance Criterion.** Per dependency, say what it provides and its state: used **as-is**; **does not exist yet**; or **must change for us**. For the last two, name the exact surface needed and which of this PRD's ACs it blocks — a dependency that can hold up an AC is a real delivery risk. The requirements for that creation or change belong to the dependency's own docs (another functionality's PRD/TFS, a `util`/`app`'s own `requirements/`), never to this PRD.
>
> **Keep these notes true on update.** They describe the state when written. When updating this PRD, re-read this section first: drop "does not exist yet" once it exists, drop "must change for us" once the surface has landed (narrowing it if only part landed), and remove the matching blocked-AC note with it. If you cannot tell whether it landed, leave it and raise it under Open Questions — never clear it on assumption. Do not add a "this was accurate when written" disclaimer; **Last Updated** above already says that.

## ✔️ Acceptance Criteria

> The feature's **observable, product-level outcomes** — what a user (or an automated e2e test) can verify from the outside. Each gets a stable unique ID `{NAME}-AC-01`, `{NAME}-AC-02`, …
>
> ACs later map to **e2e test cases** (grouped under user stories in the e2e app), so they are higher-level than the TFS's Business Rules. Write each as an observable outcome; Given/When/Then is encouraged. When updating this PRD, never renumber existing IDs — add new ones.

- **{NAME}-AC-01** — Given `something`, when `blahblah`, then `…`
- **{NAME}-AC-02** — Given `something`, then `…`

## ❓ Open Questions

> Anything unknown or unconfirmed (e.g. `exact schema of something?`). Raise these with the user.

## 📎 Appendices

> Optional: links, mockups, glossary, external references. `None.` if empty.
