# Requirements — {KEY} ({util version folder or app name})

> Local FR/BR registry for unit tests. **Not** a `docs/x/` PRD/TFS.
>
> - **util:** IDs are `UTIL-{KEY}-FR-##` / `UTIL-{KEY}-BR-##`
> - **app:** IDs are `APP-{KEY}-FR-##` / `APP-{KEY}-BR-##`
> - Create/update this file when writing unit tests; never renumber existing IDs.
> - `describe` ↔ FR, `it` ↔ BR.

## UTIL-DATE_FORMAT-FR-01 — formats a Date as an ISO date string

- `UTIL-DATE_FORMAT-BR-01` — Given a valid Date; When `v1DateFormat` runs; Then it returns `YYYY-MM-DD`.
- `UTIL-DATE_FORMAT-BR-02` — Given an invalid Date; When `v1DateFormat` runs; Then it returns an empty string.

## UTIL-DATE_FORMAT-FR-02 — respects an explicit timezone override

- `UTIL-DATE_FORMAT-BR-03` — Given a Date and timezone `UTC`; When `v1DateFormat` runs with that override; Then the calendar day matches UTC.
