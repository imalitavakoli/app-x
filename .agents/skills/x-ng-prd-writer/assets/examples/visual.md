# PRD — ng-avatar-badge

## 📖 Introduction

The **ng-avatar-badge** functionality displays a user's avatar image, name, and online status as a compact badge, and lets the user click it to trigger a details action. It presents user data that a shared functionality provides — it does not fetch data itself.

## 🗺️ Overview

ng-avatar-badge is a **visual** functionality (ui + feature) with no data-access of its own. It reads the user's data from the shared **user** abstract functionality's data-access lib, then presents it and emits interaction events.

- In scope: rendering avatar + name + online dot; emitting a click event; a loading state until the user data is available.
- Out of scope: fetching or storing user data (owned by the shared `user` functionality); deciding what a click does (the composing page decides).

## 👥 Users

Any authenticated user viewing a screen that composes the badge (e.g. a header or a list row).

## 🔒 Permissions & Security

No direct data access or auth logic — it presents data from the shared `user` functionality. Visibility is decided by the composing page/feature.

## 🗄️ Data Requirements

- **`feature` component inputs:**
  - `userId` — whose badge to show.
  - `showOnlineDot` — optional boolean (default `true`).
- **Data source:** the user data (`fullName`, `avatarUrl`, `isOnline`) is read from the shared **user** abstract functionality's data-access lib (`shared-data-access-ng-user`); ng-avatar-badge calls no API itself.
- If the user data is not yet available, the badge stays in a loading state.

## 🧭 User Experience & Flows

### Primary flow

1. Initialization: the badge is in a 'loading' state until the `userId` input is provided.
2. Once `userId` is set, the badge reads that user's data from the shared `user` data-access; it stays in loading until the data is available.
3. When the data is available, the badge renders the avatar image, the full name, and (if `showOnlineDot`) an online/offline dot.
4. When the user clicks the badge, it emits a `clicked` event; the composing page decides the outcome.

### Alternative / edge flows

- Missing `avatarUrl` in the user data → show a fallback placeholder avatar.
- User data unavailable (still loading, or errored upstream) → remain in the loading/neutral state.

## 📊 Analytics & Tracking

- Track `avatar_badge_clicked` when the badge is clicked (property: whether the user was online).

## ⚠️ Dependencies & Risks

- Depends on the shared **user** abstract functionality (`shared-data-access-ng-user`) for its data, and a shared avatar/image UI lib for the placeholder.
- Risk: very long names must truncate without breaking layout.

## ✔️ Acceptance Criteria

- **AVATAR-AC-01** — Given no `userId` yet, then the badge shows a loading state and no avatar or name.
- **AVATAR-AC-02** — Given a `userId` and the user's data is available, then the badge shows the avatar image, the full name, and the online dot when `showOnlineDot` is true.
- **AVATAR-AC-03** — Given `showOnlineDot` is false, then no online dot is shown.
- **AVATAR-AC-04** — Given the badge is clicked, then a `clicked` event is emitted.
- **AVATAR-AC-05** — Given the user's data has no `avatarUrl`, then a fallback placeholder avatar is shown.

## ❓ Open Questions

- What is the exact fallback avatar asset?
- Should the online dot have a tooltip?

## 📎 Appendices

None.
