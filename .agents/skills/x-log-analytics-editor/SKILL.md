---
name: x-log-analytics-editor
description: 'WHAT? The rule for which call sites deserve an analytics event, and the edit that adds or corrects them in named files. WHEN? Asked to add, audit or correct analytics, tracking, product-event or Firebase/GA4 event logging in components, services or plain TS/JS; deciding whether an interaction deserves an event, what to name it, what to send as parameters, or which analytics mechanism to use. Not for diagnostic logging a developer reads while debugging.'
metadata:
  kind: editor
  version: '1.2.0'
---

# Log Analytics Editor

## Overview

This skill specifies terms, context and methodology for analytics events in files the user named. The agent reading this makes the edit.

This file supplies the recommendations: whether an interaction deserves an event, what the event is named, what it carries, and that records live in a companion beside the target. The chosen mechanism reference supplies the edit — how those recommendations are realized from that mechanism's capabilities.

**No script writes records**, because the right call site is a judgement — which is why the _Already done?_ rule below is written out rather than delegated to a transform. One script does ship and it only reads: `scripts/render-registry.mjs` prints the event registry grouped by event name, for a person to audit.

**"analytics"** names the audience — a product owner reading a dashboard weeks later — not one vendor. Firebase and GA4 supply the constraints because they are what this workspace sends to; the methodology is not specific to them.

## Invoker & moment

**Shape: in-session primary, document secondary.**

In-session because the agent asked for analytics can invoke this skill from its own `description` — bound to adding, auditing or correcting product-event logging, and not to diagnostic logging.

Document as well, because an isolated execution agent reads files and never invokes skills. This skill's repo-relative path is `.agents/skills/x-log-analytics-editor/SKILL.md` — whatever carries it copies something that resolves.

## Why these events exist

> **A diagnostic log and an analytics event answer different questions.** A log asks _what happened in
> this run?_ and is read by a developer, now, then discarded. An event asks _what do people do, in
> aggregate, over months?_ and is read by someone who was not there, from a dashboard, long after the
> code changed. That is why the two are never the same call, and why an event's name outlives the
> component that emits it.

Three consequences, and every rule below descends from them:

- **What you send cannot be taken back.** Past data cannot be edited or renamed, and the only deletion on offer is a blunt request that removes everything for a period — never a way to correct one event. So a badly named event is wrong in the reports for as long as those reports go back, and renaming it later splits the metric into a before and an after rather than fixing it.
- **On native, event names are capped.** An **app** data stream allows **500 distinct event names per app user**; **web data streams have no such limit**. Automatically collected and enhanced-measurement events do not count, and the allowance cannot be archived or reclaimed. So the cap binds only where a native SDK sends — and **this skill cannot tell which apps host the file it is editing.** A shared lib is consumed by several apps at once, commonly a web one and a native one, so the answer is often "both". Do not try to derive it from the consumer graph. **Assume the cap applies whenever the chosen mechanism _can_ reach a native stream**; each mechanism reference declares whether it can, because that is a fact about the mechanism rather than about the lib.
- **Sending a parameter is not the same as seeing it.** A custom parameter is collected but shows up in **no report** until somebody opens the analytics console and registers it as a custom dimension. Registration is **not retroactive**: everything sent before it reads as `(not set)` forever, and it takes 24–48 hours to start populating after. Registrations are capped at **50 event-scoped per property**. So each parameter costs a slot, a manual step, and a delay.
- **Consistency is the whole value.** Two spellings of one action are two metrics that each undercount. Unlike a log, an event is only worth anything when every other event agrees with it.

## What decides an event exists

**Not this skill.** An analytics event is a product decision with a permanent cost, so its existence and its name come from outside. Resolve the event source in this order, first match wins:

