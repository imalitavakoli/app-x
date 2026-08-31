# Mechanism index

The mechanism choice is two questions, not one.

| Question                                   | Kind                                    | Answered by                   |
| ------------------------------------------ | ----------------------------------------- | ----------------------------- |
| Which references _can_ apply to this file? | a **fact** about the file and its project | derived, every time, silently |
| Among those, which do we prefer?           | a **policy**, constant across files       | once, then remembered         |

## Algorithm

1. Derive the applicable set by matching the file's context against each reference's `applicability`.
2. Order by each reference's declared `priority` (lower is preferred). Framework-specific outranks generic. The ordering is data in the references, never prose here, so adding a mechanism cannot require editing this rule.
3. The winner is the first remaining. Then check that winner's **prerequisites** (below) and apply the stop conditions — including `inapplicable: ask` — **before** writing.
4. If no stop fired: **apply the winner** — that reference's file is what writes the records (companion + one-liners when `companion: yes`; inline when it cannot) — **and say in one line which and why**, plus which prefs layer supplied each key that is not the announced default. Do not stop. Do not write a call from `SKILL.md`.
5. Afterwards, if the set had more than one candidate and no preference is recorded, **offer** to remember it — after the edit, so the user judges a real diff rather than a hypothetical. This skill's keys are team keys: write `.agents/_team/skills/x-log-analytics-editor/` after an explicit yes, never `.agents/_local/`.

`companion`, `inapplicable`, `reachesAppStream` and both prerequisite lists are declared in each reference's frontmatter and body. Read them there; this file does not restate a reference's values — which is why none of them appears as a column in the index below, and why a rule here cites the field rather than copying what it says.

## Prerequisites gate the winner, and they are not all the same

Each reference declares two lists. They behave differently, and collapsing them is how a run either stops when it should not or writes code that silently records nothing.

| Kind             | Is                                                          | Unmet →                                                                                       |
| ---------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Compile-time** | a package or lib that must be present and importable         | **the mechanism does not apply.** Drop it from the set and re-run step 2. Never add the dependency. |
| **Runtime**      | initialization, consent, or vendor-console configuration     | **apply anyway, and report it.** The call sites are correct; say plainly they record nothing until it is done. |

A compile-time prerequisite is part of `applicability`, which is why an unmet one removes the mechanism rather than stopping the run — the remaining candidates and the `inapplicable: ask` stop then decide what happens, exactly as if the mechanism had never fit the file.

A runtime prerequisite never blocks. Silence about one is the failure: the edit looks complete, the build passes, and no data arrives.

## Stop conditions

Stop only when:

- priorities genuinely tie
- a recorded preference names a mechanism that cannot apply to this file
- the user asked to choose
- the applicable set is empty
- **`inapplicable: ask`** — a catalogued mechanism declares `inapplicable: ask`, is not in the applicable set, and its `priority` is lower (preferred) than the winner's. Ask: this file cannot use that mechanism (say why). Apply the remaining winner anyway, or skip? **Recommended: skip (no new events).** Apply the remaining winner only on an explicit yes.

  Do not fire this stop when: the `inapplicable: ask` mechanism **is** in the applicable set (it won or lost on priority, no question); or the user already asked for the remaining winner.

  **A recorded `mechanism` pref does not suppress this stop.** That pref reorders mechanisms that _can_ apply; it says nothing about one that cannot, and letting it answer here would be the remembered "always use the leftover" that the methodology rules out. A workspace where the preferred mechanism will never apply asks every time, by design — the fix is to remove that mechanism from the catalog, not to pin past it.

  Several named files that all miss the same preferred mechanism → one ask, listing each file and why. They may still say yes for a subset.

  A recorded preference that names the `inapplicable: ask` mechanism when that mechanism cannot apply is the same question, not a second one. Recommended: skip.

Stopping to confirm what was already derived correctly trains the reader to stop reading the question. But note the asymmetry with diagnostic logging: a wrong automatic pick here is **not** cheap, because the events it writes are permanent. That is why the preferred mechanism declares `inapplicable: ask` rather than falling through silently.

## Index

