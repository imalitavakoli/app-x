<!--
Template for `docs/x/{name}/TSD/DECISIONS.md` — this functionality's **technical** decision history.
Its sibling `README.md` + `{libtype}-v{n}.md` files state what is true NOW; this file records what stopped being true and what was ruled out.
Remove every `>` helper note from the final draft; keep every heading you use.
-->

# TSD decisions — {name}

- **Last Updated** (YYYY-MM-DD): {date}

> This file is **append-mostly history**, so it carries no `Last Verified`: nothing in it is a claim about current behaviour, so there is nothing to verify against the code. `README.md` carries that field.
>
> No FR/BR here is ever tested, and **no ID here appears in the 🧭 ID Index** — the Index lists live IDs only. That separation is the point: the Index answers "what is covered?", this file answers "what used to be, and what did we rule out?".

## 🗄️ Retired FR/BRs

> An FR or BR whose behaviour no longer exists. Moved here — not deleted — so the number stays traceable and nobody re-mints it. Its **ID Index row is removed** at the same time, along with its PRD AC back-link.
>
> **The number is burned.** `{NAME}_{OWNER}_BR-08` never returns, so an old commit, test title or review comment always resolves to the right rule.

| ID                     | Lib file (was)  | What it required                              | Retired | Why                                 | Replaced by            |
| ---------------------- | --------------- | --------------------------------------------- | ------- | ----------------------------------- | ---------------------- |
| `{NAME}_{OWNER}_BR-08` | `feature-v1.md` | A retry control rendered in the failure state | {date}  | Product dropped manual retry        | —                      |
| `{NAME}_{OWNER}_FR-03` | `ui-v1.md`      | Rendering rules keyed by a `variant` input    | {date}  | `variant` collapsed into `dataType` | `{NAME}_{OWNER}_FR-07` |

> Record the **reason**, not just the fact. And when a retired entry had a PRD AC, say whether that AC retired too — an AC left with no FR/BR is either a gap or a retirement nobody completed.

## 🚫 Rejected approaches — technical

> A technical option that was considered and **not** taken, with why it lost. This is its only durable record; the plan and brainstorm that weighed it do not survive the cycle.
>
> Keep **current** technical non-goals in `README.md` → Non-Goals & Why ("no owned `ui` lib — the row is a reused `feature`"). Those describe what is true now. This section is for **decisions**: options weighed and dropped.

- **{Option}** — _{date}_. Considered because {reason}. Rejected because {reason it lost}. {What we did instead.}
- **`entity` structure for the `data-access`** — _{date}_. Considered as the default CRUD shape. Rejected: the write needs an `extra` payload beyond the entity, so it is not pure CRUD. Went single-instance.
- **One exported component with a `dataType` switch** — _{date}_. Considered to keep the lib small. Rejected: the two views differ in data and lifecycle, so a switch made both harder to test. Went with two exported components.

## 🔁 Reversed decisions

> A technical decision that was made, shipped, and later undone — distinct from "rejected" (never taken) and "retired" (an FR/BR removed). Record it when the reversal itself is the useful history, e.g. a lib split that was later merged back.

- **{Decision}** — taken _{date}_, reversed _{date}_. {Why it was taken, and what changed.}

## 🧹 Retired lib versions

> Only when a **shared** lib's version folder is removed from the workspace (all dependents migrated off it). Its FR/BRs move to the Retired table above; this section records that the version itself is gone, so a reader of an old branch knows why its spec vanished.

- **`{domain}-ui-ng-{name}` v1** — removed _{date}_. Last dependent migrated to v2 on {date}. Its FR/BRs are in the Retired table.

> `NONE.` under any heading that has no entries yet — an empty heading shows the category was considered.
