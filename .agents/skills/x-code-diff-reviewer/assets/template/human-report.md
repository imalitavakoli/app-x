<!--
  HUMAN REPORT TEMPLATE — x-code-diff-reviewer

  Fill every section. The order is fixed and the headings are fixed.

  Why fixed: three unaided baseline runs produced three different taxonomies
  ("Blockers / Should fix before pushing / Process notes / Lower confidence",
  "Blockers / Functional problems / Smaller items", "Blocker / Also worth a
  look / What I changed"). A reader who gets a different report shape every
  time cannot skim, cannot compare two reviews, and cannot tell a missing
  section from an empty one.

  A section marked REQUIRED appears even when it is empty. Write "None." — an
  empty section is information; a missing one is ambiguity.

  Replace every [ ] placeholder. Delete these comments and every guidance
  comment below before output.

  Prose follows the plain-language rules in SKILL.md. Code, paths, commands and
  identifiers stay verbatim inside backticks — never HTML-escape them, never
  reflow them. `m => m.V1CardComponent` must not arrive as `m =&gt; m…`.
-->

# Code review — `[branch]`

## Verdict — REQUIRED

[Pick exactly one: ❌ **Fail** | ⚠️ **Pass with warnings** | ✅ **Pass**] — [one sentence
saying why, in plain language.]

[N] blocking · [N] non-blocking · [N] files reviewed

[If verification did not run, add: **Findings were not independently verified** — see *What I did
not check*. Omit this line entirely when verification ran.]

<!-- Verdict is mechanical: any blocking finding = Fail. Non-blocking only =
     Pass with warnings. Nothing = Pass. It goes first because it is the one
     thing every reader needs, and in baseline runs it ended up buried. -->

## What changed — REQUIRED

[Two or three sentences. What is this change for, in words a non-developer follows.
Say what the change is meant to do, not how it is built.]

## What I reviewed — REQUIRED

| Part of your work        | Reviewed | Note                                 |
| ------------------------ | -------- | ------------------------------------ |
| Committed on this branch | [yes/no] | [N] commits, [N] files               |
| Committed but not pushed | [yes/no] | [note, or "none"]                    |
| Saved but not committed  | [yes/no] | **not part of the pull request yet** |

Compared against `[base ref]` at `[merge-base sha]`.

<!-- Always name which buckets you judged. A reader must never have to guess
     whether their uncommitted work was included. -->

## 🛑 Blocking — REQUIRED

<!-- Repeat this block per finding. "None." if empty. -->

### [N]. [Short title in plain language]

**issue (blocking)** · `[path]:[line]`

[What is wrong. One or two sentences.]

**Why this matters:** [the consequence a person would see or suffer. Not the rule
name — the effect. "Every brand renders the same blue, ignoring their theme."]

**Rule:** `[doc path, and #anchor where the doc has one]` — [the doc's own words, one line,
quoted. Do not paraphrase.]

**To fix:** [what to change and where. You do not make this change.]

## Non-blocking — REQUIRED

<!-- Same block, with the label and no "blocking". Group nothing; keep one flat
     list ordered by label: suggestion, nitpick, question, todo, chore, note. -->

### [N]. [Short title]

**[suggestion | nitpick | question | todo | chore | note]** · `[path]:[line]`

[Body, same shape as above. "Why this matters" is still required.]

## Done well — REQUIRED

- [Something specific and true. Name the file. "Tests were added" only if they were.]

<!-- Accurate praise is what makes the rest of the report credible. Do not
     invent it: if there is nothing specific, write "Nothing specific to note." -->

## Automated checks — REQUIRED

| Check      | Command             | Result             |
| ---------- | ------------------- | ------------------ |
| Lint       | `[literal command]` | [exit N — summary] |
| Unit tests | `[literal command]` | [exit N — summary] |
| e2e        | —                   | [not run — reason] |

<!-- Every row is a command that actually ran, with its real exit code, or an
     explicit "not run" with the reason. NEVER predict an outcome here. If you
     did not run it, it belongs in the next section instead. -->

## What I did not check — REQUIRED

- [What, and why. "Whether the app builds — no build tooling in this repository."]
- [Anything the tooling could not cover. Native Kotlin and Swift have no linter
  configured, so plugin code was read, not analysed.]
- [Any doc or asset path in the maps that did not resolve.]

<!-- This section was absent from every unaided baseline run, and it is what
     keeps a confident-sounding report honest. It is never empty: no review
     checks everything. -->

## Suggested reviewers — REQUIRED

| Owner       | Owns                   | Note                                          |
| ----------- | ---------------------- | --------------------------------------------- |
| `[@handle]` | `[codeowners pattern]` | from `CODEOWNERS`, not resolved to an account |

<!-- Report handles exactly as CODEOWNERS writes them. A display name is not a
     host login; guessing one assigns the wrong person. -->

## Suggested labels — REQUIRED

`[label]`, `[label]`

<!-- Some hosts have pull-request labels; some do not. Emit them anyway;
     a consumer whose host has none ignores the field. -->

---

## 🔧 To get these fixed — REQUIRED

Start a new cycle and give the agent this file:

```
.agents/_local/skills/x-code-diff-reviewer/latest.json
```

It holds every finding with its exact path, line range, consequence and rule source. **This
report is written for a person to read; that file is written for an agent to act on.** Do not
paste this report into a fix run — the plain language here deliberately drops detail the fixer
needs.

[If any findings are coupled, say so in one line: "Fixing 2 also resolves 5 and 9."]

<!-- This section is REQUIRED even on a Pass. On a Pass write: "Nothing to fix." -->

---

<!-- Do not add a section. Do not rename one. If something does not fit, it is a
     finding with a label, or it belongs in "What I did not check".

     The five status markers (✅ ⚠️ ❌ 🛑 🔧) are the complete set. Do not add a
     sixth, and do not put one on an individual finding. -->

<!-- END OF TEMPLATE -->
<!-- Delete every comment in this file before output. -->
