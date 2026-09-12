<!--
  WORKED EXAMPLE — session handoff, verdict: Fail

  Imitate the shape. Do not copy the findings: they belong to the matching
  human-report example in `assets/examples/human-report/fail-with-blocking.md`.

  What this example is here to demonstrate:
    · Blocking and Non-blocking both present, both non-empty
    · titles plus one-line consequences, not full finding bodies
    · 🔧 Fix these? offers a new cycle
-->

## Review result

❌ **Fail** — the card cannot open, and a shared lib breaks three written rules

4 blocking · 1 non-blocking · 4 files reviewed

### 🛑 Blocking

1. The card loads a data service it is not allowed to load — nobody can show the card with different data
2. The change looks unfinished — the route cannot open this card — opening `/card` shows an error or an empty page
3. The stylesheet hardcodes two colors — every brand renders the same blue, ignoring their theme
4. The README does not describe the new code — the next reader cannot tell whether the README is thin or wrong

### Non-blocking

1. A saved file is not committed and does not belong in this lib — `git add -A` would sweep it into a shared lib

### 🔧 Fix these?

Want me to open a **new** cycle and apply these from
`.agents/_local/skills/x-code-diff-reviewer/latest.json`?
This review stays read-only — I will not change the tree in this cycle.

Report: `.agents/_local/skills/x-code-diff-reviewer/latest.md`
