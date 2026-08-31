# Logging methodology — the reasoning behind the rules

**Explains:** `x-log-diag-editor` v1.10.0
**Load this when:** someone questions a rule, wants to change one, or is adding a new one.

This file changes no decision. It exists so the rules are not relitigated from scratch, and so a
reviewer can check the reasoning. The recommendations live in `SKILL.md`. How they are realized
lives in the chosen mechanism reference.

## Four levels rather than six or eight

Widely used ladders carry six or eight levels. Some of those rungs exist so a server can page an
on-call engineer. Nothing pages anyone from a user's browser tab. An unrecoverable failure here is
an error plus an error boundary. A level that no mechanism can express is a level every reference
would have to fake.

## Why the records exist at all

A log exists so a later reader can reconstruct a run without re-running the code. That reader is
increasingly an agent, not a person.

## Why sparse beats complete

Evidence works by contrast. When every line announces itself, nothing stands out. Completeness
destroys the property the records existed for.

## Why the decision half is split from the mechanics half

Judgement changes rarely. A mechanism's API changes on its own schedule. Splitting them means a new
mechanism is a new file, not a rewrite.

The skill owns meaning and recommendations: what the levels mean, what the modes mean, whether a
site deserves a log, and that records live in a companion beside the target.

The reference owns how those recommendations are realized from that mechanism's capabilities.
Can it gate, serve this mode, isolate in a companion? What does it build, how does it mark a
temporary record, and what does it do when it cannot?

Putting the how in the skill forces every new mechanism to lie about what it can do, or to rewrite
the rules.

## Why a preferred mechanism that cannot apply is not a silent fallback

A mechanism that declares `inapplicable: ask` is preferred over whatever remains (lower
`priority` number). When it cannot apply, using the leftover mechanism without asking is a
different product than the one the catalog preferred. Asking, with skip as the recommendation,
is how the team can choose "do not log". Do not add a library or dependency to make that
mechanism apply. A pref that remembered "always use the leftover" would recreate the silent
path; the ask is the rule, not a key. Which leftover exists, and why the preferred one cannot
apply, are facts in the references — not this file.

## Why records live in a companion

Inline mechanism calls dirty the named file, in both modes. The dirt is specific to one API. A
companion keeps the named file to one-liners, so swapping a mechanism later changes the companion
rather than every call site.

The skill states the pattern: beside the target, named from it. It does not name a class or a file
extension. Those are facts about one language.

## Why logs are placed by hand rather than instrumented automatically

Automatic instrumentation records everything from one place. That is the right tool for tracing
everything. It is the wrong tool when the value is judgement about which few places matter. Both
remain available. This skill is the selective one.

## Why showing how to call a logger is not enough

A guide that demonstrates an API without saying when to call it teaches the API and not the
restraint. The result is pollution. The restraint is the whole contribution.

## Why event keys are identifiers

A companion's one-liner is a method. The event key is that method's name. A slash is not a legal
identifier, so `fetchCards/failed` cannot be the method. Sub-steps belong in the name
(`loadItemsFailed`) or in attributes (`reason`), not as punctuation in the key. A shape the
companion cannot spell is a shape every `companion: yes` reference would have to lie about.

## Why coverage never removes a boundary log

A test asks whether the code does the right thing for inputs you choose. A log asks what actually
happened in this run, with the real state. Coverage of a boundary never answers the second question,
so it never removes that log. The canonical wording is in `SKILL.md`; this file does not repeat it.

## Sources

The ladders were narrowed from [a vendor-neutral telemetry data model](https://opentelemetry.io/docs/specs/otel/logs/data-model/)
and [a major cloud provider's severity list](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogSeverity).

[A large engineering organisation's frontend logging guide](https://docs.gitlab.com/development/fe_guide/logging/)
is why we log the unexpected, not the expected.

[A security guidance cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
is the never-record list and log injection.
