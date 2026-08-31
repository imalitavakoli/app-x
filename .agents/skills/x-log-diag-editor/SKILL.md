---
name: x-log-diag-editor
description: 'WHAT? The rule for which call sites deserve a diagnostic log, and the edit that adds, prunes or downgrades them in named files. WHEN? Asked to add, audit, prune or level-correct logging in components, services, utils or plain TS/JS; deciding whether a call site deserves a log, which severity it takes, or which logging mechanism to use. Not for diagnosing a defect, and not for analytics or product-event logging.'
metadata:
  kind: editor
  version: '1.9.0'
---

# Log Diag Editor

## Overview

This skill specifies terms, context and methodology for diagnostic logs in files the user named. The agent reading this makes the edit.

This file supplies the recommendations: whether a site deserves a log, which level, which mode this run asked for, and that records live in a companion beside the target. The chosen mechanism reference supplies the edit — how those recommendations are realized from that mechanism's capabilities.

No `scripts/` transform ships, because the right call site is a judgement. That is why the _Already done?_ rule below is written out rather than delegated to a transform.

**"diag"** names the audience — logs a developer or an agent reads while diagnosing — not the `DEBUG` level specifically. The methodology covers all four levels.

## Invoker & moment

**Shape: in-session primary, document secondary.**

In-session because the agent asked for logs can invoke this skill from its own `description` — bound to adding, auditing, pruning or level-correcting diagnostic logs, and not to diagnosing a defect.

Document as well, because an isolated execution agent reads files and never invokes skills. This skill's repo-relative path is `.agents/skills/x-log-diag-editor/SKILL.md` — whatever carries it copies something that resolves.

## Why these logs exist

> **A test and a log answer different questions.** A test asks _does this code do the right thing for
> inputs I choose?_ A log asks _what actually happened in this run, with the real state?_ That is why
> test coverage never removes a boundary log — and why a pure function needs no log at all: with no
> state beyond its arguments, the two questions collapse into one, and the test answers it better.

A log is a record produced so a later reader — increasingly an agent — can reconstruct what happened without re-running the code. Three consequences:

- **Structure is mandatory** because a record is only evidence if it can be filtered and correlated mechanically.
- **Sparse beats complete** because evidence works by contrast, so a file where everything announces itself has no signal.
- **Correlation beats description.**

A log call site is not a report. Producing something handable — an export with timestamps, filterable by source — needs a mechanism that retains records and can emit them; where the chosen mechanism has none, the records are read wherever that mechanism puts them. The call shape below serialises cleanly either way, so adopting such a mechanism later changes the mechanism reference and not a single call site.

## Decision order

Apply these three steps first, per call site:

1. Is this a boundary, an error edge, or a decision that cannot be reconstructed later? **No** → no log, stop; purity and coverage never come up.
2. **Yes** → recommend a log at a level; purity and coverage never come up here either. How that recommendation is written is the chosen reference's job.
3. Only for a candidate step 1 rejected, where someone still wants a log: ask _is it pure, and is it covered?_

A method that mutates a field and touches nothing else is rejected at step 1 — it is not a boundary; that it is also technically impure is irrelevant, purity was never the reason.

## Severity — four levels

| Level   | Means                                     | Recommended intent |
| ------- | ----------------------------------------- | ------------------ |
| `DEBUG` | fine-grained developer trace              | developer-only     |
| `INFO`  | a notable thing happened                  | developer-only     |
| `WARN`  | not an error but more important than info | always-on          |
| `ERROR` | something went wrong                      | always-on          |

The table states meaning and recommended intent, not a procedure: do not write a call, a guard, or a shipping rule in this file. How — and whether — a recommended level is realized is the chosen reference's job (which levels it can keep out of production, how, and what it does when it cannot). An explicit `guard: none` (or this run's instruction) is an override the _reference_ may offer, not a contradiction of the ladder. Four levels are used because they map onto any mechanism without a reference having to fake a level it cannot express; the fuller reasoning lives in `references/methodology.md`.

## Call shape

Three parts, because unstructured strings are unsearchable:

- **source** — the class or module the record comes from
- **event key** — camelCase identifier, legal as a method name, e.g. `loadItemsFailed`
- **attributes** — the data, named fields only

This file defines the three parts as the recommended record shape. Each mechanism reference maps them onto its own API. When the reference isolates in a companion, the named file's one-liners _are_ this shape (source = companion, event key = operation name, attributes = argument). Do not write a call from this file.

## Companion file

