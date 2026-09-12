<!--
  WORKED EXAMPLE — verdict: Pass

  The clean case. A reviewer that always finds something teaches the reader
  that findings are noise. When nothing is wrong, the report stays short and
  the empty lists stay empty.

  What this example is here to demonstrate:
    · a genuinely short report — brevity is correct when the change is clean
    · "Blocking" and "Non-blocking" both present and empty, written as "None."
    · "To get these fixed" writes "Nothing to fix." instead of the offer
    · automated checks that DID run, with real commands and exit codes
    · "Done well" that is specific and checkable, not flattery
    · "What I did not check" still non-empty, because no review checks all
    · no "Findings were not independently verified" line — there were no
      blocking findings, so verification does not apply
-->

# Code review — `fix/TEA-1842-empty-date-label`

## Verdict

✅ **Pass** — an empty date no longer shows as Invalid Date, and a test covers that case.

0 blocking · 0 non-blocking · 2 files reviewed

## What changed

A date label showed the words "Invalid Date" when the value was an empty string. This change
leaves the label blank instead. A unit test fails against the old behaviour.

## What I reviewed

| Part of your work        | Reviewed | Note                                   |
| ------------------------ | -------- | -------------------------------------- |
| Committed on this branch | yes      | 1 commit, 2 files                      |
| Committed but not pushed | yes      | none — the branch matches its upstream |
| Saved but not committed  | yes      | none — nothing uncommitted             |

Compared against `origin/main` at `2c81aa4`.

## 🛑 Blocking

None.

## Non-blocking

None.

## Done well

- The test at `date-label.spec.ts:28` fails against the previous implementation — I checked out
  the parent commit's version of `date-label.ts` in a temporary worktree and the test failed
  there. It tests the fix rather than restating it.
- The change is confined to one `util` lib and its spec. Nothing else was touched.

## Automated checks

| Check      | Command                                   | Result                                 |
| ---------- | ----------------------------------------- | -------------------------------------- |
| Lint       | `pnpm nx affected -t lint --base=2c81aa4` | **exit 0** — 1 project, no findings    |
| Unit tests | `pnpm nx affected -t test --base=2c81aa4` | **exit 0** — 1 project, 6 tests passed |
| e2e        | —                                         | not run — no e2e specs in the diff     |

## What I did not check

- Whether any consumer relies on seeing the words "Invalid Date" for an empty string. The
  function is exported from a shared `util` lib, so a consumer outside this repository could
  exist.
- Native plugin code — none is in this diff.

## Suggested reviewers

| Owner  | Owns | Note                                                                        |
| ------ | ---- | --------------------------------------------------------------------------- |
| `@Ali` | `*`  | catch-all owner; `libs/shared/util/**` has no specific line in `CODEOWNERS` |

## Suggested labels

`shared-lib`

---

## 🔧 To get these fixed

Nothing to fix.

The machine report is `.agents/_local/skills/x-code-diff-reviewer/latest.json`.