1. **This run's instruction** names the events.
2. **An event-source document** for the target's feature, if this repo has one — a tracking plan, a product spec with acceptance criteria, an issue. _In this workspace: `docs/x/{domain}/{name}/PRD/README.md`'s ACs, when the target belongs to a functionality that has one. There may be none; that is normal, not an error._
3. **Neither** → derive candidates from the methodology below and **present them for confirmation before writing** — name, parameters, and call site, in one list. One confirmation covers the whole set.

Rule 3 is not a formality. Every other edit this skill makes is reversible; a name is not.

## Decision order

Apply these three steps first, per candidate call site:

1. Would someone outside the codebase ask this question of a dashboard? **No** → no event, stop.
2. **Yes** → is the answer already available from an automatically collected event, or from a parameter on an event you are already sending? **Yes** → no new event; add the parameter or use what exists.
3. Only then does a new event become a candidate, and it is named per _The record shape_.

Step 2 is the one that gets skipped. A new event name is the most expensive way to answer a question and it is the first thing reached for.

## Where to log

Events belong where the interaction has **business meaning**, which is one specific layer:

| Layer                                                   | Events? | Because                                                                                          |
| ------------------------------------------------------- | :-----: | ------------------------------------------------------------------------------------------------ |
| `feature`, `page`                                       |   ✅    | it knows what the interaction _means_ — this is the only layer that logs                         |
| `ui`                                                    |   ❌    | it is reusable and context-free; an event here cannot say which feature it belongs to            |
| `util`, `map`, `api`, `data-access`                     |   ❌    | no user intent passes through them; a formatter has nothing a dashboard would ask about          |
| `app`                                                   |   ➖    | initialization and consent wiring only, never feature events                                     |

**A `ui` lib may technically import the tracking mechanism — module boundaries permit it.** Nothing mechanical stops this; the rule is the only thing that does. A `ui` component emits its output, and the `feature` that hosts it logs the event.

**If the signal is not already exposed, stop.** Adding an output, an event emitter, or any change to a `ui` lib's public API so that analytics can observe it is a design change to a shared contract, not this edit. Report what is missing and hand it back.

## Where not to log

| Do not log                                       | Because                                                                                        |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| a screen-view or page-view event                 | the platform collects one automatically — and where a mechanism does not cover route changes, adding that is app wiring, not a call-site edit. Either way a hand-written one double-counts or lands in the wrong place |
| both a `ui` output handler and its `feature` host | one interaction, two events, every metric doubled                                              |
| render, change-detection and lifecycle hooks     | they re-run on input changes, so counts inflate and stop being a usable denominator            |
| loops and per-row impressions                    | the same name fired per rendered row floods the dataset and buries the interaction that mattered  |
| a technical failure a user never perceives       | that is a diagnostic record for a developer, not a product metric                              |
| anything a parameter on an existing event answers | a custom name answers it only in a report somebody must build first; a parameter answers it in the one they already read  |

## The record shape

An event **is** these two parts. Produce them; there is nothing else to decide.

**1 — the name.** One of the vendor's **recommended event names** when one fits the action (`login`, `sign_up`, `search`, `share`, `select_content`, `view_item`, `purchase`, …). Only when none fits, a custom name: `snake_case`, a verb phrase describing the action that already happened, ≤40 characters, starting with a letter, letters/digits/underscore only.

Recommended names are preferred because sending one **with its prescribed parameters** populates the platform's built-in reports and dimensions on its own. A custom name is still counted in the events list, but any breakdown of it has to be built by hand from parameters you registered yourself.

**The name never carries a variable.** Not the lib, not the component, not the item, not the plan. Those are parameters. A name that varies mints one name per value and makes the action uncountable across the app.

**Reuse a name for the same action, not to economise.** The same recommended name across several features, distinguished by a parameter, is the intended pattern — `select_content` everywhere, with `content_type` saying which. Collapsing genuinely different actions under one name is the opposite mistake to inventing one per item, and costs just as much: the actions can no longer be reported, compared or marked as key events separately.

