# PRD — ng-profile-info

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## 📖 Introduction

The **ng-profile-info** functionality shows the logged-in user's profile details (name, country, bio) together with their credit balance in a card, with a "Read more" action and a style toggle. It fetches its own data.

## 🗺️ Overview

ng-profile-info is a **mixed** functionality (map + data-access + ui + feature): it fetches profile and credit data from the server, then presents them in an interactive card that other pages (e.g. the Dashboard) compose.

- In scope: fetching profile + credit; presenting the card; "Read more" and style-toggle interactions; loading/error states.
- Out of scope: the details view opened by "Read more" (a separate functionality); editing the profile.

## 👥 Users

Authenticated users viewing a page that composes the ng-profile-info card (e.g. the Dashboard).

## 🔒 Permissions & Security

Requires an authenticated session. The card must only ever show the logged-in user's own data, and is not shown to logged-out users.

## 🗄️ Data Requirements

The last piece of the puzzle is the `feature` lib, which owns its own `map`/`data-access` — so this lists both its inputs and the endpoints it fetches:

- **`feature` component inputs:**
  - `userId` — required; whose profile to show.
  - `showBtnReadMore` — optional boolean (default `true`).
- **Profile:** `GET /users/{id}/profile` (authenticated) → `{ fullName, country, bio, dateOfBirth }`.
- **Credit detail:** `GET /users/{id}/credit?type=detail` (authenticated) → `{ balance, balanceCurrency, updatedAt }`.
- `id` is the logged-in user's ID. Any non-2xx / network failure → error state.
- Some credit errors are expected exceptions (e.g. `USER_MISSING_DETAIL_DATA`) and must NOT surface as a visible error.

## 🧭 User Experience & Flows

### Primary flow

1. Initialization: the card is in a 'loading' state until the `userId` input is provided.
2. Once `userId` is set, the functionality fetches profile and credit data; the card stays in loading until all required data is ready.
3. When data is ready, the card shows the name, country, bio, and the currency-formatted balance, plus a "Read more" button and a style toggle.
4. Clicking "Read more" emits a `clickedReadMore` event (the composing page decides what opens).
5. Toggling the style switches the card between 'rounded' and 'sharp' and emits `clickedStyle`.

### Alternative / edge flows

- Loading: a skeleton is shown until all data is ready (no partial data flashes).
- Error: if profile or credit fails (excluding expected exceptions), show an error popup.
- Expected credit exception (`USER_MISSING_DETAIL_DATA`): treated as normal — no error shown, the rest of the card renders.

## 📊 Analytics & Tracking

- Track `profile_info_read_more_clicked` on "Read more".
- Track `profile_info_style_changed` with the chosen style.

## ⚠️ Dependencies & Risks

- Depends on shared credit and profile data-access/map libs, and a shared popup UI lib.
- Risk: two data sources must both be ready before render — partial data must not flash.

## ✔️ Acceptance Criteria

- **PROFILE-AC-01** — Given no `userId` yet, then the card shows a loading state.
- **PROFILE-AC-02** — Given a `userId`, when profile and credit data are ready, then the card shows the full name, country, bio, and currency-formatted balance.
- **PROFILE-AC-03** — Given data is still loading, then the card shows a skeleton and no partial data.
- **PROFILE-AC-04** — Given the "Read more" button is clicked, then a `clickedReadMore` event is emitted.
- **PROFILE-AC-05** — Given the style toggle is used, then the card switches between rounded and sharp and emits the chosen style.
- **PROFILE-AC-06** — Given a non-exception fetch error, then an error popup is shown.
- **PROFILE-AC-07** — Given the expected `USER_MISSING_DETAIL_DATA` exception, then no error is shown and the rest of the card renders.

## ❓ Open Questions

- Does "Read more" navigate to a route or open a modal?
- Should the bio be truncated with a "show more"?

## 📎 Appendices

None.
