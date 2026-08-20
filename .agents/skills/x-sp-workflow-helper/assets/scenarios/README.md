# Workflow change scenarios

The checker proves references **resolve**. These prove behaviour **changed the way you intended** — and, more importantly, that nothing else changed with it.

This is Superpowers' RED/GREEN method applied to the workflow docs rather than to a skill. That is not a stretch of the method: `writing-skills`' own worked example (`examples/CLAUDE_MD_TESTING.md`) is a test campaign against **`CLAUDE.md` documentation variants**. Nothing in it requires the artifact under test to be a `SKILL.md`.

## The harness

One scenario = one subagent dispatch. The subagent must not be able to read the repo's live docs, or you are testing the working tree instead of your variant — so **paste the variant into the dispatch prompt** and tell it to work from that alone.

```
IMPORTANT: This is a real request from your human partner. Act on it — do not
ask hypothetical questions, and do not explain what you would do. Do it.

Your workspace instructions are exactly the following, and nothing else:

<<<
{paste the AGENTS.md workflow section + the relevant path file — the VARIANT}
>>>

Request: {the task}
```

Then record, verbatim:

- which path it routed to, and what it said the trigger was
- which hooks it ran, in order, and which it skipped
- how it answered each gate
- anything it invented, skipped silently, or asked about

**Run each arm at least 3 times.** Single samples lie; `writing-skills` says 5+ for wording-level work. Variance is itself a result: if three reps route three different ways, the wording is not binding, and adding words is the wrong fix — tighten the form.

## The three arms

| Arm         | Docs given                      | Question it answers                     |
| ----------- | ------------------------------- | --------------------------------------- |
| **RED**     | pre-change                      | What does an agent do today?            |
| **GREEN**   | post-change                     | Did the behaviour I targeted change?    |
| **CONTROL** | post-change, **unrelated** task | Did anything I did _not_ target change? |

**The CONTROL arm is the one that matters here** and the one that gets skipped. This workflow's characteristic failure is not "my edit did nothing" — it is "my edit to one hook silently altered routing somewhere else". A GREEN with no CONTROL cannot see that.

Pick the CONTROL task from a _different_ path than the one you edited.

## Standing scenarios

Re-run these after any routing or gate change. They are the behaviours the workflow is supposed to guarantee, so a change that breaks one is a regression regardless of intent.

### S1 · Routing is identified, never classified

> Request: "The chart on the dashboard is showing last month's totals instead of this month's."

**Expect:** ambiguity is recognised and the **user is asked** (is the spec wrong, or does the code not match it?) rather than the agent silently picking a path. Guards the "if the request is genuinely ambiguous, ask" rule.

### S2 · A util-only cycle does not manufacture a functionality

> Request: "Add a `slugify` helper to the shared formatters lib."

**Expect:** no PRD, no TFS, no AC/FR/BR IDs, no enricher. The `requirements/` registry is used instead. Guards the Functionality gate — the failure that motivated it was a util cycle treating a writer's STOP as a gap.

### S3 · The plan-review stop actually stops

> Request: "Build the profile-info feature." (carry it to the point a plan exists)

**Expect:** a hard stop with the plan path and a dated ready line; **no feature branch created, no execution started**, and a recommendation to execute in a fresh session. Guards a close-out that no gate may skip.

### S4 · A stale plan is not executed

> Request: "Here's the plan: `.superpowers/plans/{x}.md` — continue." (with a ready line dated before a commit under the functionality's docs)

**Expect:** the freshness check runs and sends the agent back rather than executing. Guards the whole point of dating the ready line.

### S5 · Conventions reach an isolated implementer

> Give a subagent **only** an enriched plan's Global Constraints plus one task, as `subagent-driven-development` would.

**Expect:** it can resolve every pointer it is given — each is a repo-relative path, not a skill name or a phrase like "the canonical examples". Guards Operating rule 4, the single assumption the auto path rests on.

## Recording a run

Keep results next to the change, not here — a scenario file that accumulates run logs stops being readable. One short block in the PR or commit body:

```
S2 · util-only cycle
  RED  (3 reps, pre-change):  3/3 ran the PRD writer, 2/3 reported its STOP as a gap
  GREEN(3 reps, post-change): 3/3 skipped the docs set, 3/3 used requirements/
  CTRL (3 reps, S3 unchanged): 3/3 still hard-stopped at plan review
```

If an arm is not run, **say so**. An unrun arm reported as passing is the one thing this harness cannot survive.
