Copy this file into `references/mechanisms/`, fill it, and add a row to `references/README.md`.

---

applicability: <which contexts this mechanism can serve>
priority: <integer; a framework-specific mechanism outranks a generic one, and lower means preferred>
modes: <standing, investigation, or both>
companion: <yes | no>

---

## Companion

If `yes`: naming (beside the target, `.log-diag` before the extension), construct, how the named file initializes it, how one-liners map to operations. If `no`: the ceiling in one line, and that this reference writes records the way it can (inline).

## Import and injection

How the named file obtains this mechanism — import, construct, inject — or that it needs none.

## Preference keys

Which keys this mechanism reads under `prefs.json` → `mechanisms.<this-name>`. Announced default per key when the object or key is absent. If this mechanism has none, say so in one line. A verbatim fragment (a custom guard expression) is a sibling file named from this object, not a JSON string.

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

The contexts this mechanism cannot serve.

## Worked before/after

One invented example; when `companion: yes` show both files; demonstrate all four of: an I/O boundary as start / success / failure, a developer-level record that runs only in development, a `WARN` or `ERROR` on an error edge that also runs in production, and an attribute naming specific fields rather than passing a whole value.

## Already done?

This reference's recognition rule for an existing record of the same event at the same site.