**2 — the parameters.** `snake_case`. Named fields only. **25 parameters per logged event** — each call is capped on its own, and nothing accumulates across call sites. Parameter names at most **40 characters**, string values at most **100**. Exceed any of these and the platform drops the offending part rather than the event: surplus parameters go, the event still arrives, and a `firebase_error` parameter is attached saying which rule was broken.

| Rule                                                 | Do                                          | Not                                     |
| ---------------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| Casing                                                | `users_count`                               | `usersCount`, `UsersCount`              |
| A value that is absent                                | omit the parameter                          | `-1`, `''`, `'none'`, `'unknown'`       |
| A true/false flag                                     | the number `1` or `0`                       | a real boolean — only string and number are supported types, and a boolean is coerced |
| A whole object, response or error                     | name the two or three fields that matter    | the object, or its stringified form     |
| A reserved name                                       | `selected_user_id`                          | `user_id` — a user-scoped **setting**, never an event parameter |
| A reserved prefix                                     | any other name                              | `firebase_*`, `google_*`, `ga_*`, `gtag.*`, `_*` |

**Each parameter earns its place, or it does not go.** Run decision-order step 1 again, per field: *would someone outside the codebase ask a question this field answers?* A field nobody asks for is not free — it permanently occupies one of the 50 custom-dimension registrations, and it is in history from the first send.

Three that routinely fail the test and are added anyway:

- **A label that duplicates an id.** If `item_list_id` already identifies the list, `item_list_name` answers nothing else. Send the id.
- **A field prescribed by the recommended event that this action has no use for.** Prescribed means "this is what to call it *if* you send it", never "send it".
- **A field derived from what the code happens to have to hand** — a count, a flag, a position — rather than from a question someone asked.

**When unsure, leave it out.** A parameter can be added later and will populate from that day forward; a parameter already sent cannot be un-sent, and the slot it took is not quickly returned. The asymmetry runs one way, so default to fewer.

**One name, one shape.** Every occurrence of an event carries the same **core** parameters: the ones that say which variant it is (`content_type` on a `select_content`) and any a report of it would group by. Optional extras may vary between occurrences; the core may not. A name whose payload changes run to run cannot be filtered or compared, so reusing a name is only safe when its shape comes with it. Where two call sites genuinely need different core fields, they are two actions and want two names.

**Vary values, not field names.** Reusing a name stays useful only when each site sends the *same* fields with different values — `select_content` carrying `content_type` and `item_id` everywhere, whatever the feature. Naming one idea differently per feature (`advice_id` here, `selected_user_id` there) splits what should have been one groupable dimension, and costs a second custom-dimension registration to report the same thing twice. A recommended name already prescribes its fields: use those. Before adding a field to a name that exists, read what that name already sends and match it.

**A constant discriminator is vocabulary, not data.** The literal that separates one use of a shared name from another — `content_type: 'advisory_card'` on a `select_content` — is fixed in the companion and never varies at run time. Treat it exactly as you treat a field name: check what the event already sends before inventing a variant, because `'x_user'` and `'x_users'` split one breakdown in two just as surely as two spellings of a field would. A **run-time** value is the opposite — an id, a count, anything a user supplied — and none of this applies to it.

**Standard context parameters** are attached to every event by the companion, so no call site can forget them and none of them appear at a call site. Which are attached is a preference (see the mechanism index); the announced defaults are:

| Parameter  | Default | Is                                                                       |
| ---------- | :-----: | ------------------------------------------------------------------------ |
| `class`    |   on    | the emitting class — named for the construct, not one framework's word for it |
| `route`    |   on    | the active route path, query and fragment stripped                       |
| `lib_name` |   off   | the Nx project name, for grouping by owning lib                          |

Each one switched on costs twice. It occupies one of the **25 parameters on every event** — two leaves 23 for real payload, which is rarely the binding constraint. And it permanently occupies one of the property's **50 event-scoped custom dimensions**, which usually is: freeing one means deleting it and waiting **48 hours** before another can be added. So two are on and the third is off; switching one on is a decision, not a convenience.

