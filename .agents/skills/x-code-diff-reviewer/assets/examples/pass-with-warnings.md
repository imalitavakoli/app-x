<!--
  WORKED EXAMPLE — verdict: Pass with warnings

  The common case, and the harder one to write well. A clean change must not be
  padded into looking problematic: a reviewer that always finds four things
  teaches the reader that findings are noise.

  What this example is here to demonstrate:
    · a genuinely short report — brevity is correct when the change is clean
    · "Blocking" present and empty, written as "None."
    · automated checks that DID run, with real commands and exit codes
    · a `question` used properly: something the reviewer cannot resolve alone
    · "Done well" that is specific and checkable, not flattery
    · "What I did not check" still non-empty, because no review checks all
    · a `praise` finding, which belongs in the JSON as much as an issue does
-->

# Code review — `fix/TEA-2201-topup-amount-rounding`

## Verdict

⚠️ **Pass with warnings** — the fix is correct and covered by a test. Two items are worth a look,
neither blocks the merge.

0 blocking · 2 non-blocking · 3 files reviewed

## What changed

Top-up amounts were rounded to whole units before being sent for payment, so a customer paying
12.50 was charged 13.00. This change keeps the decimal places, and adds a test that fails
against the old behaviour.

## What I reviewed

| Part of your work        | Reviewed | Note                                   |
| ------------------------ | -------- | -------------------------------------- |
| Committed on this branch | yes      | 2 commits, 3 files                     |
| Committed but not pushed | yes      | none — the branch matches its upstream |
| Saved but not committed  | yes      | none — nothing uncommitted             |

Compared against `origin/main` at `4b90ce1`. The branch is 3 commits behind.

## 🛑 Blocking

None.

## Non-blocking

### 1. Is 4 decimal places deliberate, or should this be 2?

**question** · `libs/shared/util/formatters/src/lib/amount-v1/amount.ts:34`

The new code keeps up to 4 decimal places. Every currency this product supports today uses 2.

**Why this matters:** if a price arrives with 3 or 4 decimals, the customer sees an amount their
bank will round anyway, and the receipt will not match the charge by a fraction. That is a
support ticket rather than a defect, and only you know whether a 4-decimal currency is planned.

**Rule:** no document sets a decimal limit. This is a question, not a violation.

**To fix:** nothing, if 4 is intended. Say so in the pull request description so the next reader
does not ask again.

### 2. The branch is 3 commits behind `origin/main`

**note** · repository-wide

`origin/main` has moved 3 commits since this branch started. None of those commits touch the
files you changed — I checked.

**Why this matters:** nothing here needs attention. I am recording it so you know I reviewed
against a base that has since moved, and that the move does not affect this change.

**Rule:** `docs/guidelines/pr-rules.md` covers bringing a branch up to date before a pull
request.

**To fix:** nothing required.

## Done well

- The test at `amount.spec.ts:41` fails against the previous implementation — I checked out the
  parent commit's version of `amount.ts` in a temporary worktree and the test failed there. It
  tests the fix rather than restating it.
- The lib's inner README usage snippet was updated in the same commit as the signature change,
  so the documented example still matches the exported function.
- The change is confined to one `util` lib and its spec. Nothing else was touched.

## Automated checks

| Check      | Command                                   | Result                                  |
| ---------- | ----------------------------------------- | --------------------------------------- |
| Lint       | `pnpm nx affected -t lint --base=4b90ce1` | **exit 0** — 1 project, no findings     |
| Unit tests | `pnpm nx affected -t test --base=4b90ce1` | **exit 0** — 1 project, 14 tests passed |
| e2e        | —                                         | not run — no e2e specs in the diff      |

## What I did not check

- Whether any consumer relies on the old rounding behaviour. The function is exported from a
  shared `util` lib, so a consumer outside this repository could exist.
- How the payment provider handles a 4-decimal amount — that is outside this repository.
- Native plugin code — none is in this diff.

## Suggested reviewers

| Owner  | Owns | Note                                                                        |
| ------ | ---- | --------------------------------------------------------------------------- |
| `@Ali` | `*`  | catch-all owner; `libs/shared/util/**` has no specific line in `CODEOWNERS` |

## Suggested labels

`shared-lib`

---

## 🔧 To get these fixed

Nothing blocks the merge. Finding 1 needs an answer from you, not a code change, and finding 2
needs nothing at all.

If you do want the decimal question settled in code, start a new cycle and give the agent
`.agents/_local/skills/x-code-diff-reviewer/latest.json`.