| Mechanism              | Reference file                                                     | Use when                                                                                                              | Cannot be used when                                                                                                                                    | Priority |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `ng-tracking-v1`       | [mechanisms/ng-tracking-v1.md](mechanisms/ng-tracking-v1.md)       | an Angular inject context, in a workspace that has the tracking-facade util, that can import that package               | the facade is not in this workspace; no inject context; importing it would be a cycle or a module-boundary violation; a file that is not TypeScript or JavaScript | 10       |
| `js-firebase-analytics` | [mechanisms/js-firebase-analytics.md](mechanisms/js-firebase-analytics.md) | any TS/JS context with the `firebase` package installed and an initialized Firebase app available to the target | `firebase` is not installed; no initialized app the target can reach; a file that is not TypeScript or JavaScript                                       | 100      |

## Preference

Resolve **per key**. First match wins:

1. This run's explicit instruction.
2. `.agents/_team/skills/x-log-analytics-editor/prefs.json` (committed).
3. `.agents/_local/skills/x-log-analytics-editor/prefs.json` (gitignored).
4. Announced defaults below and in each mechanism reference.

A key present on the team file wins over local, even when the team value equals the announced default. A key omitted from the team file can still come from local. A missing file is not a layer. A `version` mismatch on **one** file (older, missing, or newer than the example below) means treat that file as absent for this run: announced defaults for its keys, and offer to rewrite it to match the example.

Announce in one line which layer supplied each key that is not the announced default (`team`, `local`, or this run).

Skill-wide keys live at the top level; each mechanism's own keys live under `mechanisms.<name>`. Adding a mechanism is a new object in that map, not a new top-level key.

**The standard context parameters are skill-wide, not per-mechanism.** _Whether_ an event carries `class`, `route` or `lib_name` is a property of the record shape, which every mechanism sends identically. _How_ each value is obtained differs per mechanism, and that belongs in the reference.

| Key                | Where                        | Announced default                                                                            |
| ------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `version`          | top-level integer            | current shape is `1` — compare against the example below, not the skill's `1.1.0`             |
| `mechanism`        | top-level string             | derived by the algorithm — set it **only** to override the `priority` order among mechanisms that _can_ apply, which is why the example below omits it |
| `contextClass`     | top-level boolean            | `true` — attach the emitting class as `class`                                                |
| `contextRoute`     | top-level boolean            | `true` — attach the active route path as `route`                                             |
| `contextLibName`   | top-level boolean            | `false` — attach the Nx project name as `lib_name`                                           |
| `mechanisms`       | map of per-mechanism objects | `{}` — each reference's own announced defaults apply                                         |

**Each context parameter turned on costs a permanent custom-dimension slot**, of which a standard property has 50, allocated non-retroactively. That is why two are on and one is off, and why turning one on is a decision rather than a convenience.

**What `version` is for.** The example JSON below is the current shape of this file; its `"version"` is that shape's number. Compare each file's `"version"` to the example's separately. It is not the skill's `metadata.version`.

```json
{
  "version": 1,
  "contextClass": true,
  "contextRoute": true,
  "contextLibName": false,
  "mechanisms": {
    "ng-tracking-v1": {},
    "js-firebase-analytics": {}
  }
}
```

A stored `mechanism` that remains in the applicable set is the winner; if it cannot apply, that is a stop condition, not a silent fallback. A missing `mechanisms.<name>` object, or a missing key inside it, uses that mechanism's announced defaults; do not fail the run. Unknown keys on a sibling mechanism are ignored.

**All keys this skill stores are team keys** — they change the companion or the record shape, and the records are permanent. After an explicit yes, write `.agents/_team/skills/x-log-analytics-editor/` (create the parent if needed; it is a git change). Never write them to `.agents/_local/`. If the team file already has that key, do not offer unless they ask to change the team default.

Both files are optional; the skill works fully with both absent. A stored value is a default this run's instruction overrides. Writing happens only after an explicit yes.

## Event registry

`.agents/_team/skills/x-log-analytics-editor/events.jsonl` — an append-only record of the event names this skill has added, so a later run can see the vocabulary this repo already sends instead of guessing at it.

