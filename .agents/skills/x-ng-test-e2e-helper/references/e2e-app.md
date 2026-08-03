# E2e app — `user-stories.md` registry

Read this before adding or reusing a User Story (US) when writing e2e tests.

## Where

`apps/{app}-e2e/user-stories.md`

Example: `apps/ng-boilerplate-e2e/user-stories.md`.

## Lifecycle

- The registry is **created/updated by the e2e work**, not by this skill as a writer.
- When the e2e is written, if the story isn't registered → add a new US with a fresh unique ID (create the file if absent).
- If an existing US already fits → **reuse** it.
- US IDs are **unique per e2e app**.
- Never renumber existing US IDs.

## What a US is

A US groups the **Acceptance Criteria (ACs)** — defined in functionalities' PRDs (`docs/x/{name}/PRD.md`) — that a user pursues in one story. A US **may span functionalities**, which is why it lives in the e2e app registry, not in a single functionality's PRD.

## Spec mapping (reminder)

- **`describe` ↔ US** from this registry. Title: `<US-id> | As a …`
- **`it` ↔ AC** from the functionality's PRD. Title: `<AC-id> | Given <…>; When <…>; Then <…>`

## Format

Imitate [../assets/examples/user-stories.md](../assets/examples/user-stories.md).

**Handing the example to a subagent?** Repo-relative path: `.agents/skills/x-ng-test-e2e-helper/assets/examples/user-stories.md`.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Putting US registry on the product `app` | It belongs in `{app}-e2e`, not `apps/{app-name}/` |
| Using `requirements.md` for e2e US/AC | `requirements.md` is for util/app **unit** tests; e2e uses `user-stories.md` + PRD ACs |
| Inventing a US ID that already exists | Reuse the existing US when it fits |
| Renumbering US IDs | Never renumber; only add |
