# Doc map

**Load when:** you have the list of changed files and need to know which `docs/` pages govern them.

This file contains **no rules**. It maps a trigger to a doc path. The doc is the source of truth
for every standard and convention; read it and enforce what _it_ says.

**Do not paraphrase a doc's rule into the report.** Cite it — each finding carries `rule_source`
with the path, and an anchor where the doc has one. A reader must be able to check you.

**Never restate a rule from memory.** A hand-copied convention drifts from its source and then
reads as authoritative while being wrong. The reviewer config this skill replaces had copied a
lib's interface naming schema and dropped part of the required prefix; a reviewer trusting that
copy would fail correct code and pass incorrect code. Read the schema from
`docs/guidelines/naming-conventions.md` every time — including when you are certain you remember
it.

## If a path here does not exist

**Report it as a finding** — label `chore`, non-blocking, against this file. Name the entry and
the missing path.

Never skip it silently. A review that loses a check because a doc moved keeps reporting success
while covering less every month.

## Always

| Read                                          | For                                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/guidelines/best-practices.md` — in full | Mindset, Documenting, Organizing. You cannot tell which section binds until you are into the change, so read it whole.                |
| `docs/guidelines/naming-conventions.md`       | anything named: libs, folders, classes, selectors, CSS classes, interfaces, branches, commits                                         |
| `CONTEXT.md`                                  | before writing any workspace term into a report. Search for the term in bold. A miss means it is not a term — do not invent an entry. |

## By what the change contains

| Trigger in the diff                                                                             | Read                                                                                                                                            |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| any `libs/**` file — a lib created, moved, renamed, or restructured                             | `docs/getting-started/library-types-and-their-relationship.md` — start at its Quick decision cheat-sheet                                        |
| an import added or changed between libs                                                         | same doc → its import matrix, and `.eslintrc.json`'s `@nx/enforce-module-boundaries`                                                            |
| a lib gained or changed a version folder, or a shared lib's public surface moved                | same doc → Versioning shared libs                                                                                                               |
| a `map` lib, or a lib's `data-access` sister                                                    | same doc → the sister-lib rule; `docs/guidelines/naming-conventions.md` for interface schemas                                                   |
| a `feature` lib's inputs or outputs                                                             | `docs/tuts/faq.md` — the error-surface contract for `feature` libs                                                                              |
| a route added or changed in an app's `app.routes.ts`                                            | `docs/getting-started/library-types-and-their-relationship.md` — which lib type an app may route to                                             |
| a DEP config or DEP asset added or changed                                                      | `docs/guidelines/lib-backward-compatibility.md`; `docs/runbooks/dep-update-config-for-a-lib.md`; `docs/runbooks/dep-update-assets-for-a-lib.md` |
| an API response shape or error handling in a `map`/`data-access` lib                            | `docs/runbooks/api-update-responses.md`; `docs/runbooks/api-add-errors-as-exceptions.md`                                                        |
| a `Communication` service interface                                                             | `docs/runbooks/communication-create-interface-for-a-lib.md`                                                                                     |
| a web component added or changed                                                                | `docs/runbooks/web-component-create.md`; `docs/runbooks/web-component-update.md`                                                                |
| a whole functionality created                                                                   | `docs/runbooks/functionality-create.md`                                                                                                         |
| UI or UX changed                                                                                | `docs/runbooks/ui-ux-update.md`                                                                                                                 |
| an `ion-*` element, `ion-router-outlet`, or a mobile-app page shell (header / footer / content) | `docs/tuts/faq.md` — Ionic & Capacitor (mobile apps)                                                                                            |
| an app's Capacitor config, Ionic bootstrap, or native project wiring                            | `docs/tuts/boilerplate-apps.md` — How to integrate Ionic & Capacitor                                                                            |
| a color literal, a brand CSS variable, or a Tailwind color / palette class                      | `docs/getting-started/designers-related.md`; then the consuming app's Tailwind config and the `ui` preset it extends                            |
| `docs/x/{domain}/{name}/PRD/` or `TSD/` changed, or a change that should have updated them      | that functionality's own PRD and TSD                                                                                                            |
| a branch name or commit message is in scope                                                     | `docs/guidelines/naming-conventions.md#git`                                                                                                     |
| the change is being prepared for a PR                                                           | `docs/guidelines/pr-rules.md`                                                                                                                   |
| `CODEOWNERS` changed, or a new path was created                                                 | `docs/guidelines/pr-rules.md`; `docs/introduction/folder-structure.md`                                                                          |
| a workspace-wide structural question                                                            | `docs/introduction/folder-structure.md`; `docs/tuts/directories-and-files.md`                                                                   |
| an Nx command, target, or build config                                                          | `docs/guidelines/available-commands.md`                                                                                                         |

## Portability

These paths are the convention this skill reviews against. If a repo lays its docs out
differently, **fix this file** rather than teaching the rule to the skill — one edit here keeps
`SKILL.md` and every `checks/` page unchanged.

The three-column form is deliberate: a trigger, a path, and nothing else. The moment a rule's
text appears in this table, it has a second home and will drift.
