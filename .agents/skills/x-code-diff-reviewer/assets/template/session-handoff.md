<!--
  SESSION HANDOFF TEMPLATE — x-code-diff-reviewer

  Print this block in the session at the end of every run. Headings and order
  are fixed. A heading marked REQUIRED appears even when it is empty. Write
  "None." — an empty list is information; a missing heading is ambiguity.

  Replace every [ ] placeholder. Delete these comments and every guidance
  comment below before output.

  This is not the human report. The human report is `latest.md`. This block is
  the short return a parent agent pastes into chat.

  Prose follows the plain-language rules in SKILL.md. Code, paths, commands and
  identifiers stay verbatim inside backticks.
-->

## Review result

[Pick exactly one: ❌ **Fail** | ⚠️ **Pass with warnings** | ✅ **Pass**] — [one short clause]

[N] blocking · [N] non-blocking · [N] files reviewed

<!-- Verdict marker and counts match the human report. Use the human-report
     verdict line (✅ / ⚠️ / ❌), not the JSON `state` names. -->

### 🛑 Blocking — REQUIRED

<!-- Numbered list. Each item is the finding's title plus one short consequence
     clause — not the full finding body (that stays in `latest.md`). "None." if
     empty. -->

1. [finding title] — [one-line why it matters]

### Non-blocking — REQUIRED

<!-- Same shape as Blocking. "None." if empty. A finding that needs a human
     answer (not a code change) still appears; say in that item's one-liner that
     it needs a decision, not a patch. -->

1. [finding title] — [one-line why it matters]

### 🔧 Fix these? — REQUIRED

<!-- Always appears.
     When Blocking or Non-blocking has at least one item: use the offer text
     below. Do not apply fixes in this run.
     When both lists are "None.": write "Nothing to fix." instead of the offer. -->

Want me to open a **new** cycle and apply these from
`.agents/_local/skills/x-code-diff-reviewer/latest.json`?
This review stays read-only — I will not change the tree in this cycle.

Report: `.agents/_local/skills/x-code-diff-reviewer/latest.md`

<!-- Keep the report path so a reader can open the full write-up. -->

<!-- END OF TEMPLATE -->
<!-- Delete every comment in this file before output. -->
