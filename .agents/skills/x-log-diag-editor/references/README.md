# Mechanism index

The mechanism choice is two questions, not one.

| Question                                   | Kind                                                      | Answered by                   |
| ------------------------------------------ | --------------------------------------------------------- | ----------------------------- |
| Which references _can_ apply to this file? | a **fact** about the file (and this run's requested mode) | derived, every time, silently |
| Among those, which do we prefer?           | a **policy**, constant across files                       | once, then remembered         |

This run's requested mode is part of the first question: a reference that does not list it cannot apply.

## Algorithm

1. Derive the applicable set by matching the file's context against each reference's `applicability`.
2. Filter by this run's requested mode against each reference's declared `modes`. A reference that does not list this run's requested mode drops out.
3. Order by each reference's declared `priority` (lower is preferred). Framework-specific outranks generic. The ordering is data in the references, never prose here, so adding a mechanism cannot require editing this rule.
4. The winner is the first remaining. Then apply the stop conditions below — including `inapplicable: ask` — **before** writing.
5. If no stop fired: **apply the winner** — that reference's file is what writes the records (companion + one-liners when `companion: yes`; inline when it cannot) — **and say in one line which and why**, plus which prefs layer supplied each key that is not the announced default. Do not stop. Do not write a call from `SKILL.md`.
6. Afterwards, if the set had more than one candidate and no preference is recorded, **offer** to remember it — after the edit, so the user judges a real diff rather than a hypothetical. This skill's keys are team keys: write `.agents/_team/skills/x-log-diag-editor/` after an explicit yes, never `.agents/_local/`.

`modes`, `companion`, and `inapplicable` are declared in each reference's frontmatter. Read them there; this file does not restate a reference's values.

## Stop conditions

Stop only when:

- priorities genuinely tie
- a recorded preference names a mechanism that cannot apply to this file
- the user asked to choose
- the applicable set is empty after the mode filter (no remaining reference serves this run's requested mode)
- **`inapplicable: ask`** — a catalogued mechanism declares `inapplicable: ask`, is not in the applicable set, and its `priority` is lower (preferred) than the winner's. Ask: this file cannot use that mechanism (say why). Apply the remaining winner anyway, or skip logging? **Recommended: skip (no new logs).** Apply the remaining winner only on an explicit yes.

  Do not fire this stop when: the `inapplicable: ask` mechanism **is** in the applicable set (it won or lost on priority, no question); or the user already asked for the remaining winner.

  **A recorded `mechanism` pref does not suppress this stop.** That pref reorders mechanisms that _can_ apply; it says nothing about one that cannot, and letting it answer here would be the remembered "always use the leftover" that the methodology rules out. A workspace where the preferred mechanism will never apply asks every time, by design — the fix is to remove that mechanism from the catalog, not to pin past it.

  Several named files that all miss the same preferred mechanism → one ask, listing each file and why. They may still say yes for a subset.

  A recorded preference that names the `inapplicable: ask` mechanism when that mechanism cannot apply is the same question, not a second one. Recommended: skip.

This skill fires often. Stopping to confirm what was already derived correctly trains the reader to stop reading the question. A wrong automatic pick among mechanisms that **can** apply is cheap and visible: the lines are in the diff, and pruning is in scope. Silent leftover when an `inapplicable: ask` mechanism cannot apply is not that case.

## Index

| Mechanism            | Reference file                                                         | Use when                                                                                          | Cannot be used when                                                                                                          | Priority |
| -------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| `ng-shake-debugger-v1` | [mechanisms/ng-shake-debugger-v1.md](mechanisms/ng-shake-debugger-v1.md) | an Angular inject context, in a workspace that has the shake-debugger util, that can import that package | the util is not in this workspace; no inject context; importing the package would be a cycle or a module-boundary violation; a file that is not TypeScript or JavaScript | 10       |
| `js-console`         | [mechanisms/js-console.md](mechanisms/js-console.md)                   | any TS/JS context, including those without dependency injection                                   | a file that is not TypeScript or JavaScript; a context that needs records retained or exported                               | 100      |

## Preference

Resolve **per key**. First match wins:

1. This run's explicit instruction.
2. `.agents/_team/skills/x-log-diag-editor/prefs.json` (committed).
3. `.agents/_local/skills/x-log-diag-editor/prefs.json` (gitignored).
4. Announced defaults below and in each mechanism reference.

A key present on the team file wins over local, even when the team value equals the announced default. A key omitted from the team file can still come from local. A missing file is not a layer. A `version` mismatch on **one** file (older, missing, or newer than the example below) means treat that file as absent for this run: announced defaults for its keys, and offer to rewrite it to match the example.

Announce in one line which layer supplied each key that is not the announced default (`team`, `local`, or this run).

Skill-wide keys live at the top level; each mechanism's own keys live under `mechanisms.<name>` — the same split as this index. Adding a mechanism is a new object in that map, not a new top-level key. Each mechanism reference names the keys under its own object; this file does not restate them.

| Key          | Where                        | Announced default (file or key absent)                                            |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------- |
| `version`    | top-level integer            | current shape is `1` — compare against the example below, not the skill's `1.9.0` |
| `mechanism`  | top-level string             | derived by the algorithm — set it **only** to override the `priority` order among mechanisms that _can_ apply, which is why the example below omits it |
| `mechanisms` | map of per-mechanism objects | `{}` — each reference's own announced defaults apply                              |

**What `version` is for.** The example JSON below is the current shape of this file; its `"version"` is that shape's number. Compare each file's `"version"` to the example's separately.

That is the only thing `version` does. It is not the skill's `metadata.version`. `guardFile` is verbatim and has no `version` of its own — a format change to custom guards bumps `prefs.json`'s `version`.

A stored `mechanism` that remains in the applicable set is the winner; if it cannot apply, that is a stop condition, not a silent fallback. A missing `mechanisms.<name>` object, or a missing key inside it, uses that mechanism's announced defaults; do not fail the run. Unknown keys on a sibling mechanism are ignored.

**All keys this skill stores are team keys** — they change the companion or the call shape. After an explicit yes, write `.agents/_team/skills/x-log-diag-editor/` (create the parent if needed; it is a git change). Never write them to `.agents/_local/`. If the team file already has that key, do not offer unless they ask to change the team default. Verbatim fragments (`guardFile`) sit in the same home as the `prefs.json` that names them.

```json
{
  "version": 1,
  "mechanisms": {
    "ng-shake-debugger-v1": {},
    "js-console": {
      "guard": "dev-mode",
      "sourcePrefix": "@",
      "eventSuffix": ":"
    }
  }
}
```

Both files are optional; the skill works fully with both absent. A stored value is a default this run's instruction overrides. Writing happens only after an explicit yes.
