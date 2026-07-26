# PRD — {name}

> Product Requirements Document for the **{name}** functionality. Replace `{NAME}` with one consistent feature key derived from the functionality name (e.g. `balance-card` → `BALANCE`). Remove every `>` helper note from the final draft; keep every section heading **with its icon**.

## 📖 Introduction

> One short paragraph: what is the `{name}` functionality and what value does it deliver? A newcomer should understand the feature from this alone.

## 🗺️ Overview

> The bigger picture. What problem does it solve? What is in scope and out of scope? What are the non-goals (e.g. `not building the something view`)? Where does it appear?

## 👥 Users

> Who uses it and in what role (e.g. `logged-in users`, `admins`)? Is an authenticated session required? (For an abstract functionality, the "users" are the other functionalities that consume its data.)

## 🔒 Permissions & Security

> Who can access this feature? Is it guarded (shown to whom, hidden from whom)? Any auth requirements, or sensitive data (e.g. `something` PII) to handle?

## 🗄️ Data Requirements

> What data does the **last piece of the puzzle** need, and where does it come from? (The last piece is the lib that other functionalities initialize.)
>
> - **Abstract** (last piece = `data-access`): list the API endpoints to call and/or the local sources to read — SQLite, Local Storage, Cookies. e.g. `GET /users/{id}/something` (auth), or `read 'blahblah' from Local Storage`.
> - **Visual** (last piece = `feature`; data usually comes from a shared abstract functionality's `data-access` lib): list the `feature` component's **inputs** (e.g. `userId`, `showBlahblah`), and name the shared data-access it reads from.
> - **Mixed** (last piece = `feature`, which owns its `map`/`data-access`): list the `feature` component's **inputs** AND the API endpoints it fetches itself.
> - **Page-level (`visual+` / `mixed+`)**: same as visual / mixed, and additionally the `page` lib's inputs arrive as **URL query params** — list them here.
>
> If the user provided exact endpoints, params, or field names, record them **verbatim**. Do not invent schemas — mark unknowns as Open Questions.

## 🧭 User Experience & Flows

> The user journey, written from the functionality's own lifecycle.
>
> **Start at initialization — never outside the app.** The first step is the component coming to life. Good: *"Initialization: the lib is in a 'loading' state until the `userId` input is provided."* Not acceptable: "the user opens the app / logs in / navigates to the Dashboard".
>
> Then describe the primary flow (loading → data → interactions → outcomes) and any alternative / edge flows (empty, error, permission-denied). e.g. `when data is ready, show something` → `on click, emit clickedBlahblah`.
>
> For page-level functionalities (`visual+` / `mixed+`), include navigation steps and outcomes (route changes) in the flows and the ACs.
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
