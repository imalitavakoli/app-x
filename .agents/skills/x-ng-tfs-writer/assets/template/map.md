<!--
Template for `docs/x/{name}/TFS/map.md` — the `map` lib spec + its FR/BR.
Include this file only when this functionality **owns** a `map` lib (API endpoint or external asset load — not Local Storage / SQLite alone).
Lib name uses the domain: `{domain}-map-ng-{name}`. Remove `>` helpers from the final draft.
Register every FR/BR ID in the README's 🧭 ID Index.
-->

### 🗺️ 'map' Library Specification

> `map` libs fetch + map API/JSON into `*_Map*` interfaces; they extend `V1BaseMap`.

#### Lib Name

`{domain}-map-ng-{name}`

#### Class & Methods

> The proxy class + each method: HTTP method, URL, auth, params, and the `*_Map*` return type. Record any user-provided endpoint/param **verbatim**.

#### Interfaces

> Two families:
>
> - **`*_Api*`** — reflect the **exact** response schema the server returns (whatever casing/shape the API uses; do not force camelCase here).
> - **`*_Map*`** — reshape the response to be easy for `ui` libs to consume: camelCase, and drop/extract/parse whatever you can so the parsing happens here (in the map) rather than in the `ui` component that later receives the `*_Map*` type as an input.

#### Functional Requirements & Business Rule Breakdown

> `describe`↔FR, `it`↔BR. FRs/BRs for the mapping (correct field mapping, parsing, error normalisation), in `Given/When/Then`. Back-link the PRD AC each implements where relevant.

#### Error Handling & Edge Cases

> How the `map` parses/normalises errors (sentinel codes, etc.).
