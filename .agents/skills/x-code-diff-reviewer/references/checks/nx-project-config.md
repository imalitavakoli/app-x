# Checks — Nx project and workspace config

**Load when:** the diff touches a `project.json`, `tsconfig*.json`, `.eslintrc*`, `jest.config`,
`nx.json`, `package.json`, or a lockfile.

`docs/guidelines/available-commands.md` owns the workspace's Nx usage and
`docs/getting-started/library-types-and-their-relationship.md` owns what a lib of each type is
allowed to be. Read those. Where Nx's own conventions are the authority rather than a workspace
doc, apply _Framework authorities_ in `SKILL.md`: look up the installed Nx version (an Nx MCP,
if this session has one, is a lookup — not a required tool). Say so with
`rule_source.kind: none` and cite Nx by name and version — do not present a framework default as
a workspace rule. Absence of an MCP is not a finding.

## Reach decides severity here

Config files are where a small diff has the widest blast radius. Apply the calibration in
`SKILL.md` deliberately:

| Changed file                                                              | Reach                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `nx.json`, root `tsconfig.base.json`, root `.eslintrc*`, `jest.preset.js` | whole workspace — strict; an unexplained change here blocks |
| an existing project's `project.json` or `tsconfig`                        | that project and its consumers — strict                     |
| a **new** project's own config files                                      | nothing yet — lenient                                       |
| `package.json` / lockfile                                                 | whole workspace, and the pipeline                           |

**One expected exception:** registering a newly created lib's path in the root
`tsconfig.base.json` is part of creating that lib. It is not an unexplained root-config change
and must not be reported as one.

## Where to look

| In the diff                                                 | Look at                                                                                         |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| a new `project.json`                                        | name, `sourceRoot`, `projectType`, tags, and that its targets match what its lib type needs     |
| tags added or changed                                       | whether they match the type the lib actually is, since tags are what the boundary rule enforces |
| `.eslintrc` boundary rules relaxed, or a constraint removed | this weakens the architecture rule for everyone — always a finding, and say what it now permits |
| an `eslint-disable` for a boundary or architecture rule     | a suppressed rule is a violation with the alarm turned off                                      |
| a root config touched by a change that had no reason to     | scope drift — see `checks/pr-metadata.md`                                                       |
| `package.json` or the lockfile                              | a dependency added, removed, or upgraded                                                        |
| a target removed from an existing project                   | what in CI or the release process invoked it                                                    |

## Suppressions

An `eslint-disable`, a `ts-ignore`, a skipped test, or a widened `any` added in this change is a
finding even when the code around it is correct. Report what rule was suppressed and ask for the
reason to be recorded — an unexplained suppression is indistinguishable from a mistake six
months later.

An `eslint-disable` for `@nx/enforce-module-boundaries` specifically is blocking: it turns off
the mechanical enforcement of the import matrix, which is the one architecture rule the
workspace can actually check.

## Dependencies

`docs/guidelines/pr-rules.md` requires that a change to `package.json` or the lockfile be raised
with a person, because it can break the pipeline. Cite it, and report the change as a `note`
even when the dependency itself is unobjectionable — the point is that someone is told, not that
the reviewer approves.

Whether a third-party library should be introduced at all is governed by
`docs/guidelines/best-practices.md`. Cite that rather than forming your own policy.
