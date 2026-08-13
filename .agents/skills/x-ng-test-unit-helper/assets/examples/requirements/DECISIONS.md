# Requirements — decision history ({KEY})

- **Last Verified** (YYYY-MM-DD): {date}

> Burned IDs for this registry. [README.md](README.md) lists what is **live**; this file keeps what is **gone**, so a number is never reused.
>
> - **No writer owns these files** — the unit-test work maintains them. A retire here is **reported, not gated**: these entries were never user-approved, so there is no approval to overturn. Report old text beside new, and for a **shared** lib name its consumers — a semantics change reaches every consumer outside this cycle's test scope.
> - **`{KEY}` does not carry the version** (`date-format-v1` and `date-format-v2` both key as `DATE_FORMAT`), so the ID space is shared across versions while these files are per-version. **A new version folder starts by copying its predecessor's `DECISIONS.md`** — otherwise deleting the old folder frees numbers the successor could re-mint.
> - Only retirement lands here. An **amended** requirement keeps its ID and is rewritten in `README.md`; nothing is recorded here for it.

## Retired requirements

A requirement is retired when the behaviour it describes no longer exists. Its test is deleted in the same change.

| ID                       | Was                                                                                                | Retired    | Why                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| `UTIL-DATE_FORMAT-BR-04` | Given a Date and locale `sv-SE`; When `v1DateFormat` runs; Then it returns `YYYY-MM-DD` unchanged. | 2026-08-13 | Locale handling moved to the caller — the formatter no longer takes one.   |
| `UTIL-DATE_FORMAT-FR-03` | pads two-digit years to four                                                                       | 2026-08-13 | Two-digit input is rejected upstream now, so the whole `describe` is gone. |
