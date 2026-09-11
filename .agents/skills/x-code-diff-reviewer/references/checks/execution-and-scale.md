# Checks — execution and scale

**Load when:** the diff contains async work, a subscription, a loop over a collection, shared
mutable state, or a method a user can trigger more than once.

## Why this file exists, and what it deliberately omits

Almost every defect class is visible in the text of a diff, and gets found by reading carefully:
a missing null check, a swallowed error, dead code, an unescaped sink, duplicated logic, a rule
broken. **This file is not about those.** It carries the two classes that are invisible in the
text because the code is correct as written and wrong only when you reason about it **running** —
repeatedly, at the same time, or over real data.

Baseline testing found both of these missed while everything else was caught. So do not treat
this as a general bug checklist. When reviewing, read for defects normally; then come back and
ask the two questions below, which normal reading does not prompt.

## Question 1 — what happens when this runs twice?

Ask it of every method a user can trigger more than once: a load, a search, a save, a refresh, a
tab change, a keystroke handler.

| Look for                                                                                 | The failure                                                                                                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| two calls in flight with no cancellation                                                 | the **slower earlier** response resolves last and overwrites the newer result. The screen shows data for a request the user has already moved on from. |
| a result assigned in a callback with no check that it is still wanted                    | same failure, one layer down — nothing ties the response to the request that asked for it                                                              |
| a `loading` / `busy` / `disabled` flag set true at the start and false in every callback | the first response to return clears the flag while another request is still running                                                                    |
| shared mutable state written from more than one async path                               | last-writer-wins, and which one wins depends on network timing, so it reproduces on one machine and not another                                        |
| a guard read before an `await` and acted on after it                                     | the state it guarded can have changed across the suspension point                                                                                      |

**The tell that it is a real finding:** you can describe a concrete interleaving in one sentence.
"Type `a`, then `b` quickly; if the request for `a` is slower, the list ends up showing results
for `a`." If you cannot write that sentence, it is speculation — drop it rather than report it.

**Report the race separately from any teardown finding.** They look alike and have different
fixes. A missing unsubscribe is about a component that is gone; a race is about a component that
is still here and now shows the wrong thing. Fixing the teardown does not fix the race, so
folding them into one finding tells the author they are done when they are not — which is what
happened in baseline testing.

## Question 2 — what happens when the collection is large?

Ask it of every loop and every stream operator that handles a collection.

| Look for                                                                                                      | The failure                                                                               |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| a scan **inside** a loop — `find`, `filter`, `includes`, `indexOf`, or a nested loop over a second collection | quadratic work. Fine at 10 rows, visibly slow at 1,000, frozen at 10,000                  |
| the same derived value recomputed on every iteration                                                          | constant work multiplied by the collection size for no reason                             |
| work inside a subscription or change-detection path that could be done once                                   | it re-runs on every emission, and emissions are usually more frequent than anyone expects |
| a collection rebuilt in full when one item changed                                                            | the cost scales with the whole list on every small edit                                   |

**The fix is almost always a lookup built once** — a `Map` or `Set` keyed by the thing being
searched for — and then read inside the loop. Say that; it is short and it is the standard
answer.

**Calibrate honestly.** A nested scan over a collection that is structurally small — a fixed
config list, a handful of tabs, a small enum — is not a finding. Judge it by what the data
actually is, and say which you assumed. If you cannot tell how large the collection gets, that
is a `question`, not an `issue`: ask how many rows this holds in production.

## Severity

Both classes use the reach calibration in `SKILL.md`. Two specifics:

- A race in a **shared** lib is blocking: every consumer inherits it, and it presents as an
  intermittent bug nobody can reproduce, which is expensive out of all proportion to the fix.
- Quadratic work is usually **non-blocking** — it is a real defect, but it degrades rather than
  breaks, and the correct collection size is often something only the author knows.

## What this file does not cover

Do not extend it into general performance review — bundle size, render counts, memory profiling,
database query plans. Those need measurement, and a reviewer who guesses at them from a diff
produces confident noise. If the change looks performance-sensitive beyond the two questions
above, say so in _What I did not check_ and suggest a measurement.
