# Requirements — {KEY} ({util version folder, app name, or grab-bag item folder})

- **Last Verified** (YYYY-MM-DD): {date}

> Local **live** FR/BR registry for unit tests. **Not** a `docs/x/` PRD/TSD. Burned IDs live in [DECISIONS.md](DECISIONS.md) beside this file.
>
> - **util:** IDs are `UTIL-{KEY}-FR-##` / `UTIL-{KEY}-BR-##`
> - **app:** IDs are `APP-{KEY}-FR-##` / `APP-{KEY}-BR-##`
> - **grab-bag `ui` / `feature` item:** IDs are `UI-{KEY}-FR-##` / `FEA-{KEY}-FR-##` (and `-BR-##`)
> - Create/update this file when writing unit tests; never renumber existing IDs.
> - `describe` ↔ FR, `it` ↔ BR.
> - This file lists only what is **live**. A requirement whose behaviour is gone **moves** to `DECISIONS.md` — it is never deleted outright, so its number stays traceable and can never be reused.
> - **`Last Verified`** is stamped by the post-execution verification step — including when nothing needed changing. Older than the lib's last commit ⇒ unverified against current behaviour.

## UTIL-DATE_FORMAT-FR-01 — formats a Date as an ISO date string

- `UTIL-DATE_FORMAT-BR-01` — Given a valid Date; When `v1DateFormat` runs; Then it returns `YYYY-MM-DD`.
- `UTIL-DATE_FORMAT-BR-02` — Given an invalid Date; When `v1DateFormat` runs; Then it returns an empty string.

## UTIL-DATE_FORMAT-FR-02 — respects an explicit timezone override

- `UTIL-DATE_FORMAT-BR-03` — Given a Date and timezone `UTC`; When `v1DateFormat` runs with that override; Then the calendar day matches UTC.
