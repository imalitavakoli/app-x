# Checks — Angular and library structure

**Load when:** the diff contains `.ts`, `.html`, or an Nx project under `libs/` or `apps/`.

This is the largest area and **almost none of its rules live here.** The library types, their
import matrix, versioning, the sister-lib rule, and every naming schema are owned by `docs/` —
see `references/doc-map.md`. Read the doc the map names and enforce what it says. The canonical
shape of each lib type is a worked example in a sibling skill — see
`references/skill-assets-map.md`.

What follows is only **where to look**, and the reviewer-specific judgement that no doc covers.

## Where to look, by what changed

| In the diff                                                                                         | Look at                                                                                                                               |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| an added or changed `import` between libs                                                           | the importing lib's type and the imported lib's type, against the import matrix                                                       |
| a new lib                                                                                           | its type, its placement, its name, whether the type requires a sister lib, whether it is registered where new libs must be registered |
| a route in an app's `app.routes.ts`                                                                 | which lib type the route loads                                                                                                        |
| a shared lib's public surface — an `index.ts`, an exported symbol added, renamed, or removed        | whether the change is breaking, and whether it belongs in a new version folder                                                        |
| an exported class, interface, function, selector, or CSS class                                      | its name against the schema for that lib type                                                                                         |
| a `feature` lib's inputs and outputs                                                                | its error-surface contract                                                                                                            |
| a `map` lib                                                                                         | its interfaces, its method names, its error handling                                                                                  |
| a `data-access` lib                                                                                 | state shape, effects, selectors, subscription cleanup                                                                                 |
| a `ui` lib                                                                                          | that it stays presentational and receives data through inputs                                                                         |
| a component's change detection, lifecycle hooks, or subscriptions                                   | leaks and missing teardown                                                                                                            |
| an `ion-*` element, `ion-content` / `ion-header` / `ion-footer` / `ion-app`, or `ion-router-outlet` | the workspace's Ionic & Capacitor mobile-app docs — see `references/doc-map.md`                                                       |

## Judgement this skill owns

**A removed or renamed export is a breaking change even when nothing in this repo consumes it.**
Grep the repo, then say what you found: "no consumer in this repository" is a useful fact, but a
shared lib may have consumers outside it. Report the removal; do not conclude it is safe.

**Do not report what the compiler or linter owns.** A type error, an unresolved import, a
missing symbol — the _Automated checks_ section reports those from a real exit code. Duplicating
them as hand-judged findings inflates the report and trains the reader to skim it.

**A rule you believe exists but cannot find in `docs/`** is not a finding against the code. It is
a `chore` finding saying the rule has no doc home. Never enforce a remembered convention.

**Angular style and anti-patterns.** Workspace `docs/` still win. For an Angular API or pattern
no workspace doc covers, apply _Framework authorities_ in `SKILL.md` to the installed
`@angular/core` version. Do not copy a style guide into this file, and do not enforce one you
remember from another version. An Angular MCP, if this session has one, is a lookup — its
absence is not a finding.

## An unfinished change is a finding about the change, not a list of defects

A component with no template, a route pointing at nothing, a function that always returns null —
these are usually one fact: the work is not finished. Report it once, as a single `issue`, and
name the pieces. Filing each symptom separately buries the one thing the author needs to know
and inflates the blocking count.

Say plainly that the change appears incomplete, and let the author confirm — they may know
something you do not.