## When a limit would be hit

Every one of these limits fails the same way: the platform **discards the offending part and lets the event through**. The call succeeds, the build is clean, review sees nothing — and a field is missing months later in a dashboard. So they are checked here, before writing, not left to be discovered.

| If the edit would…                                                          | Then…                                                                                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| put **more than 25 parameters** on one event, context parameters included     | **do not write it.** Report which fields overflow and ask which to drop — left alone, the platform drops them for you and the event still looks successful |
| use an **event or parameter name over 40 characters**                         | shorten it before writing, and say what was changed and why                                                                  |
| send a **string value that can exceed 100 characters**                        | do not send that field. Send an identifier or a short code, and say what was substituted                                      |
| use a **reserved name or prefix**                                             | refuse that name and write a qualified one instead                                                                           |
| add a name where a **native stream is already at its event-name cap**         | report it and **propose the consolidation** — name which existing events could merge under one recommended name with a distinguishing parameter — then continue only if the events are still wanted |

Only the first and last are questions; the rest are corrections to make and mention. Nothing here is refused outright, because none of it means the instrumentation is wrong — only that this shape of it would lose data.

## Companion file

Recommend a companion beside the named file as the **default**. Same folder; named from the target by inserting `.log-analytics` before the extension. The companion owns the records; the named file only constructs it and calls one-liners. Do not offer companion vs inline as a preference.

**The companion is the file's tracking plan.** Because the event name is the vendor's and the method name is the developer's, the companion is the one place both are visible together — which is what makes the event list reviewable by whoever owns the metrics, and what keeps the standard context parameters in a single hop.

**Do not name a class** — a class is one language's construct; this file states the pattern only. Each reference declares `companion: yes` or `no` in frontmatter. If `yes`, it fills the companion. If `no`, it states that ceiling and writes the records the way it can. Creating the companion when absent is the edit's empty case; the named file must already exist.

## No temporary events

**There is no temporary analytics event. Refuse to add one.**

A request for throwaway instrumentation — "just for this investigation", "we will rip it out next week", "over-instrument, we can clean up later" — is refused, and the refusal is not softened by urgency, by a marker comment, or by a promise to remove it. There is nothing to remove: the rows are already in history, the only deletion on offer wipes everything for a period rather than those events, names are not freed, and the reports stay polluted long after the code is gone.

**No exceptions:**

- Not with a `// temporary` marker — a marker removes the call, never the data.
- Not "we will delete the events in the console" — names are not freed, and history is not rewritable.
- Not because the deadline is tomorrow.
- Not because the events are "only in development" — unless the mechanism can prove they never reach the property, which it must state.

**What to offer instead**, in this order: a diagnostic log, which is a developer-facing record designed to be deleted and is a different deliverable with its own rules; the vendor's debug view on an event you were going to ship anyway; or a session-replay / product-analytics tool if the team has one. Say which you are recommending and why the analytics property is the wrong sink.

An event worth keeping for one week is either worth keeping permanently — in which case add it properly, through _What decides an event exists_ — or it is a diagnostic log wearing the wrong clothes.

## Hard rules

Never send names, email addresses, phone numbers, user-typed text, precise location, government or payment identifiers, tokens, or anything a user opted out of. This is not only a data-hygiene rule: sending it violates the analytics vendor's terms and can have the property's data deleted or its access suspended, and events cannot be deleted individually after the fact.

Send an opaque identifier instead and join it outside the analytics property. **If PII has already been sent, that is not this edit's to fix silently — say so.** The platform offers a data-deletion request for exactly this, and using it beats waiting for automated detection, whose remedy is deleting every row for the period the PII appeared in. Never send a raw error string or an API response — both are unbounded and both routinely contain user content. Strip query strings and fragments from anything route-shaped before sending it.

## Anti-patterns

