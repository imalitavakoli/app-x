# Checks — DEP configs and assets

**Load when:** the diff touches a DEP config file, a DEP asset, or the mapping layer that reads
one.

Backward compatibility is owned by `docs/guidelines/lib-backward-compatibility.md`. The property
naming and the procedure for adding a config or an asset are owned by
`docs/runbooks/dep-update-config-for-a-lib.md` and
`docs/runbooks/dep-update-assets-for-a-lib.md`. Read them and enforce what they say.

These runbooks are procedures, so the highest-value check is simply: **did the change complete
the procedure, or stop partway?** A half-applied DEP change breaks a client at runtime with no
build error.

## Where to look

| In the diff                             | Look at                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| a new config property                   | its name against the runbook's schema; whether the reading code tolerates its absence |
| a renamed or removed property           | whether old clients still work — this is the backward-compatibility rule              |
| the mapping layer that reads a config   | that it falls back when the new key is missing                                        |
| a new DEP asset                         | whether every app that must carry it does                                             |
| a config or asset added to one app only | which other apps were supposed to mirror it                                           |
| a new client toggle                     | its default value                                                                     |
| any DEP JSON                            | that it parses, and that its shape matches its siblings                               |

## The mirroring check

A config or asset introduced for one app usually has to appear in the app that consumes it
**and** in the workspace's reference or boilerplate app, so the pattern stays copyable.

**Do not hardcode which app that is.** Repos name it differently, and a name baked in here goes
stale silently. Resolve it in this order:

1. `.agents/_team/skills/x-code-diff-reviewer/prefs.json` → `boilerplate_apps`, if present.
   Overlay and schema: `SKILL.md` → _Optional prefs_.
2. Otherwise, the app the workspace's own docs treat as the reference app.
3. Otherwise, say in _What I did not check_ that you could not determine which app mirrors DEP
   changes, and report the mirroring question as a `question` rather than an `issue`.

Never guess from an app's name.

## Defaults

A newly introduced toggle's default decides what every existing client gets on their next
release without asking for it. Check the default explicitly and state it in the finding, even
when it is correct — it is the single field a reader most wants confirmed.

Whether the required default is "off" is the runbook's call, not this file's. Cite it.

## Partial application

Report an incomplete DEP change as **one** `issue` naming every place the procedure was not
finished, not as one finding per missing file. The author needs the shape of the gap, not a
list.
