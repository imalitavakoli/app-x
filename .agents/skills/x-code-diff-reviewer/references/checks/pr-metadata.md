# Checks — PR metadata

**Load when:** the change is being prepared for a pull request, or the user asks whether it is
ready.

These check the **envelope**, not the code: the branch name, the commits, the size and shape of
the change. `docs/guidelines/pr-rules.md` owns the process and
`docs/guidelines/naming-conventions.md#git` owns the names — read them and enforce what they
say. Do not restate a convention here or in the report; cite it.

## What to look at

| Look at                                                           | Source of truth                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| the branch name                                                   | `docs/guidelines/naming-conventions.md#git`                                          |
| every commit subject in the reviewed range                        | same                                                                                 |
| whether a tracker ID is present where the convention requires one | same                                                                                 |
| how many files the change touches, against the size norm          | `docs/guidelines/pr-rules.md`                                                        |
| whether the PR description will carry what is required of it      | `docs/guidelines/pr-rules.md`                                                        |
| whether Code Owners are being added as reviewers                  | `docs/guidelines/pr-rules.md`                                                        |
| whether a lib or app README and CHANGELOG were kept current       | `docs/guidelines/pr-rules.md`, and `checks/docs-readme.md`                           |
| whether `package.json` or the lockfile changed                    | `docs/guidelines/pr-rules.md` — this needs a person told, not just a reviewer's note |

## Branch and commits

Check the names against the convention; do not reproduce the convention's grammar in the report.
Quote the doc's own line and show the offending name beside it.

A tracker ID that the convention requires and the branch lacks is a finding — but **never invent
one, and never suggest a placeholder**. If the user has said there is no tracker ID, that
settles it and it is not a finding at all.

Commits are judged over the reviewed range only. A badly-named commit that predates the merge
base belongs to another change.

## Size

Compare the file count against the norm in `pr-rules.md`. Over it is a `suggestion`, not a
blocker — splitting a finished branch is often worse than merging it — unless the change is also
incoherent, in which case say _that_ rather than citing the count.

Auto-generated output committed as part of a release (a compiled bundle directory, for example)
inflates the count without adding review surface. `pr-rules.md` says how those are treated; read
it before counting them against the norm.

## Behind the base

`collect-diff-facts.mjs` reports `behind_by`. A branch far behind its base has been reviewed
against code that no longer exists, which makes every other finding less reliable.

Report it as a `note` when it is non-zero and the reviewed range is otherwise clean; raise it to
`issue` (non-blocking) when the change touches files that also moved on the base. Say the number.

There is no threshold in the docs, so do not invent one and do not veto on it. If the workspace
wants a threshold, that is a `chore` finding asking for it to be written down.

## Scope drift

If the user stated what the change was for — in the request, a spec, a plan, a PRD, or the
branch name — compare that against what the diff actually touches.

A change described as small that also edits shared or foundation files is worth a `question`:
name the unexpected files and ask whether they are intended. Do not assert that they are
unrelated; you may be missing the reason.

If no intent was stated, do not guess one, and do not ask the user to supply it as a
precondition for reviewing.