A variable encoded in the event name · a new name where a parameter would do · hand-logged screen views · the same interaction logged in a `ui` lib and its `feature` host · a sentinel like `-1` for a missing value · a whole response object as one parameter · events added to a `ui` lib · a `ui` lib's public API widened so analytics can observe it · per-row impression events · a temporary event · an event whose name nobody outside the codebase could interpret.

## Boundary — what is not this skill's

**Deciding that an event should exist** is product work and arrives here as an input (_What decides an event exists_). This skill owns the mechanical shape once the requirement exists.

**Initialization, consent and app wiring are not this edit.** Whether the mechanism has been prepared, and whether the user has consented, are its prerequisites — this skill reports them and never adds them. Registering parameters as custom dimensions happens in the vendor's console and is likewise reported, not done.

**Diagnostic logging** — a record a developer reads while debugging — is a separate deliverable with its own rules. Writing tests is likewise separate.

## Choosing the mechanism

Which mechanism applies, and how to pick among those that can, is in [references/README.md](references/README.md). Apply that rule; do not restate it here.

Load [references/methodology.md](references/methodology.md) when someone questions a rule, wants to change one, or is adding a new one. Mechanism references live in [references/mechanisms/](references/mechanisms/). The shape each one must take is [assets/template/mechanism.md](assets/template/mechanism.md).

These files live under `.agents/skills/x-log-analytics-editor/`. When handing this skill to an agent that cannot read it, give it that repo-relative path.

## Target & scope

Edit only the files the user named, and the companion beside them when the chosen mechanism uses one. Creating that companion when it is missing is part of this edit.

