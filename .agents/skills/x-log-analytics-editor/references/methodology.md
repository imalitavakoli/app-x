# Analytics methodology — the reasoning behind the rules

**Explains:** `x-log-analytics-editor` v1.0.0
**Load this when:** someone questions a rule, wants to change one, or is adding a new one.

This file changes no decision. It exists so the rules are not relitigated from scratch, and so a
reviewer can check the reasoning. The recommendations live in `SKILL.md`. How they are realized
lives in the chosen mechanism reference.

## Why permanence is the organising idea

Every distinctive rule here descends from one asymmetry with diagnostic logging: a log is written to
be deleted, and an event cannot be. A property holds a fixed ceiling of distinct event names, they
are not released when you stop sending one, history cannot be rewritten, and individual events
cannot be deleted after the fact.

So the cost of a diagnostic log is noise a developer can prune, while the cost of an event is a
permanent entry in a shared, budgeted, externally-governed namespace. Rules that would be pedantic
for logs — confirm the name before writing it, never mint a name that carries a variable, refuse a
throwaway — are proportionate here for that reason alone.

## Why there is no investigation mode

The sibling discipline for diagnostic logs has two modes, one of them temporary and marked for
complete removal. Analytics has one mode, and a request for a temporary event is refused.

A marker can remove a call site. It cannot remove the rows already sent, free the name, or repair
the reports. So the removal pass that makes a temporary diagnostic log safe has no analogue: the
thing that would need removing is not in the repository.

Baseline testing is what settled this. Given an urgent request for throwaway instrumentation, an
agent with no guidance added nine temporary events, wrapped them in `// TEMP INSTRUMENTATION`
markers, and cited the name ceiling in the same response — while spending nine names against it. It
had the constraint and did not connect it to the request. That is why the rule is a prohibition with
its reason attached, rather than a note about permanence that a deadline can outweigh.

## Why the name carries no variable

Encoding the lib, component or item in the event name mints one permanent name per value. Two costs
follow, and the second is the one people miss: the budget drains in proportion to the codebase, and
the action becomes uncountable — "how many cards were opened" requires pattern-matching over event
names rather than grouping by a dimension.

The workspace's previous convention did exactly this, and it is why the corrected rule puts the lib
in a parameter. The vendor's own guidance says the same, and its SDK reinforces it by type-checking
the parameters of recommended names and nothing else.

## Why recommended events are preferred over accurate custom ones

A custom name is often the more precise description. It is still usually the wrong choice, because
a recommended name populates standard reports with no further work while a custom one appears only
in explorations somebody has to build and maintain. Precision that nobody can see loses to a
slightly looser name that lands in a report the team already reads.

## Why placement is a convention and not a lint rule

Events belong in the layer that knows what an interaction means. In this workspace the module
boundaries **permit** a presentational lib to import the tracking facade, so nothing mechanical
stops an event being added there. The rule is the only thing that does, which is precisely why it
must be stated rather than assumed — a convention with a lint rule behind it can be left implicit;
one without cannot.

The industry pattern says the same thing in different words: the view captures intent, the layer
above assigns meaning, and a dedicated service translates. The failure it prevents is double
counting, since a reusable presentational component and its host would each log the same
interaction.

## Why widening a UI contract for analytics is out of scope

Baseline testing produced this one. An agent correctly refused to log inside a presentational lib —
and then added a new output to that lib's public API so the layer above could log it. The rule was
honoured and its purpose defeated: a shared contract changed to serve an instrumentation need.

The general form is the editor boundary. Deciding *what the product exposes* is design work; this
skill owns the shape of the change once the requirement exists. If the signal is not already
exposed, the edit stops.

## Why parameter conventions are stated at all

They look like style. They are not, because a dashboard cannot join `usersCount` to `users_count`,
and a metric split across two spellings undercounts in both.

Three unguided runs of the same task produced three different answers for parameter casing, three
different boolean encodings, and two different treatments of an absent value. None was unreasonable
in isolation. The variance is the defect: consistency is the only property that makes an event
worth anything, and it is the one property no individual call site can achieve on its own.

Absent values get a rule of their own because a sentinel — `-1`, `'unknown'` — is a value the
dashboard cannot distinguish from data, whereas an omitted parameter is already unambiguous.

## Why the records live in a companion

Inline calls dirty the named file with one vendor's API, exactly as they do for diagnostic logs. The
companion buys something further here: because the vendor's event name and the developer's method
name are deliberately different, the companion is the only place both appear together, which makes
a file's event list readable as a tracking plan by someone who does not read the implementation.

It also makes the standard context parameters structural. They are merged in one private hop, so a
call site cannot omit them and cannot spell them differently.

Two unguided runs independently invented a fragment of this — a private helper returning the shared
context parameters — which suggests the pull toward centralising is real and the companion simply
does it completely.

## Why the standard context set is small

Each context parameter attached to every event permanently consumes one custom-dimension slot, of a
fixed per-property allocation, applied non-retroactively. Two are on by default and one is off for
that reason. The temptation is to attach everything that might be useful later; the allocation makes
that a decision with a cost rather than a free convenience.

The emitting class is preferred over the owning lib by default because one lib routinely holds
several components, so the class is the finer of the two axes. The trade is that class names are
refactor-volatile and old values strand in history, which is why the owning lib remains available as
a preference rather than being removed.

## Why a preferred mechanism that cannot apply is not a silent fallback

The facade mechanism keeps every sink behind an initialization flag the app controls, routes to the
right SDK per platform, and carries the user identifier and build properties. Going direct to the
vendor SDK has none of that, and its initialization begins collection in a way that cannot be
undone after the fact. Falling through silently would therefore ship a materially different product
than the catalog preferred. The ask, with skip as the recommendation, is how a team can choose "do
not log".

Do not add a library or dependency to make a mechanism apply. A preference that remembered "always
use the leftover" would recreate the silent path; the ask is the rule, not a key.

## Why the decision half is split from the mechanics half

Judgement changes rarely. A vendor's API changes on its own schedule. Splitting them means a new
mechanism is a new file, not a rewrite.

The skill owns meaning and recommendations: what an event is, where it may be placed, what shape it
takes, and that records live in a companion. The reference owns how those are realized — what it
imports, what it can and cannot guarantee, and what it does when it cannot.

## Sources

Vendor rules — names, parameters, limits, recommended events and the automatic ones — come from the
platform's own documentation: [logging events](https://firebase.google.com/docs/analytics/ios/events),
[about events](https://support.google.com/firebase/answer/6317522),
[automatically collected events](https://support.google.com/firebase/answer/7061705), and the
[GA4 events reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events).

Naming and taxonomy practice, including why a variable in an event name rots a dataset:
[event naming considerations](https://www.bounteous.com/insights/2021/01/28/event-naming-considerations-google-analytics-4-properties/),
[an event taxonomy that won't rot](https://www.digitalapplied.com/blog/product-analytics-event-taxonomy-tracking-plan-2026),
and [evolving analytics tracking](https://amplitude.com/blog/analytics-tracking-practices).

Layering — intent at the view, meaning above it, translation in a dedicated service:
[architecting an analytics layer](https://medium.com/ios-os-x-development/architecting-an-analytics-layer-7cdacb5f74af)
and [UI events](https://developer.android.com/topic/architecture/ui-layer/events).

The behaviour that initialization cannot be un-started was read from the SDK's own source rather
than its documentation, which does not say so.
