# PRD decisions — ng-x-profile

- **Last Updated** (YYYY-MM-DD): 2026-08-13

## 🗄️ Retired Acceptance Criteria

| AC               | What it required                                                 | Retired    | Why                                                                                                         | Replaced by      |
| ---------------- | ---------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| `XPROFILE-AC-04` | A "refresh profile" control was presented on the expanded detail | 2026-06-18 | The profile is re-fetched whenever the host re-initializes the lib, so a manual control had no distinct use | —                |
| `XPROFILE-AC-02` | The compact card presented the user's full name                  | 2026-07-02 | Legal review: full name is PII we must not show in a list context; first name plus initial is sufficient    | `XPROFILE-AC-07` |

> `XPROFILE-AC-04` and `XPROFILE-AC-02` are **burned** — never re-minted. `AC-07` is the replacement for the second; the first was simply dropped.

## 🚫 Rejected approaches — product

- **A single card that expands in place instead of two views** — _2026-05-04_. Considered because it avoids a second screen. Rejected: the expanded content needs the user's history, which is a second fetch, so the card would have shown a loading state inside an already-loaded card. Went with two exported components.
- **Showing presence ("online now") on the compact card** — _2026-05-11_. Considered as engagement value. Rejected: no presence source exists and inventing one would have pulled a websocket dependency into a `visual` functionality. Deferred, not dropped — revisit if presence lands as its own abstract functionality.
- **Letting the host pass a pre-fetched user object** — _2026-06-18_. Considered to save a fetch when the host already has one. Rejected: two ways to supply the same data doubled the states to test and let hosts pass a stale user. The lib always reads the shared user data-access.

## 🔁 Reversed decisions

- **Truncating long names with an ellipsis** — taken _2026-05-04_, reversed _2026-07-02_. Introduced so long names could not break the card layout. Reversed when `AC-02` retired: with first-name-plus-initial there is nothing long enough to truncate, and the ellipsis was hiding the initial on narrow screens.
