# Reuse boundary — markers, ownership, and keeping them true

Read this whenever this functionality reuses a lib it does not own — existing, not yet built, or needing a change for us — and whenever you **update** a TFS that already has reuse markers.

## Every requirement has exactly one home

| The thing whose behaviour the requirement describes | Where that requirement lives |
| --- | --- |
| A lib **this** functionality owns | this `docs/x/{name}/TFS/{libtype}.md` — as an FR/BR |
| Another functionality's `map` / `data-access` / `ui` / `feature` / `page` | **that** functionality's own `docs/x/{its-name}/TFS/` |
| A `util` lib | that util's own `requirements.md` |
| An `api` lib | nowhere — `api` libs have no requirements doc |
| An `app` | `apps/{app-name}/requirements.md` |

This holds no matter who asked for the change. A reused lib that must gain something **for us** is still that lib's requirement, so it is still its owner's doc that gains it — and its creation or update is a **companion task in the plan**, never an owned lib of this TFS.

## The three marker states

Every entry under **🔗 Existing Dependencies & Reuse** carries its state for this cycle:

| Marker | Means | What it implies |
| --- | --- | --- |
| _(none)_ | exists, used as-is | nothing — just record what we consume |
| `[TO-CREATE]` | does not exist yet | companion task in the plan; a functionality needs its own PRD & TFS, a `util`/`app` its own `requirements.md`, an `api` nothing |
| `[TO-UPDATE]` | exists, must gain something for us | same, plus: name the exact surface, its owning functionality, and the ACs it blocks |

Use exactly these two markers — never wording of your own (`[RECOMMENDED]`, `[UPDATE REQUIRED]`, `[NEEDS UPDATE]`, bold prose). The value of a marker is that one search finds every one of them across every TFS in the workspace; a synonym is invisible to that search.

## Write the expiry condition into the marker

A marker is **cycle state living in a durable document**: true when written, and silently wrong once the companion work lands. Do not paper over that with a "this was accurate at the time" note — the doc's **Last Updated** field already says that, and a blanket disclaimer makes every marker unactionable.

Instead, write each marker so a reader can retire it themselves in seconds, by naming the observable surface that ends it:

> **`[TO-UPDATE]`** `shared-feature-ng-notification-banner` — must gain: a `severity` input (`'info' | 'warning' | 'critical'`), critical rendering, a `dismissed` output.
> **Owner:** `ng-notification-banner`. **Blocks:** `ENERGYALERTS-AC-04`, `ENERGYALERTS-AC-05`.

Anyone can now open that lib, see whether those three exist, and know whether the marker still holds. Compare with a bare `[TO-UPDATE] shared-feature-ng-notification-banner`, which can only be resolved by re-deriving the whole decision.

## Clear stale markers when updating a TFS

**Whenever you update an existing `docs/x/{name}/TFS/`, re-verify every marker before writing anything else:**

1. For each `[TO-CREATE]` entry — does the lib exist now? If yes, **remove the marker** and keep the entry as a plain used-as-is dependency.
2. For each `[TO-UPDATE]` entry — does the lib now have the surface the marker lists? If all of it landed, **remove the marker and the surface list**, leaving the plain entry. If only part landed, keep `[TO-UPDATE]` and narrow the list to what is still missing.
3. When a marker is cleared, also drop the matching "blocks `{AC}`" note — that risk is over.
4. If you cannot tell whether the work landed, leave the marker and raise it as an **Open Technical Question**. Never clear a marker on assumption.

Clearing a marker is **not** renumbering and **not** rewriting history: the marker described this cycle's state, and the update is what keeps the document honest about the current one.

## FR/BR stay on our side of the boundary

`{OWNER}` in an ID is always a component or helper service of a lib **this functionality owns** — never a reused one. Where an owned lib drives a reused one, assert our side of the wire:

| Assert this (ours) | Not this (theirs) |
| --- | --- |
| the reused banner **receives** `severity = 'critical'` from us | the banner **renders red** |
| the reused facade was primed to return `U`, and the value we expose is `U` | the facade's `getUser` **was called** |
| the value we bind to the row is the one our mapper produced | a reused `util` **formats** it as `DD MMM YYYY` |

The last row is the subtle one: encoding another lib's output format into our BR makes our suite fail when that lib changes something it is entitled to change. Assert the value we produced, or that the element is populated — not the reused util's chosen shape.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| An FR/BR describing a reused lib's behaviour | It belongs to that lib's owner's docs. Spec only our side of the boundary. |
| `{OWNER}` set to a reused component | `{OWNER}` is always an owned component or helper service. |
| Inventing marker wording | `[TO-CREATE]` / `[TO-UPDATE]`, exactly — nothing else is greppable. |
| A bare `[TO-UPDATE]` with no surface list | Name the surface, the owner, and the blocked ACs, so a reader can retire it. |
| Updating a TFS without re-checking its markers | Re-verify every marker first; clear the ones whose work has landed. |
| Clearing a marker because the work was "probably done" | Verify, or leave it and raise an Open Technical Question. |
| A "these marks were accurate when written" disclaimer | Redundant with **Last Updated**, and it makes every marker unactionable. |
