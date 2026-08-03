# PRD — {name}

> Product Requirements Document for the **{name}** functionality. Replace `{NAME}` with one consistent feature key derived from the functionality name (e.g. `balance-card` → `BALANCE`). Remove every `>` helper note from the final draft; keep every section heading **with its icon**.

- **Last Updated** (YYYY-MM-DD): {date}
- **Owner**: {owner}

## 📖 Introduction

> One short paragraph: what is the `{name}` functionality and what value does it deliver? A newcomer should understand the feature from this alone.

## 🗺️ Overview

> The bigger picture. What problem does it solve? What is in scope? Where does it appear?

## 🚫 Non-Goals & Why

> What this functionality deliberately does **not** do — and the reason for each. Cover both: scope left out (e.g. `not building the something view — the X functionality already owns it`), and any **approach considered and rejected**, with why it lost. This is the only place a future reader learns that a choice was deliberate rather than accidental, so record the reasoning, not just the exclusion. Nothing here becomes an Acceptance Criterion.

## 👥 Users

> Who uses it and in what role (e.g. `logged-in users`, `admins`)? Is an authenticated session required? (For an abstract functionality, the "users" are the other functionalities that consume its data.)

## 🔒 Permissions & Security

> Who can access this feature? Is it guarded (shown to whom, hidden from whom)? Any auth requirements, or sensitive data (e.g. `something` PII) to handle?

## 🗄️ Data Requirements

> What data does the **natural entry lib** need, and where does it come from? (Natural entry = the lib other functionalities initialize to use this one as a whole — see `docs/getting-started/library-types-and-their-relationship.md`.)
>
> - **Abstract** (entry = `data-access`; optional own `map`): list API endpoints and/or local sources — SQLite, Local Storage, Cookies. e.g. `GET /users/{id}/something` (auth), or `read 'blahblah' from Local Storage`.
> - **Visual** (entry = `feature` when present, else `ui`; data usually from another functionality's `data-access`): list the entry component's **inputs**, and name any shared data-access it reads from.
> - **Mixed** (entry = `feature`; owns `data-access`, optional `map`/`ui`): list the `feature` **inputs** and what it fetches/reads itself (API and/or local).
> - **`visual+`** (owns a `page`; entry = `feature` when present, else `page`): same as visual, plus **URL query params** on the `page`.
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
