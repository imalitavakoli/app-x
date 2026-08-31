---
name: x-log-analytics-editor
description: 'WHAT? The rule for which call sites deserve an analytics event, and the edit that adds, renames or prunes them in named files. WHEN? Asked to add, audit or correct analytics, tracking, product-event or Firebase/GA4 event logging in components, services or plain TS/JS; deciding whether an interaction deserves an event, what to name it, what to send as parameters, or which analytics mechanism to use. Not for diagnostic logging a developer reads while debugging.'
metadata:
  kind: editor
  version: '1.0.0'
---

# Log Analytics Editor

## Overview

This skill specifies terms, context and methodology for analytics events in files the user named. The agent reading this makes the edit.

This file supplies the recommendations: whether an interaction deserves an event, what the event is named, what it carries, and that records live in a companion beside the target. The chosen mechanism reference supplies the edit — how those recommendations are realized from that mechanism's capabilities.

No `scripts/` transform ships, because the right call site is a judgement. That is why the _Already done?_ rule below is written out rather than delegated to a transform.

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

- **Events are permanent.** A property retains at most **500 distinct event names**, they are not freed when you stop sending one, and history cannot be rewritten. A name sent once is a name spent.
- **A parameter is invisible until registered.** Custom parameters do not appear in reports until someone registers them as custom dimensions — capped at **50 event-scoped** per property, applied **non-retroactively**. So a parameter costs a permanent slot _and_ a manual step, and data sent before registration is unreadable forever.
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
| screen or page views                             | already collected automatically; a hand-rolled one double-counts and burns a name              |
| both a `ui` output handler and its `feature` host | one interaction, two events, every metric doubled                                              |
| render, change-detection and lifecycle hooks     | they re-run on input changes, so counts inflate and stop being a usable denominator            |
| loops and per-row impressions                    | one event per rendered row exhausts the quota and buries the interaction that mattered         |
| a technical failure a user never perceives       | that is a diagnostic record for a developer, not a product metric                              |
| anything a parameter on an existing event answers | a second name where a dimension would do, spending a permanent slot to avoid a small edit      |

## The record shape

An event **is** these two parts. Produce them; there is nothing else to decide.

**1 — the name.** One of the vendor's **recommended event names** when one fits the action (`login`, `sign_up`, `search`, `share`, `select_content`, `view_item`, `purchase`, …). Only when none fits, a custom name: `snake_case`, a verb phrase describing the action that already happened, ≤40 characters, starting with a letter, letters/digits/underscore only.

Recommended names are preferred because they populate standard reports on their own; a custom name appears only in explorations someone has to build.

**The name never carries a variable.** Not the lib, not the component, not the item, not the plan. Those are parameters. A name that varies mints one permanent name per value and makes the action uncountable across the app.

**2 — the parameters.** `snake_case`. Named fields only. Per event: at most 25, including the automatic ones.

| Rule                                                 | Do                                          | Not                                     |
| ---------------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| Casing                                                | `users_count`                               | `usersCount`, `UsersCount`              |
| A value that is absent                                | omit the parameter                          | `-1`, `''`, `'none'`, `'unknown'`       |
| A boolean                                             | `true` / `false`                            | `'true'`, `1`, `'yes'`                  |
| A whole object, response or error                     | name the two or three fields that matter    | the object, or its stringified form     |
| A reserved name                                       | `selected_user_id`                          | `user_id` — reserved, user-scoped       |
| A reserved prefix                                     | any other name                              | `firebase_*`, `google_*`, `ga_*`, `_*`  |

**Standard context parameters** are attached to every event by the companion, so no call site can forget them and none of them appear at a call site. Which are attached is a preference (see the mechanism index); the announced defaults are:

| Parameter  | Default | Is                                                                       |
| ---------- | :-----: | ------------------------------------------------------------------------ |
| `class`    |   on    | the emitting class — named for the construct, not one framework's word for it |
| `route`    |   on    | the active route path, query and fragment stripped                       |
| `lib_name` |   off   | the Nx project name, for grouping by owning lib                          |

Each one costs a permanent custom-dimension slot, which is why the default is two and not five.

## Companion file

Recommend a companion beside the named file as the **default**. Same folder; named from the target by inserting `.log-analytics` before the extension. The companion owns the records; the named file only constructs it and calls one-liners. Do not offer companion vs inline as a preference.

**The companion is the file's tracking plan.** Because the event name is the vendor's and the method name is the developer's, the companion is the one place both are visible together — which is what makes the event list reviewable by whoever owns the metrics, and what keeps the standard context parameters in a single hop.

**Do not name a class** — a class is one language's construct; this file states the pattern only. Each reference declares `companion: yes` or `no` in frontmatter. If `yes`, it fills the companion. If `no`, it states that ceiling and writes the records the way it can. Creating the companion when absent is the edit's empty case; the named file must already exist.

## One mode only

**There is no temporary analytics event. Refuse to add one.**