Skip: third-party / vendored code, test files (`*.spec.ts` and the like), and output from other generators (OpenAPI clients, protobuf stubs — not this skill's companion). Skip any file whose layer _Where to log_ excludes.

## Prerequisites

The named file must exist and be identifiable; more than one candidate → STOP and ask, do not pick one. The companion may be created.

The event source must be resolved per _What decides an event exists_ before any name is written.

**Each mechanism declares its own prerequisites, of two kinds.** The question that separates them: does it stop the code **existing**, or stop the data **arriving**?

- **Compile-time** — something the code needs to build at all: a package or lib it must import. Unmet → **that mechanism does not apply** and drops out of the candidate set; the remaining candidates and the index's stop conditions decide what happens next. Report it; never add the dependency to make a mechanism apply.
- **Runtime** — something that must be true while the app runs: initialization called, consent given, the vendor console configured. The code builds and ships either way. Unmet → **report it and continue**; the call sites are correct, they simply record nothing until someone does it.

## The edit

Do not write a call site, import, parameter map or class from this file. The sequence is: resolve the event source, apply the methodology above, choose the mechanism per `references/README.md`, then follow that reference's procedures (companion + one-liners when `companion: yes`). The worked before/after lives in the reference.

## Already done?

An existing event for the same action at the same call site is an update in place, never a second event. Match on **companion method name**, and on the **event name** the companion sends — a call site may already send the right event under a different method name, or the right method may be sending a stale name.

This only applies inside a file you are already editing. An existing event at a call site that _Where to log_ now excludes is a pruning candidate: **report it, do not remove it**. Removing a live event breaks whatever dashboard depends on it, and that is the owner's call, not this edit's. A site with no event that step 1 rejects is left alone.

## Verify

Lint and test the touched project after editing; on failure fix or revert, never leave the workspace unable to build.

Then report, in one place: every event name added, its parameters, and **which parameters need registering as custom dimensions** before anyone can see them. Data sent before registration is unreadable, so this is the difference between the change working and appearing to work.

Where a recommended event went out **without one of its prescribed parameters**, say which, and which built-in report therefore stays empty. That is the whole reason the recommended name was chosen, so a reader who is told the name is "recommended" and nothing else will expect a report that never fills.

## Changing or adding a rule

Copy these into todos so they stay grouped. Load `references/methodology.md` on this occasion — before changing a rule, when someone questions one, or when adding a new one.

- [ ] `[log-ana]` Read `references/methodology.md` before changing a rule
- [ ] `[log-ana]` State the failure the new rule prevents
- [ ] `[log-ana]` Update the reasoning in that reference in the same change
- [ ] `[log-ana]` Update its `Explains:` line to the new version
- [ ] `[log-ana]` Bump this skill's version (minor for a changed or added rule)
- [ ] `[log-ana]` Update the stub only if the `description` changed

## Common mistakes

| Mistake                                                                    | Fix                                                                                            |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Temporary events added because the deadline was tomorrow                   | Refuse. Offer a diagnostic log or the vendor's debug view. The data is permanent; the urgency is not. |
| A marker comment used to make temporary events acceptable                  | A marker removes the call, never the rows. Refuse regardless of the marker.                    |
| The lib or component encoded in the event name                             | The name is the action alone. Those are the `lib_name` and `class` parameters.                 |
| A custom name minted where a recommended event fits                        | Use the recommended name with its prescribed parameters; it populates built-in reports a custom name does not. |
| A new event added to answer what a parameter would answer                  | Add the parameter to the event you already send. Step 2 of the decision order.                 |
| Parameters added because the code had the values to hand                   | Run step 1 per field. A field nobody asks a question about costs a permanent registration slot. |
| A recommended event's prescribed field sent though the action has no use for it | Prescribed names what to call it if you send it, not that you must. Send the ones that carry meaning. |
| Parameters written in camelCase                                            | `snake_case`, always. Mixed casing splits one metric into two.                                 |
| A discriminator value invented without checking what the event already sends | Match the existing spelling. `x_user` and `x_users` split one breakdown; the registry records these so they can be compared. |
| `-1` or `'unknown'` sent for a value that is absent                        | Omit the parameter. Absence is already representable.                                          |
| A flag sent as a real boolean                                              | Send `1` or `0`. Only string and number are supported parameter types.                         |
| A raw error string or whole response sent as a parameter                   | Name the two or three fields that matter. Both are unbounded and routinely carry user content. |
| An event logged in a `ui` lib because the import was allowed               | Module boundaries permit it; this rule forbids it. The `feature` host logs it.                 |
| A `ui` lib's output added so the `feature` could log it                    | Stop and hand it back. Widening a shared contract for analytics is design work.                |
| The same interaction logged in both the `ui` handler and the `feature`     | One interaction, one event, at the `feature`.                                                  |
| A screen-view event hand-written                                           | The platform collects one; where the mechanism misses route changes, covering that is app wiring. Either way, do not hand-log it. |
| Events invented from a verbal request without confirming the list          | Resolve the event source; with no document, present the candidate list and get one confirmation. |
| Initialization or consent wiring added so the events would fire            | Report the unmet runtime prerequisite. App wiring is not this edit.                            |
| An existing event deleted while adding others                              | Report it as a pruning candidate. A live event has dashboards behind it.                       |
| Custom dimension registration left unmentioned                             | Name the parameters needing registration in the final report, or the data is unreadable.       |
| An event written with more than 25 parameters                              | Do not write it. Report the overflow and ask which fields to cut — the platform drops them silently and the event still succeeds. |
| A name or value written past its length limit                              | Shorten the name, or substitute an identifier for the value, and say what changed.             |
| A companion named from the first filename segment (`x-users.log-analytics.ts`) | Keep every segment before the final extension: `x-users.component.ts` → `x-users.component.log-analytics.ts`. |
| Mechanism written into the named file when the reference can isolate       | Follow the companion. The named file holds construct + one-liners only.                        |
| A mechanism chosen by asking when the file already settled it              | Derive, apply, announce in one line. Ask only on the stop conditions in the index.             |
| A dependency added so a preferred mechanism would apply                    | Stop. Report the unmet compile-time prerequisite; the index owns what happens next.            |
