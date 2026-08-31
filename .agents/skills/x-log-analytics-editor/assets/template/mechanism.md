Copy this file into `references/mechanisms/`, fill it, and add a row to `references/README.md`.

`inapplicable: ask` — when this mechanism does not apply and a worse-priority (higher number) mechanism would win, the index stops and asks; recommended answer is skip (no new events). Omit the field to let remaining mechanisms apply silently. The index owns the stop; this file only declares the field. Declare it for any mechanism whose absence would materially change what is sent — a different sink, a lost consent gate, a lost platform route.

There is no `modes` field. Analytics has one mode; a mechanism has nothing to declare about it.

---

applicability: <which contexts this mechanism can serve, including its compile-time prerequisites>
priority: <integer; a framework-specific mechanism outranks a generic one, and lower means preferred>
companion: <yes | no>
inapplicable: <omit this field | ask>

---

## Companion

If `yes`: naming (beside the target, `.log-analytics` before the extension), construct, how the named file initializes it, how one-liners map to methods. State that the method name is the developer's word and the event name is the vendor's, and that this file is where both appear together. If `no`: the ceiling in one line, and that this reference writes records the way it can (inline).

## Import and injection

How the named file obtains this mechanism — import, construct, inject — or that it needs none.

## Prerequisites

Two lists, because the index treats them differently.

**Compile-time** — a package or lib that must be present and importable. Unmet means this mechanism **does not apply** and drops out of the set. Say explicitly that the dependency is never to be added to make it apply.

**Runtime** — initialization, consent, or vendor-console configuration the app owns. Unmet means **apply anyway and report**. Name the file or layer that would own each, so the report is actionable. If this mechanism silently no-ops when a runtime prerequisite is unmet, say so in those words — an edit that looks complete and records nothing is the failure this section exists to prevent.

## Preference keys

Which keys this mechanism reads under `prefs.json` → `mechanisms.<this-name>`. Announced default per key when the object or key is absent. If this mechanism has none, say so in one line.

Do not redeclare the standard context parameters here — they are skill-wide keys. This section covers only how their values are **obtained** in this mechanism.

## Call shape

How the event name and parameters map onto this mechanism's actual API, and how the private `log` hop merges the standard context parameters so no call site can omit them.

Then a table: for each of `class`, `route` and `lib_name`, where this mechanism gets the value. `route` must state how the query string and fragment are stripped — an unstripped route is the standard way user content leaks into an analytics property.

## Reserved names

Any name this mechanism or its surrounding wiring already occupies, beyond the vendor's reserved prefixes — an identifier set app-wide, a user property already populated. An event parameter colliding with one of these is conflated with it in every report.

## Where the data goes

Which property, and which **other** sinks the same call reaches. A mechanism that fans out to more than one destination must say so: an event name chosen for a dashboard may also land somewhere with its own semantics.

## Screen views

Whether this mechanism emits them automatically, and what it does not cover. Never instruct hand-logging them.

## Contexts this mechanism cannot serve

The contexts this mechanism cannot serve. Distinguish a context it *cannot* serve from one the placement rules forbid — the second is not an applicability fact. If `inapplicable: ask`, do not restate the index stop here beyond one pointer.

## Worked before/after

One invented example; show both files when `companion: yes`. Demonstrate a recommended event name with a parameter carrying the variable that a lib-prefixed name would have encoded, and an absent value handled by omission rather than a sentinel. Name what is deliberately **not** in the example — the prefix, the sentinel, the render-time event — since the absences are as instructive as the content.

## Already done?

This reference's recognition rule. It must match on **both** the companion method name and the event name sent, and say what to do with an existing inline call at the same site.
