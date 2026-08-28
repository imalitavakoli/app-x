<!--
Template for `docs/x/{domain}/{name}/PRD/DECISIONS.md` — this functionality's **product** decision history.
Its sibling `README.md` states what is true NOW; this file records what stopped being true and what was ruled out.
Remove every `>` helper note from the final draft; keep every heading you use.
-->

# PRD decisions — {name}

- **Last Updated** (YYYY-MM-DD): {date}

> This file is **append-mostly history**, so it carries no `Last Verified`: nothing in it is a claim about current behaviour, so there is nothing to verify against the code. Its sibling `README.md` carries that field.
>
> Nothing here is an Acceptance Criterion, and nothing here is ever tested. If an entry starts describing how the product behaves today, it belongs in `README.md` instead.

## 🗄️ Retired Acceptance Criteria

> An AC that described an outcome the product no longer has. Moved here — not deleted — so the number stays traceable and nobody re-mints it.
>
> **The number is burned.** `{NAME}-AC-08` never returns, so an old commit, test title or review comment always resolves to the right thing.

| AC             | What it required                                 | Retired | Why                                                       | Replaced by    |
| -------------- | ------------------------------------------------ | ------- | --------------------------------------------------------- | -------------- |
| `{NAME}-AC-08` | A retry control was presented in the error state | {date}  | Product dropped manual retry in favour of automatic retry | `{NAME}-AC-12` |
| `{NAME}-AC-03` | The list was sorted alphabetically               | {date}  | Superseded by recency ordering                            | `{NAME}-AC-11` |

> `Replaced by` is `—` when nothing took its place. Record the **reason**, not just the fact: a future reader needs to know whether the behaviour was wrong, unwanted, or moved elsewhere.

## 🚫 Rejected approaches — product

> A product direction that was considered and **not** taken, with why it lost. This is the only durable record; the brainstorm that discussed it does not survive the cycle.
>
> **Considered by the user, not by you.** An entry here means a direction the user actually weighed and dropped — in the brainstorm, or when approving the ACs. An alternative *you* thought of while drafting and did not pick is **not** a rejected approach; recording it invents a decision nobody made, and it is indistinguishable from a real one a year later. If you believe an unconsidered alternative deserves a look, raise it under Open Questions in `README.md` instead. When in doubt: could you name when the user rejected it? If not, it does not go here.
>
> Keep **current** scope exclusions in `README.md` → Non-Goals & Why ("we do not build X — the Y functionality owns it"). Those describe what is true now. This section is for **decisions**: paths weighed and dropped.

- **{Approach}** — _{date}_. Considered because {reason}. Rejected because {reason it lost}. {What we did instead.}
- **Showing tier as a coloured dot instead of a labelled badge** — _{date}_. Considered for density. Rejected: the colour alone failed contrast review and carried no meaning for screen readers. Went with a labelled badge.

## 🔁 Reversed decisions

> A decision that was made, shipped, and later undone — distinct from "rejected" (never taken) and from "retired" (an AC removed). Record it when the reversal itself is the useful history.

- **{Decision}** — taken _{date}_, reversed _{date}_. {Why it was taken, and what changed.}

> `NONE.` under any heading that has no entries yet — an empty heading is clearer than a missing one, because it shows the category was considered.
