Copy this file into `references/mechanisms/`, fill it, and add a row to `references/README.md`.

`inapplicable: ask` — when this mechanism does not apply and a worse-priority (higher number) mechanism would win, the index stops and asks; recommended answer is skip (no new logs). Omit the field to let remaining mechanisms apply silently. The index owns the stop; this file only declares the field.

---

applicability: <which contexts this mechanism can serve>
priority: <integer; a framework-specific mechanism outranks a generic one, and lower means preferred>
modes: <standing, investigation, or both>
companion: <yes | no>
inapplicable: <omit this field | ask>

---

## Companion

If `yes`: naming (beside the target, `.log-diag` before the extension), construct, how the named file initializes it, how one-liners map to operations. If `no`: the ceiling in one line, and that this reference writes records the way it can (inline).

## Import and injection

How the named file obtains this mechanism — import, construct, inject — or that it needs none.

## Preference keys

Which keys this mechanism reads under `prefs.json` → `mechanisms.<this-name>`. Announced default per key when the object or key is absent. If this mechanism has none, say so in one line. A verbatim fragment (a custom guard expression) is a sibling file named from this object, not a JSON string; it has no `version` of its own — a format change bumps `prefs.json`'s `version`.

## Call shape

How source / event key / attributes map onto this mechanism's actual API (and onto companion operations when `companion: yes`).

## The four levels

Map `DEBUG`, `INFO`, `WARN`, and `ERROR` onto this mechanism's methods or parameters.

## Honoring developer-only vs always-on intent

Which levels run only in development, which also run in production, how (a guard, a min-level, not at all), and what this mechanism does when it cannot keep a level out of production.

## Investigation marker

The source-level mark (or equivalent) that makes removal one complete pass; required if `modes` lists `investigation`; with a companion, state that removal touches both files.

## Where the data goes

Console only? Retained? Exportable? Remote?

## Contexts this mechanism cannot serve

The contexts this mechanism cannot serve. If `inapplicable: ask`, do not restate the index stop here beyond one pointer.

## Worked before/after

One invented example; when `companion: yes` show both files; demonstrate an I/O boundary as start / success / failure, and an attribute naming specific fields rather than passing a whole value. If this mechanism can keep developer-only records out of production, show that on start/success and a `WARN` or `ERROR` on the error edge that also runs in production. If it cannot, state that ceiling in **Honoring developer-only vs always-on intent** and do not fake a gate in the example.

## Already done?

This reference's recognition rule for an existing record of the same event at the same site.
