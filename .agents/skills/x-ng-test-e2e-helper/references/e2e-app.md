# E2e app — `user-stories/` registry

Read this before adding or reusing a User Story (US) when writing e2e tests.

## Where

`apps/{app}-e2e/user-stories/` — a **folder**, laid out like a functionality's `PRD/`:

| File           | Holds                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| `README.md`    | the **live** US registry — every US a spec may reference                     |
| `DECISIONS.md` | **burned** IDs — retired and merged USs, so an old `describe` title resolves |

Example: `apps/ng-boilerplate-e2e/user-stories/README.md`.

`README.md` lists only what is live. Retiring or merging a US **moves** its row to `DECISIONS.md` rather than deleting it — the same split a functionality uses between `PRD/README.md` and `PRD/DECISIONS.md`, and the same reason the TSD ID Index drops a retired row while `DECISIONS.md` keeps it: an index that accumulates dead entries stops being readable at the moment it is read most.

## Lifecycle

- The registry is **created/updated by the e2e work**, not by this skill as a writer.
- When the e2e is written, if the story isn't registered → add a new US to `README.md` with a fresh unique ID (create the folder and file if absent).
- If an existing US already fits → **reuse** it.
- US IDs are **unique per e2e app**, and unique across **both** files — `DECISIONS.md` holds burned numbers that must never come back.
- Never renumber existing US IDs.

A registered US can also go stale. Four outcomes, the same set an AC resolves to:

| Outcome       | What to do to the registry                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **added**     | the story isn't registered → new entry in `README.md`, fresh unique ID                                                                                                             |
| **amended**   | the story still exists but is worded wrongly, or its Covered ACs list is out of date → rewrite it in `README.md` **under its existing US ID**                                      |
| **retired**   | **every** AC it grouped has been retired → **move** the entry to `DECISIONS.md` → **Retired User Stories** (ID, the story, the date, why), and delete its `describe` from the spec |
| **merged**    | the story was absorbed by another → **move** the entry to `DECISIONS.md` → **Merged User Stories**, naming the successor US, and re-point the spec's `describe` at it              |
| **unchanged** | nothing to write                                                                                                                                                                   |

**Moving, not deleting.** Both `retired` and `merged` leave `README.md` and land in `DECISIONS.md`; the number stays burned either way, so an old `describe` title, commit or review comment still resolves to what that story was.

**Losing some ACs is not retirement.** A US with fewer criteria is still a story — amend its Covered ACs list in `README.md` and leave the ID in place.

**Report an amend, a retire or a merge — old text beside new — but do not block on approval.** No writer owns these files, so there is no approval to overturn. But a **US may span functionalities**: name the other functionalities whose ACs it groups, because their specs reference this same US ID and their `describe` titles change with it.

**Stamp `Last Verified`** (date) at the top of **each file you checked**, including when nothing needed an edit — that is what makes a stale registry detectable later.

## What a US is

A US groups the **Acceptance Criteria (ACs)** — defined in functionalities' PRDs (`docs/x/{domain}/{name}/PRD/README.md`) — that a user pursues in one story. A US **may span functionalities**, which is why it lives in the e2e app registry, not in a single functionality's PRD.

## Spec mapping (reminder)

- **`describe` ↔ US** from this registry. Title: `<US-id> | As a …`
- **`it` ↔ AC** from the functionality's PRD. Title: `<AC-id> | Given <…>; When <…>; Then <…>`

## Format

Imitate the example folder [../assets/examples/user-stories/](../assets/examples/user-stories/) — one file per output file (`README.md`, `DECISIONS.md`).

**Handing the example to a subagent?** Repo-relative path: `.agents/skills/x-ng-test-e2e-helper/assets/examples/user-stories/`.

## Common mistakes

| Mistake                                        | Fix                                                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Putting US registry on the product `app`       | It belongs in `{app}-e2e`, not `apps/{app-name}/`                                            |
| Using `requirements/` for e2e US/AC            | `requirements/` is for util/app **unit** tests; e2e uses `user-stories/` + PRD ACs           |
| Inventing a US ID that already exists          | Reuse the existing US when it fits                                                           |
| Minting an ID that is burned in `DECISIONS.md` | Check both files — a retired or merged number never comes back                               |
| Renumbering US IDs                             | Never renumber — add, amend under the existing ID, or move it to `DECISIONS.md`              |
| Retiring a US that only lost some ACs          | Amend its Covered ACs list in `README.md`; keep the ID                                       |
| Deleting a retired or merged US outright       | Move it to `DECISIONS.md` so the burned ID still resolves                                    |
| Keeping burned rows in `README.md`             | `README.md` is live-only; the history lives in `DECISIONS.md`                                |
| A single flat `user-stories.md`                | It is a folder — `README.md` (live) + `DECISIONS.md` (burned), like a functionality's `PRD/` |
