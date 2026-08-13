# User Stories — decision history ({app} e2e)

**Last Verified:** 2026-08-13

> History for this app's US registry. [README.md](README.md) lists what is **live**; this file keeps what is **gone**, so a burned ID still resolves.
>
> - A US ID is **never reused**. An old `describe` title, commit or review comment must still lead a reader to what that story was and why it went.
> - **No writer owns this file** — the e2e work maintains it. Unlike a functionality's `PRD/DECISIONS.md`, a retirement here is **reported, not gated**: these rows were never user-approved, so there is no approval to overturn. Report old beside new, and name the other functionalities whose ACs the story grouped — their specs reference the same US ID.

## Retired User Stories

A US is retired only when **every** AC it grouped has been retired. Losing some of its ACs is an amend in `README.md`, not a retirement.

| US ID       | Was                                                            | Retired    | Why                                                                                                     |
| ----------- | -------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `XPI-US-03` | As a user, I can retry loading a profile after a network error | 2026-08-13 | Its only AC (`XPI-AC-04`) was retired when the widget moved to automatic retry — nothing left to drive. |

## Merged User Stories

Two stories collapsed into one. The absorbed ID burns and points at its successor, so a spec still referencing it can be re-pointed.

| US ID       | Was                                                  | Merged into | Merged     | Why                                                                                 |
| ----------- | ---------------------------------------------------- | ----------- | ---------- | ----------------------------------------------------------------------------------- |
| `XPI-US-04` | As a user, I can see a profile's country on the card | `XPI-US-01` | 2026-08-13 | The country became part of the same "open full details" journey, not its own story. |
