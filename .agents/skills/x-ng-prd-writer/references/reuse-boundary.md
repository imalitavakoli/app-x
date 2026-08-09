# Reuse boundary — what belongs in _this_ PRD

Read this whenever the feature description names a lib or functionality that this one **reuses** — whether that lib already exists, must be created, or must be changed for us.

A functionality almost always stands on things it does not own: shared `util` functions, another functionality's `data-access`, another functionality's `ui`/`feature`. Those things belong in this PRD as **context**. Their requirements belong to their own owner's docs.

## Every requirement has exactly one home

| The thing whose behaviour the requirement describes                       | Where that requirement lives                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| A lib **this** functionality owns                                         | **this** `docs/x/{name}/PRD.md` — as an AC              |
| Another functionality's `map` / `data-access` / `ui` / `feature` / `page` | **that** functionality's own `docs/x/{its-name}/PRD.md` |
| A `util` lib                                                              | that util's own `requirements.md`                       |
| An `api` lib                                                              | nowhere — `api` libs have no requirements doc           |
| An `app`                                                                  | `apps/{app-name}/requirements.md`                       |

This holds no matter who asked for the change. "The banner needs a `severity` input **for us**" is still a requirement about the banner, so it is still the banner's PRD that gains it. Writing it here does not make it happen; it only mints an AC that this functionality's e2e suite will then try to verify.

## The subject test — write ACs whose subject is ours

An AC asserts something about a **subject**. Give this PRD only ACs whose subject is one of:

1. **Data this functionality produces or exposes** — the list, the value, the payload.
2. **A state this functionality owns** — loading, empty, error, data.
3. **A decision this functionality makes** — which items qualify, what order they appear in, which remain after an action.
4. **Presence or absence of something this functionality places on screen** — that a row appears per alert, that no rows appear when empty.

A reused component's own **visual attributes** and a reused util's own **output format** are that owner's subject, not ours: its colour, its typography, its animation, its date pattern, its rounding, its truncation.

## Decompose a boundary requirement — keep the decision, shed the rendering

The hardest case is one sentence containing both. Split it: the part that is _our decision_ stays as an AC; the part that is _their rendering_ leaves.

| One sentence in the description                                          | Stays here (our decision)                                               | Leaves (their rendering)                                                    |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| "an alert over its threshold shows in the banner's red critical styling" | that an over-threshold alert is **presented as critical**               | that critical **looks red** → the banner functionality's PRD                |
| "each alert's timestamp is displayed as `DD MMM YYYY`"                   | that each alert **displays its timestamp** (only if worth an AC at all) | the `DD MMM YYYY` **pattern** → the date util's `requirements.md`           |
| "the user closes a banner and it disappears from the list"               | that the alert is **removed from the list** and the rest remain         | that the banner **has a close affordance** → the banner functionality's PRD |

The test for whether a sentence still belongs here: _if this functionality were deleted tomorrow, would this outcome still have to hold?_ If yes, it was never ours.

## Where reuse **is** recorded in this PRD

Reuse is not invisible here — it is written in the sections built for it, without an AC ID:

- **⚠️ Dependencies & Risks** — name every reused functionality, lib, or service, and say what it provides. When a reused lib must **change** for us, say so here, name the owner, and note that the change is specified in that owner's own docs. If an AC of ours cannot pass until that change lands, say that too — it is a real delivery risk.
- **🚫 Non-Goals & Why** — record what this functionality deliberately does not own because something else already does ("not building the date formatter — the shared date util owns it").
- **🗄️ Data Requirements** — name the reused `data-access` this functionality reads from.

Nothing in those sections gets an AC ID, and nothing in them becomes an e2e test of this functionality.

## Not-yet-built reuse

A reused lib that does not exist yet changes nothing about ownership — it is still not this PRD's to specify:

- A missing **functionality** (`map` / `data-access` / `ui` / `feature` / `page`) needs its **own** PRD and TFS. Name it under Dependencies & Risks; do not absorb its ACs.
- A missing **`util` / `api` / `app`** never gets `docs/x/` at all. Name it under Dependencies & Risks; creating it is plan work.

If the description leans on a lib that does not exist yet and the user has not said who builds it, that is an **Open Question**, not an assumption to resolve by writing its behaviour into this PRD.

## Keep reuse notes true when updating the PRD

A note saying a reused lib "must gain X for us", or that a dependency "does not exist yet", is **state at the time of writing**. Once that work lands, the note is simply wrong, and nothing removes it on its own.

So write each one so a reader can retire it — name the **observable** that ends it ("the shared banner must gain a `severity` input and a `dismissed` output"), not a vague "needs work". And **when updating an existing PRD, re-read Dependencies & Risks first** and bring it to the present:

1. A dependency that has since been built → drop "does not exist yet"; keep it as a plain dependency.
2. A reused lib that has since gained the surface we needed → drop the "must change for us" note, and the delivery risk that came with it.
3. Partly landed → keep the note, narrowed to what is still missing.
4. Cannot tell whether it landed → leave it and raise it under **Open Questions**. Never clear it on assumption.

Do **not** add a "this was accurate when written" disclaimer. The PRD's **Last Updated** field already says that, and a blanket disclaimer makes every statement in the section unactionable instead of fixing the one that went stale.

## Common mistakes

| Mistake                                                                            | Fix                                                                                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| An AC asserting a reused component's colour, styling, or animation                 | That is its owner's PRD. Keep only our decision that drove it.                                   |
| An AC asserting a shared util's output format or rounding                          | That is the util's `requirements.md`. Keep only that the value is displayed.                     |
| An AC covering a change we asked another team to make                              | Requirements follow the lib, not the requester. Record it under Dependencies & Risks.            |
| An AC for a lib that does not exist yet                                            | It belongs to that lib's own docs. Here it is a dependency and possibly an Open Question.        |
| Fusing our decision and their rendering into one AC                                | Split; keep the decision, shed the rendering.                                                    |
| Dropping reuse from the PRD entirely to stay "clean"                               | Reuse belongs in Dependencies & Risks / Non-Goals / Data Requirements — just never as an AC.     |
| Updating a PRD and leaving stale "does not exist yet" / "must change for us" notes | Re-read Dependencies & Risks first and bring each note to the present.                           |
| Clearing a reuse note because the work was "probably done"                         | Verify it, or leave it and raise an Open Question.                                               |
| Adding a "accurate when written" disclaimer to the section                         | Redundant with **Last Updated**, and it softens every statement instead of fixing the stale one. |
