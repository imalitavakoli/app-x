<!--
  WORKED EXAMPLE — session handoff, verdict: Pass with warnings

  Imitate the shape. Do not copy the findings: they belong to the matching
  human-report example in `assets/examples/human-report/pass-with-warnings.md`.

  What this example is here to demonstrate:
    · Blocking present and empty, written as "None."
    · Non-blocking titles plus one-line consequences, not full finding bodies
    · a finding that needs a decision still listed, saying so in the one-liner
    · 🔧 Fix these? still offers a new cycle when a list is non-empty
-->

## Review result

⚠️ **Pass with warnings** — the fix is correct and covered by a test

0 blocking · 2 non-blocking · 3 files reviewed

### 🛑 Blocking

None.

### Non-blocking

1. Is 4 decimal places deliberate, or should this be 2? — needs a decision, not a patch: a 3- or 4-decimal price can disagree with the bank charge
2. The branch is 3 commits behind `origin/main` — nothing to change; recorded so you know the base has moved

### 🔧 Fix these?

Want me to open a **new** cycle and apply these from
`.agents/_local/skills/x-code-diff-reviewer/latest.json`?
This review stays read-only — I will not change the tree in this cycle.

Report: `.agents/_local/skills/x-code-diff-reviewer/latest.md`