**Optional.** The skill works fully without it. When it is absent, say so in the same line that announces the mechanism, and proceed.

Identity is the **(event name, lib)** pair — one row per lib that uses a name, so a name three libs send has three rows. Same identity in both homes → team wins. Identity only in local → local stands until promoted. Missing team file → treat as empty team; local entries still apply.

**A name's current state is the union of its rows.** Look a name up by the name alone: its parameters are every `params` value across its rows, its libs every `lib`. Append a row when a name is first added, when another lib starts sending it, and when a lib extends what it sends — never rewrite or delete one, which is the whole point of append-only. **Several rows for one name are normal, not a duplicate.**

Consult it before writing a name, for three things no other source answers:

- **A near-duplicate.** An existing `select_content` makes a new `content_selected` a metric split in two.
- **The vocabulary in use.** The only local view of what this repo already sends, which is what keeps naming consistent across libs.
- **The count, when the chosen mechanism _can_ reach a native data stream** — its frontmatter says so as `reachesAppStream`. Do not work it out from which apps consume the lib, which is not knowable here and is several apps at once for a shared one. **Count only the rows whose `mechanism` declares `reachesAppStream: yes`** — a name written through a web-only mechanism never touches an app stream, and including it inflates the very number the cap is judged against. Report it in the same line that announces the mechanism. If it is at or past that stream's event-name cap, **say so and name the consolidation candidates** — then carry on if the events are still wanted. **Do not refuse on this signal.** The count is repo-wide while the cap is per property and per device, so a repo of 900 names may be nowhere near any real limit; only someone who knows which apps report to which property can judge that. Blocking instrumentation the product needs, on a proxy that cannot see the actual counter, is the worse error.

**Read that count as a floor, not a measurement.** Even filtered, the registry holds only what this skill recorded, so the real vocabulary reaching that stream is at least that large and may be larger. No device's own counter is visible from here at all — that is observed in the vendor's console. Never report the registry count as how full a cap is.

**A long file is not a problem; a wide vocabulary is.** In a monorepo this grows a row per lib per name, so it gets long — and that is the healthy direction: many rows sharing **one** name is reuse working exactly as intended. The number to watch is **distinct names**, not rows. Do not prune old rows, compact the file, or split it to keep it small: every one of those destroys the repo-wide view that is the registry's only job, and none of them reduces the thing that actually costs anything.

**One registry for the repo, including a monorepo of several apps.** Naming consistency has to hold repo-wide, because a shared lib's event reaches every app that consumes it and the same name must mean the same thing in all of them. So do not split the file per app, and **do not ask which app an event belongs to** — `lib` already answers it: a shared lib serves all its consumers, and an app-specific lib carries its app in its project name wherever the repo names them that way. Where apps report to different analytics properties, the count — even filtered by mechanism — still spans all of them, so it over-estimates any single property's usage; that errs toward caution, which is the direction to err.

One JSON object per line. `version` sits on each entry, so a format change is visible per row rather than invalidating the file:

```json
{ "version": 1, "event": "select_content", "params": ["content_type", "item_id"], "lib": "shared-feature-ng-x-users", "mechanism": "ng-tracking-v1", "source": "PRD AC-03" }
{ "version": 1, "event": "select_content", "params": ["content_type", "item_id"], "lib": "shared-feature-ng-advisory-card", "mechanism": "ng-tracking-v1", "source": "confirmed in-session" }
```

Two rows, one name: a second lib adopted `select_content` and — correctly — sends the **same field names** with different values. So one pair of custom-dimension registrations serves both libs and a report can group across them, where four differently-named fields would have cost four registrations to say the same two things twice.

`mechanism` records which one wrote the row, so a later run can count only the names that can reach the stream it cares about. One name can appear under two mechanisms if two libs send it differently; the union rule already covers that, and the cap count simply filters.

`source` records what authorized the event — the event-source ladder's rule 1, 2 or 3. An entry whose `source` is a confirmation rather than a document says so, which is what lets a later reviewer tell a planned event from an improvised one.

Writing an entry is a team change and follows the same explicit-yes rule as `prefs.json`. Never record a parameter's **values** here — only its name.
