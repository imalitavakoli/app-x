# PRD — ng-user-geo

- **Last Updated**: 2026-07-26
- **Owner**: Ali

## 📖 Introduction

The **ng-user-geo** functionality resolves the current user's geographic context — country and preferred currency — from the server, so other functionalities can localise prices, formats, and content without each fetching it themselves.

## 🗺️ Overview

Many functionalities need the user's country and currency (e.g. to format money or show region-specific content). ng-user-geo centralises that lookup behind a shared data-access lib. It is **abstract**: it has no UI of its own; it exposes data to other libs.

- In scope: fetching and caching the user's geo context; exposing it to consumers.
- Out of scope: any visual presentation; changing the user's region (a settings UI is a separate functionality).

## 👥 Users

Indirectly every authenticated user of the app — but ng-user-geo has no direct UI. Its "users" are the other functionalities that consume its data.

## 🔒 Permissions & Security

Requires an authenticated session (the lookup is per-user). No sensitive data beyond country/currency is stored.

## 🗄️ Data Requirements

The last piece of the puzzle is the `data-access` lib, so this lists the sources it reads:

- **Endpoint:** `GET /users/{id}/geo` (authenticated).
- **Path param:** `id` — the logged-in user's ID.
- **Sample success response:**
  ```json
  { "country": "SE", "currency": "SEK" }
  ```
- Errors: any non-2xx or network failure → error state exposed to consumers.

## 🧭 User Experience & Flows

N/A — abstract functionality (no UI).

## 📊 Analytics & Tracking

None.

## ⚠️ Dependencies & Risks

- Depends on the auth session for the user ID.
- Risk: if the geo endpoint is slow, consumers must handle the pending state (exposed via the data-access lib's loading flags).

## ✔️ Acceptance Criteria

- **GEO-AC-01** — Given an authenticated user, when a consumer requests geo data, then the user's `country` and `currency` become available once loaded.
- **GEO-AC-02** — Given the geo request is in flight, then consumers observe a pending/loading state and no partial data.
- **GEO-AC-03** — Given the geo request fails, then consumers observe an error state and no stale data is served for the failed key.
- **GEO-AC-04** — Given geo data was already loaded within its cache window, when requested again, then it is served from cache without a new request.

## ❓ Open Questions

- Should currency fall back to a default if the server omits it?
- What is the cache TTL for geo data?

## 📎 Appendices

None.
