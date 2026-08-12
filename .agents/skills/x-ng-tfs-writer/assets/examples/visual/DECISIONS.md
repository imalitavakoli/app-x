# TFS decisions — x-profile

- **Last Updated** (YYYY-MM-DD): 2026-08-13

## 🗄️ Retired FR/BRs

| ID                    | Lib file (was) | What it required                                                              | Retired    | Why                                                                                   | Replaced by           |
| --------------------- | -------------- | ----------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- | --------------------- |
| `XPROFILE_CARD_BR-06` | `ui.md`        | A `[data-cy="x-profile-v1_card_refresh"]` control rendered on the detail view | 2026-06-18 | `XPROFILE-AC-04` retired — the manual refresh control was removed from the product    | —                     |
| `XPROFILE_CARD_BR-02` | `ui.md`        | The card rendered the user's full name in `…_card_name`                       | 2026-07-02 | `XPROFILE-AC-02` retired on PII grounds; the card now renders first name plus initial | `XPROFILE_CARD_BR-09` |
| `XPROFILE_CARD_BR-07` | `ui.md`        | A name longer than 20 chars was truncated with an ellipsis                    | 2026-07-02 | Truncation reversed with the name change — nothing is long enough to truncate         | —                     |

> All three numbers are **burned**. None appears in the 🧭 ID Index any more, and their PRD AC back-links went with them. `BR-09` is the replacement for the second only.

## 🚫 Rejected approaches — technical

- **One exported component with a `dataType` switch** — _2026-05-04_. Considered to keep the lib to a single component. Rejected: the compact card and the expanded detail differ in data _and_ lifecycle, so a switch made both harder to test in isolation. Went with two exported components.
- **Owning a `map` + `data-access` for the profile** — _2026-05-04_. Considered so the functionality would be self-contained. Rejected: the shared `ng-user` abstract functionality already fetches and caches this data, so ours would have duplicated its request and its cache. We reuse `V1UserFacade`.
- **A `page` lib for the expanded detail** — _2026-05-11_. Considered because the detail felt screen-sized. Rejected: nothing routes to it — it is always opened from a host page — so a `page` lib would have added a route no one navigates to. It opens in the reused popup instead.
- **Asserting the popup's rendered size in our BRs** — _2026-06-02_. Considered while wiring the `size` input. Rejected: how a size renders is `ng-popup`'s behaviour, not ours. Our BR asserts only that the popup instance **receives** `size = 'lg'`.

## 🔁 Reversed decisions

- **Splitting the two components into separate `ui` libs** — taken _2026-05-20_, reversed _2026-06-02_. Split so each could version independently. Reversed: they share the whole avatar/name/meta rendering block, so the split produced a third lib holding the shared parts, and three libs for one product concern was worse than one. Merged back into `shared-ui-ng-x-profile`.

## 🧹 Retired lib versions

_NONE._ Both `shared-ui-ng-x-profile` and `shared-feature-ng-x-profile` are still at v1.
