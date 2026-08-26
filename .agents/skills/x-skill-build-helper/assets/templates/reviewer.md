# Template — reviewer skill

A **reviewer** judges input the caller supplies — a diff, a pull request, a lib, a document it does not own — and reports **findings**. It edits nothing, writes no document to a path of its own, and decides nothing: it says what it found and what it could not determine.

Examples: a pull-request reviewer; a reviewer that audits a lib against the workspace conventions.

## What separates it from the kinds either side of it

This kind is easy to reach for wrongly, so the two boundaries are worth stating outright:

| Not a reviewer                                                          | It is a…                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| a validator of the skill's **own** subject (a rule set proving itself)   | **helper** with a `scripts/` proof — the verdict is not a separate kind |
| findings written to a path the skill owns, in a shape it defines         | **writer** — it owns an output document                             |
| findings it then acts on by changing the code                            | **editor** — reviewing and fixing are two skills                    |

The discriminator is **whose input**: a reviewer's subject arrives from the caller and differs every run, which is exactly why it can own no output path and no template for one.

## Findings, not fixes

A reviewer's output is a list of findings, and the two properties that make it useful are the ones prose tends to drop:

- **Every finding is falsifiable.** It names where, what, and what would have to be true for it to be wrong. "This could be cleaner" is not a finding.
- **Uncertainty is reported, never resolved.** Where the reviewer cannot tell, it says so and says what it would need. Guessing to produce a cleaner report is the failure mode this kind is most prone to.

```markdown
---
name: x-{tech}-{domain}-reviewer
description: 'WHAT? <what it reviews and what it reports, one clause>. WHEN? <the situations + keywords>'
metadata:
  kind: reviewer
  version: '1.0.0'
---

# {Domain} Reviewer

## Overview

<What it reviews and what it reports. State the boundary outright: it reports findings and
changes nothing. Say what a reader is expected to do with the findings.>

## When to use

<Triggers. Then: "Do not use to fix what it finds — that is a separate skill and a separate
run." And: what it does NOT review.>

## Prerequisites

**Required input:** <the thing under review, and how it arrives — a diff, a path, a branch>.
If it is missing or ambiguous, STOP and ask. Never review a substitute for it, and never
reconstruct it from context.
<Name any reference the review is conducted AGAINST, by exact path — the conventions,
the spec, the acceptance criteria.>

## What to check

<The dimensions, each with what a finding in that dimension looks like. Keep them
independent: overlapping dimensions produce the same finding several times and a reader
cannot tell whether that means it matters more.>

## Severity

<How findings are ranked, and what the top rank means in this domain. One scale, defined
once — the point is that two runs rank the same thing the same way.>

## Reporting

- One finding per line item: **where** (a resolvable path, with a line where it applies),
  **what**, and **why it is wrong** — stated so it could be shown to be mistaken.
- Findings first, ranked. No preamble, no summary of the input the reader supplied.
- **Say what you could not check** and why. An unrun dimension reported as clean is the
  one failure this kind cannot survive.
- Nothing was edited. Say so if there is any doubt.

## Validate

**Review Checklist** — before reporting, verify:

- [ ] Every finding names a resolvable location.
- [ ] Every finding is falsifiable — it says what would make it wrong.
- [ ] Nothing was edited, and no file was written.
- [ ] Dimensions that could not be checked are named as such.

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **Reviewing and fixing are two skills.** The moment a reviewer starts editing, its findings stop being auditable — nobody can tell which were real and which were made true by the same run. Keep the fix in a separate skill and a separate invocation.
- **The "could not check" line is what makes a report trustworthy.** A review that only reports what it found is indistinguishable from one that ran half its dimensions.
- **Rank, do not pad.** A reviewer that reports something on every run to look thorough trains its reader to skim. An empty finding list is a valid result and should be stated plainly.
- **Do not let the reference drift into the skill.** Review against `docs/` by exact path rather than restating the conventions here — a copy of the rules inside the reviewer is a second source of truth that will disagree with the first.
