# Sibling asset map

**Load when:** the diff contains something whose _canonical shape_ lives inside another skill
rather than in `docs/` or in a repo artifact.

Like the doc map, this file carries **paths and triggers only**. Read the asset and compare the
change against it. Do not copy its rules here, and do not restate them in the report — cite the
path in `rule_source`.

**These paths name files, not skills.** Read the file at the path. Do not invoke the skill whose
folder happens to contain it. The comparison is against the example; the producer skill is not
part of this review.

**These paths are repo-relative on purpose.** An agent that cannot invoke skills still resolves
them, so whatever you hand onward carries a path that works.

## Prefer the artifact over the asset

Reach for a sibling asset only when there is no artifact in the repo that answers the question.
An artifact is better evidence: it is what the change must actually agree with, and it cannot go
stale relative to itself.

| Question                                    | Check the artifact                                                                                                          | Not                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| do the tests cover the stated requirements? | the functionality's `docs/x/{domain}/{name}/TSD/` FR/BR IDs, or the lib's `requirements/README.md`, against the spec titles | a test helper's procedure       |
| is this path owned?                         | root `CODEOWNERS`                                                                                                           | an ownership-editor's procedure |
| does the change match its spec?             | that functionality's PRD and TSD                                                                                            | a writer skill's template       |

Use an asset when the question is "what shape should this _be_", and the answer exists only as a
worked example.

## Entries

Each row says what it is for. A row with no reason to exist gets deleted.

| Trigger in the diff                                                   | Read                                                                                                                                                                                                                                                            | Why this and not a doc                                                                      |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| a lib created, restructured, or its README changed                    | `.agents/skills/x-ng-lib-build-helper/assets/examples/` — pick the file for that lib type (`map.md`, `data-access-single-instance.md`, `data-access-multi-instance.md`, `data-access-entity.md`, `ui.md`, `ui-grab-bag.md`, `feature.md`, `page.md`, `util.md`) | the canonical file/folder shape and both README shapes are worked examples, not prose rules |
| a `*.spec.ts` added or changed                                        | `.agents/skills/x-ng-test-unit-helper/assets/examples/unit-spec.md`                                                                                                                                                                                             | the required spec formatting and ID mapping exist only as an example                        |
| a `requirements/` registry added or changed (`util`, `app`, grab-bag) | `.agents/skills/x-ng-test-unit-helper/assets/examples/requirements/README.md`                                                                                                                                                                                   | the registry's own shape                                                                    |
| an e2e spec, page object, custom command, or fixture added or changed | `.agents/skills/x-ng-test-e2e-helper/assets/examples/` (`e2e-spec.md`, `page-object.md`, `custom-command.md`, `fixtures.md`)                                                                                                                                    | same reason as unit specs                                                                   |
| a `user-stories/` registry added or changed                           | `.agents/skills/x-ng-test-e2e-helper/assets/examples/user-stories/README.md`                                                                                                                                                                                    | the registry's own shape                                                                    |
| a diagnostic log call added, changed, or removed                      | `.agents/skills/x-log-diag-editor/references/mechanisms/` — the mechanism the lib uses                                                                                                                                                                          | which mechanism is correct, and its severity ladder, live only there                        |
| an analytics or product-event call added or changed                   | `.agents/skills/x-log-analytics-editor/references/mechanisms/` — the mechanism the lib uses                                                                                                                                                                     | event naming and parameter rules live only there                                            |
| a PRD or TSD file's own **shape** is in question                      | `.agents/skills/x-ng-doc-prd-writer/assets/template/README.md` · `.agents/skills/x-ng-doc-tsd-writer/assets/template/`                                                                                                                                          | the required section structure of those documents                                           |

## The two log entries are gated

Load a log mechanism reference **only when a log or analytics call is actually in the diff**.
These are the heaviest entries here and the rules have no artifact proxy, so they are worth
reading when triggered and pure cost when not.

Judge the call site against the mechanism the surrounding lib already uses. Do not propose
switching mechanisms as part of a review.

## If a path here does not exist

**Report it as a finding** — label `chore`, non-blocking, naming this file and the missing path.
A sibling skill can be renamed or retired, and a silently skipped comparison is worse than a
loud one.