Recommend a companion beside the named file as the **default**, both modes. Same folder; named from the target by inserting `.log-diag` before the extension. The companion owns the records; the named file only constructs it and calls one-liners. Do not offer companion vs inline as a preference.

**Do not name a class** — a class is one language's construct; this file states the pattern only. Each reference declares `companion: yes` or `no` in frontmatter. If `yes`, it fills the companion. If `no`, it states that ceiling and writes the records the way it can. Creating the companion when absent is the edit's empty case; the named file must already exist.

## Where to log

- I/O edges (network, storage, native bridge, third-party SDK) as start / success / failure
- error edges (`catch`, `catchError`) for the genuinely unexpected only
- branch points invisible afterwards (a fallback taken, a cache hit, a flag decision, a guard denial)
- state transitions that outlive the call (auth, connectivity, selected account)

## Where not to log

| Do not log                                           | Because                                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| a pure or deterministic function **that has a test** | the test already proves the behaviour, repeatably; a log proves it once, only if someone was watching |
| mappers, selectors, getters                          | they restate their input, so the record duplicates what the caller already holds                      |
| render, template and change-detection paths          | they run at a frequency nobody can read, and the volume buries what matters                           |
| loops and high-frequency streams                     | the same, plus each retained argument is memory the collector cannot reclaim                          |
| expected control flow                                | a handled validation failure is the code working; recording it trains the reader to ignore records    |
| entry-and-exit of every method                       | signal comes from contrast; when everything announces itself, nothing stands out                      |
| anything the caller already logged                   | two records of one event make the count meaningless                                                   |

## Untested code

Coverage is consulted for **pure functions only**; every other call site is decided at step 1 with no reference to tests, so a lib with no specs whose functions touch storage or the network gets logged exactly as a covered one would.

A function is **pure** when its output is determined solely by the arguments, and nothing outside the function is read or changed: no storage, no network, no clock, no mutation of an argument or a field.

| Pure function     | Has a covering test               | No covering test                                                                                                                                   |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **standing**      | no log — the test is the evidence | still no standing log — **say why and hand it back**: the stronger evidence is a test, which this skill does not write and does not name what does |
| **investigation** | no log either way                 | marked dense logs                                                                                                                                  |

Nothing here blocks: an explicit instruction to log anyway wins.

**Report the assertion, do not write the test.** An observed argument/return pair from an uncovered function is a ready-made assertion, so state what the investigation revealed in that form and stop.

## Two modes

|         | **Standing**            | **Investigation**                            |
| ------- | ----------------------- | -------------------------------------------- |
| Lives   | committed, indefinitely | one debugging session                        |
| Density | sparse, boundaries only | dense, including arguments and return values |
| Levels  | the full ladder         | `DEBUG`                                      |
| Removal | pruned only when wrong  | **removed when the investigation ends**      |

Investigation logs are what "record what this function received and returned" asks for — trace spam when standing, legitimate when temporary and scoped.

**Which mode this run asked for** is a fact about the request, not a judgement this file makes; **whether — and how — the chosen mechanism serves that mode** is the reference's job (`modes` in its frontmatter, plus the mark and the removal pass). A reference that does not list the requested mode cannot apply.

**Investigation records must be identifiable as a set**, so removal is one mechanical complete pass rather than a hunt; unmarked temporary logs are how a codebase accumulates unclassifiable calls. This file requires identifiability; **the chosen reference defines the mark**. If the chosen reference cannot mark them, it cannot serve investigation. The skill refuses to add investigation logs that the chosen reference has not marked, and removes all records carrying that mark on request. With a companion, removal touches **both** files: marked operations in the companion and matching one-liners in the named file; an emptied companion is deleted with the named file's construct/import.

## Hard rules

Never record tokens, session identifiers, passwords, keys, payment or bank data, government identifiers, health data, connection strings, or anything a user opted out of. Never dump a whole value or payload — name the two or three fields that matter. Sanitize interpolated values.

## Anti-patterns

log-and-rethrow at every layer · log instead of handle · stringifying a whole response · `ERROR` for expected conditions · logging in hot paths · duplicate records across layers · a log standing in for a good name · developer-only logs shipped ungated · a console method that carries no severity.

## Boundary — what is not this skill's

If the log **is** the product-observable event (analytics, an audit trail, anything someone would write an acceptance criterion for) that is design work and goes through the normal design route; this skill owns the mechanical shape once the requirement exists. Writing tests is likewise a separate deliverable.

## Choosing the mechanism

Which mechanism applies, and how to pick among those that can, is in [references/README.md](references/README.md). Apply that rule; do not restate it here.

