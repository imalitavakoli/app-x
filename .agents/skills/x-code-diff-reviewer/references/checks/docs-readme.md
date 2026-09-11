# Checks — READMEs and documentation

**Load when:** the diff changes a lib or app whose docs should move with it, or changes a
README, CHANGELOG, or a functionality's PRD/TSD directly.

**Documentation is reviewed as strictly as code.** A README that describes something the code no
longer does is worse than no README: a reader trusts it, follows it, and loses time before
discovering it is wrong.

`docs/guidelines/best-practices.md` owns the requirement that docs stay current and
`docs/guidelines/pr-rules.md` owns when they must be updated. The canonical shape of a lib's
outer and inner README is a worked example — see `references/skill-assets-map.md`. Read those;
do not restate them.

## Where to look

| In the diff                                           | Look at                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------- |
| a lib's public surface changed, but no README changed | whether the README still describes the lib accurately                      |
| a README changed                                      | whether it matches the code as it now stands, not as it was                |
| an inner version README                               | its copy-paste usage snippet, in detail — see below                        |
| an app changed                                        | its CHANGELOG entry and version                                            |
| a new lib or app                                      | that it has the READMEs its type requires                                  |
| a functionality's code changed                        | whether its PRD acceptance criteria and TSD requirements still describe it |
| a PRD or TSD changed                                  | whether the tests mapped to its IDs changed too — see `checks/tests.md`    |

## The inner README's usage snippet

An inner version README carries a copy-paste snippet that is supposed to work as written when
pasted into the workspace's test page. That promise rots quietly: the lib's API changes, the
snippet does not, and nobody notices until someone tries it.

**Verify it statically, every time the lib's public surface changes:**

- every symbol the snippet imports is actually exported by the lib now
- the component selector in the snippet is the selector the component declares
- every input and output the snippet uses exists, with a compatible type
- the import path is the lib's real path
- required inputs the snippet omits are named

**Then say what you did.** You read it; you did not run it. Add to _What I did not check_ that
the snippet was checked against the lib's public API but not executed. Claiming a snippet works
because it looks right is the unverified-assertion failure in another costume.

A snippet that references a removed or renamed symbol is a blocking `issue` — it is a documented
instruction that cannot succeed.

## Docs the change should have updated

The strongest documentation finding is usually about a file **not** in the diff: the code moved
and its README did not.

Report it against the README's path with `subject: "file"`, say what in the code changed, and
name what the README now claims that is no longer true. Quoting the stale line is what makes
this finding actionable rather than a nag.

Do not report a README as stale without reading it. "The README probably needs updating" is not
a finding.
