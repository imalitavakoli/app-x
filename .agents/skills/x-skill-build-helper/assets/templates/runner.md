# Template — runner skill

A **runner** supplies the procedure for **executing something and interpreting what comes back** — a task, a suite, a pipeline, a deploy, a health check. Its output is neither a document nor an edit nor findings about supplied input: it is an action plus a reading of the result.

| Not a runner                                          | It is a…                                                        |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| judging input the caller hands over                   | **reviewer** — nothing is executed                              |
| a `scripts/` transform that edits files               | **editor** — running it is incidental to the edit               |
| the conventions for how to run things, with no run    | **helper**                                                      |

The interpretation is the substance. Anyone can run a command; what a runner is worth is knowing **what the output means**, which failures are expected, and what to do next for each.

## Two rules this kind exists for

Both are safety properties, and neither belongs to any other kind:

- **Never claim a result you did not observe.** The verdict comes from output actually returned — not from the command having been issued, not from what usually happens. A runner that reports success because nothing threw is worse than no runner: it launders a guess as evidence.
- **Nothing outward-facing or destructive without explicit confirmation.** A deploy, a release, a publish, a migration, a delete, anything that reaches a shared environment — the procedure stops and asks first, every time, and says exactly what is about to happen and where. "The user asked me to run the pipeline" is not confirmation for the step inside it that ships.

## Confirm the invocation before trusting this file

Commands, flags and target names move. State them as *today's*, and point at the real source:

> Today this runs through <the tool / target> (re-check; it can change). Read the workspace's
> own configuration for the current invocation rather than trusting the command written here.

```markdown
---
name: x-{tech}-{domain}-runner
description: 'WHAT? <what it runs and what it reports, one clause>. WHEN? <the situations + keywords>'
metadata:
  kind: runner
  version: '1.0.0'
---

# {Domain} Runner

## Overview

<What it runs, and what a reader learns from the result. State the boundary: it runs and
reports — it does not fix what it finds.>

## When to use

<Triggers. Then: "Do not use to fix a failure — that is a separate skill and a separate run.">

## Preconditions

**Check before running, and STOP if any fails:**

- <what must be installed, built, running, or authenticated>
- <the state the target must be in>

Never run to "see what happens" when a precondition is unmet — the failure that produces is
noise that looks like a finding.

## Run it

<The invocation, and how to confirm it is current. Say what scope to run: the narrowest that
answers the question, not everything.>

## Reading the result

<The substance of this skill. How to tell success from failure — including the cases where
exit status lies. What a slow run, a partial run, or an empty run means.>

| Symptom   | What it means | What to do next |
| --------- | ------------- | --------------- |
| <symptom> | <meaning>     | <next step>     |

## Stop conditions

<When to stop rather than retry. A retried failure with nothing changed in between is the
same failure, and a loop of them looks like progress.>

## Confirmation required

<Every step here that reaches a shared environment or cannot be undone, and what to state
when asking. If this runner touches nothing outward-facing, say so explicitly — an empty
section reads as an oversight.>

## Reporting

- The verdict, and the **observed output** it rests on.
- What was run, at what scope — so a reader knows what was NOT covered.
- Anything that could not be checked, and why. An unrun check reported as passing is the one
  failure this kind cannot survive.

## Common mistakes

| Mistake       | Fix              |
| ------------- | ---------------- |
| <the failure> | <the correction> |
```

## Notes

- **_Reading the result_ is the whole skill.** If that section is thin, what you have is a command in a wrapper, and a `helper` naming the command would serve better.
- **Exit status is not a verdict.** Tools disagree about it: some exit 0 having done nothing, some exit non-zero on warnings. Say which this one is, because that is exactly the knowledge a reader lacks.
- **Scope is part of the result.** "Tests pass" means nothing without what ran. A runner that reports a verdict without its scope invites the reader to over-generalise it.
- **Running and fixing are two skills.** Keep triage to "what to do next" — the doing belongs elsewhere, and mixing them means nobody can tell what the run actually proved.
- **The confirmation section is not boilerplate.** It is the reason this kind gets its own template rather than reusing a helper's: no other kind can take an action that reaches beyond the repo.