A request for throwaway instrumentation — "just for this investigation", "we will rip it out next week", "over-instrument, we can clean up later" — is refused, and the refusal is not softened by urgency, by a marker comment, or by a promise to remove it. There is nothing to remove: the name is spent the moment it is sent, the rows stay in history, and the reports stay polluted after the code is gone.

**No exceptions:**

- Not with a `// temporary` marker — a marker removes the call, never the data.
- Not "we will delete the events in the console" — names are not freed, and history is not rewritable.
- Not because the deadline is tomorrow.
- Not because the events are "only in development" — unless the mechanism can prove they never reach the property, which it must state.

**What to offer instead**, in this order: a diagnostic log, which is a developer-facing record designed to be deleted and is a different deliverable with its own rules; the vendor's debug view on an event you were going to ship anyway; or a session-replay / product-analytics tool if the team has one. Say which you are recommending and why the analytics property is the wrong sink.

An event worth keeping for one week is either worth keeping permanently — in which case add it properly, through _What decides an event exists_ — or it is a diagnostic log wearing the wrong clothes.

## Hard rules

Never send names, email addresses, phone numbers, user-typed text, precise location, government or payment identifiers, tokens, or anything a user opted out of. This is not only a data-hygiene rule: sending it violates the analytics vendor's terms and can have the property's data deleted or its access suspended, and events cannot be deleted individually after the fact.

Send an opaque identifier instead and join it outside the analytics property. Never send a raw error string or an API response — both are unbounded and both routinely contain user content. Strip query strings and fragments from anything route-shaped before sending it.

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

**Each mechanism declares its own prerequisites, of two kinds:**

- **Compile-time** — a package or lib that must be present and importable. Unmet → **stop**. Report it; never add the dependency to make a mechanism apply.
- **Runtime** — initialization, consent, or console configuration the app owns. Unmet → **report it and continue**; the call sites are still correct, but say plainly that they will record nothing until it is done.

## The edit

Do not write a call site, import, parameter map or class from this file. The sequence is: resolve the event source, apply the methodology above, choose the mechanism per `references/README.md`, then follow that reference's procedures (companion + one-liners when `companion: yes`). The worked before/after lives in the reference.

## Already done?

An existing event for the same action at the same call site is an update in place, never a second event. Match on **companion method name**, and on the **event name** the companion sends — a call site may already send the right event under a different method name, or the right method may be sending a stale name.

This only applies inside a file you are already editing. An existing event at a call site that _Where to log_ now excludes is a pruning candidate: **report it, do not remove it**. Removing a live event breaks whatever dashboard depends on it, and that is the owner's call, not this edit's. A site with no event that step 1 rejects is left alone.

## Verify

Lint and test the touched project after editing; on failure fix or revert, never leave the workspace unable to build.

Then report, in one place: every event name added, its parameters, and **which parameters need registering as custom dimensions** before anyone can see them. Data sent before registration is unreadable, so this is the difference between the change working and appearing to work.

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
| A custom name minted where a recommended event fits                        | Use the recommended name; it populates standard reports a custom name never will.              |
| A new event added to answer what a parameter would answer                  | Add the parameter to the event you already send. Step 2 of the decision order.                 |
| Parameters written in camelCase                                            | `snake_case`, always. Mixed casing splits one metric into two.                                 |
| `-1` or `'unknown'` sent for a value that is absent                        | Omit the parameter. Absence is already representable.                                          |
| A boolean sent as `'true'` or `1`                                          | Send a real boolean; the mechanism reference states any encoding it must apply.                |
| A raw error string or whole response sent as a parameter                   | Name the two or three fields that matter. Both are unbounded and routinely carry user content. |
| An event logged in a `ui` lib because the import was allowed               | Module boundaries permit it; this rule forbids it. The `feature` host logs it.                 |
| A `ui` lib's output added so the `feature` could log it                    | Stop and hand it back. Widening a shared contract for analytics is design work.                |
| The same interaction logged in both the `ui` handler and the `feature`     | One interaction, one event, at the `feature`.                                                  |
| A screen-view event hand-written                                           | Already collected automatically. Hand-logging double-counts and spends a name.                 |
| Events invented from a verbal request without confirming the list          | Resolve the event source; with no document, present the candidate list and get one confirmation. |
| Initialization or consent wiring added so the events would fire            | Report the unmet runtime prerequisite. App wiring is not this edit.                            |
| An existing event deleted while adding others                              | Report it as a pruning candidate. A live event has dashboards behind it.                       |
| Custom dimension registration left unmentioned                             | Name the parameters needing registration in the final report, or the data is unreadable.       |
| Mechanism written into the named file when the reference can isolate       | Follow the companion. The named file holds construct + one-liners only.                        |
| A mechanism chosen by asking when the file already settled it              | Derive, apply, announce in one line. Ask only on the stop conditions in the index.             |
| A dependency added so a preferred mechanism would apply                    | Stop. Report the unmet compile-time prerequisite; the index owns what happens next.            |