Load [references/methodology.md](references/methodology.md) when someone questions a rule, wants to change one, or is adding a new one. Mechanism references live in [references/mechanisms/](references/mechanisms/). The shape each one must take is [assets/template/mechanism.md](assets/template/mechanism.md).

These files live under `.agents/skills/x-log-diag-editor/`. When handing this skill to an agent that cannot read it, give it that repo-relative path.

## Target & scope

Edit only the files the user named, and the companion beside them when the chosen mechanism uses one. Creating that companion when it is missing is part of this edit.

Skip: third-party / vendored code, test files (`*.spec.ts` and the like), and output from other generators (OpenAPI clients, protobuf stubs — not this skill's companion). Skip any file whose records would **be** the product (analytics, an audit trail) — that is a feature, not this edit.

## Prerequisites

The named file must exist and be identifiable; more than one candidate → STOP and ask, do not pick one. The companion may be created.

## The edit

Do not write a call site, import, guard, marker or class from this file. The sequence is: apply the methodology above, choose the mechanism per `references/README.md`, then follow that reference's procedures (companion + one-liners when `companion: yes`). The worked before/after lives in the reference.

## Already done?

An existing record for the same event at the same call site is an update in place, never a second record. Match on source + event key (companion operation name), not on message text.

This only applies inside a file you are already editing. If that file already has a log at a call site that step 1 now says should not log, that existing log is a pruning candidate: report it to the user. Do not remove it as a side-effect of adding logs elsewhere. A site with no log that step 1 rejects is left alone — there is nothing to delete.

## Verify

Lint and test the touched project after editing; on failure fix or revert, never leave the workspace unable to build.

## Changing or adding a rule

Copy these into todos so they stay grouped. Load `references/methodology.md` on this occasion — before changing a rule, when someone questions one, or when adding a new one.

- [ ] `[log-diag]` Read `references/methodology.md` before changing a rule
- [ ] `[log-diag]` State the failure the new rule prevents
- [ ] `[log-diag]` Update the reasoning in that reference in the same change
- [ ] `[log-diag]` Update its `Explains:` line to the new version
- [ ] `[log-diag]` Bump this skill's version (minor for a changed or added rule)
- [ ] `[log-diag]` Update the stub only if the `description` changed

## Common mistakes

| Mistake                                                                           | Fix                                                                                                  |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A log added because the method looked important                                   | Apply the decision order. Step 1 is the only question that admits a log.                             |
| A lifecycle hook logged because it is a lifecycle hook                            | Log it only if it starts something. "It runs early" is not a boundary.                               |
| A record whose message is one concatenated sentence                               | Separate source, event key and attributes. A sentence cannot be filtered.                            |
| A whole response or value passed as the attribute                                 | Name the two or three fields that matter.                                                            |
| `ERROR` used for a handled condition                                              | Match the level to the ladder. A handled failure is not an error.                                    |
| Investigation logs added without the marker                                       | Refuse. The chosen reference must mark them. Unmarked temporary logs cannot be removed completely.   |
| Investigation logs left behind after the session                                  | Remove all marked records in the companion and the matching one-liners; delete an emptied companion. |
| A second record added beside an existing one for the same event                   | Match on source + event key and update in place.                                                     |
| A test written because a pure function was uncovered                              | Report it and hand it back. This skill does not write tests.                                         |
| A mechanism chosen by asking when the file already settled it                     | Derive, apply, announce in one line. Ask only on the stop conditions in the index.                   |
| Silent leftover when an `inapplicable: ask` mechanism cannot apply                | Stop. The index recommends skip (no new logs). Do not add a lib to make that mechanism apply.        |
| This skill's prefs written to `.agents/_local/`                                    | Write `.agents/_team/skills/x-log-diag-editor/` after an explicit yes. These keys change the artifact.       |
| A non-default pref used without saying which file supplied it                     | Name the layer (`team`, `local`, or this run) in the same line as the mechanism pick.                |
| An existing log at a site step 1 now rejects, deleted while adding logs elsewhere | Report that existing log; whether to remove it is the user's call.                                   |
| Mechanism written into the named file when the reference can isolate              | Follow the companion. The named file holds construct + one-liners only.                              |
| A class (or other language construct) named in this file                          | State the companion pattern only. The reference names the construct.                                 |
| `logDebug` exposed on the companion, or called from the named file                | Named file: event-named one-liners. Companion: private `log` is the only hop onto the service.       |
| Inline `logDebug` rewritten into a companion while adding logs elsewhere          | Update inline in place. Companion is for sites with no existing record.                              |
