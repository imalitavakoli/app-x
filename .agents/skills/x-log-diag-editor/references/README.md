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
4. **Apply the winner** — that reference's file is what writes the records (companion + one-liners when `companion: yes`; inline when it cannot) — **and say in one line which and why. Do not stop.** Do not write a call from `SKILL.md`.
5. Afterwards, if the set had more than one candidate and no preference is recorded, **offer** to remember it — after the edit, so the user judges a real diff rather than a hypothetical.

`modes` and `companion` are declared in each reference's frontmatter. Read them there; this file does not restate a reference's values.

## Stop conditions

Stop only when:

- priorities genuinely tie
- a recorded preference names a mechanism that cannot apply to this file
- the user asked to choose
- the applicable set is empty after the mode filter (no remaining reference serves this run's requested mode)

This skill fires often. Stopping to confirm what was already derived correctly trains the reader to stop reading the question. A wrong automatic pick is cheap and visible: the lines are in the diff, and pruning is in scope.

## Index

| Mechanism    | Reference file                                       | Use when                                                        | Cannot be used when                                                                            | Priority |
| ------------ | ---------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| `js-console` | [mechanisms/js-console.md](mechanisms/js-console.md) | any TS/JS context, including those without dependency injection | a file that is not TypeScript or JavaScript; a context that needs records retained or exported | 100      |

## Preference

Read `.agents/local/x-log-diag-editor/prefs.json`. Skill-wide keys live at the top level; each mechanism's own keys live under `mechanisms.<name>` — the same split as this index. Adding a mechanism is a new object in that map, not a new top-level key. Each mechanism reference names the keys under its own object; this file does not restate them.

| Key          | Where                        | Announced default (file or key absent)                                            |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------- |
| `version`    | top-level integer            | current shape is `1` — compare against the example below, not the skill's `1.0.0` |
| `mechanism`  | top-level string             | derived by the algorithm                                                          |
| `mechanisms` | map of per-mechanism objects | `{}` — each reference's own announced defaults apply                              |

**What `version` is for.** The example JSON below is the current shape of this file; its `"version"` is that shape's number. When you read the user's `prefs.json`, compare their `"version"` to the example's:

- **Same number** — read the keys as this section describes.
- **Older, missing, or newer** — do not guess. An older file may still have keys, but they may sit in a different place (for example a flat `guard` at the top level instead of under `mechanisms`). Treat the file as absent for this run: announced defaults, and offer to rewrite it to match the example. A newer number is a shape this skill revision has never seen; same handling.

That is the only thing `version` does. It is not the skill's `metadata.version`.

A stored `mechanism` that remains in the applicable set is the winner; if it cannot apply, that is a stop condition, not a silent fallback. A missing `mechanisms.<name>` object, or a missing key inside it, uses that mechanism's announced defaults; do not fail the run. Unknown keys on a sibling mechanism are ignored.

```json
{
  "version": 1,
  "mechanism": "js-console",
  "mechanisms": {
    "js-console": {
      "guard": "dev-mode",
      "sourcePrefix": "@",
      "eventSuffix": ":"
    }
  }
}
```

The file is optional; the skill works fully without it. A stored value is a default this run's instruction overrides. Writing it happens only after an explicit yes. The skill-local state convention owns those rules; this file does not restate them beyond that pointer.
