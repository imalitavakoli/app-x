---
applicability: an Angular inject context, in a workspace that has the tracking-facade util, that can import that package without a cycle or module-boundary violation
priority: 10
companion: yes
inapplicable: ask
---

## Companion

Look at the target. `.ts` → `{stem}.log-analytics.ts` and an **injectable class**. Same folder as the target. Mechanism calls (the facade, the context parameters, the private `log` hop) live only in class methods. The named file injects the class and calls one-liner methods.

**Method name is the developer's word; the event name is the vendor's.** `clickedAdvice()` may send `select_content`. They are deliberately different, and the companion is the only place both appear together — that is what makes it the file's tracking plan.

## Import and injection

The companion imports `V1TrackingService` from **this workspace's mapped package** for the tracking-facade util, and injects it. Resolve the specifier from the TypeScript path mapping or that project's `package.json` `name`. If this workspace has no such mapping or project, **this mechanism does not apply** — do not add the lib, do not invent a specifier. Mark the companion `@Injectable({ providedIn: 'root' })`. The named file imports the companion from `./{stem}.log-analytics` and holds `inject(CompanionClass)` as `private readonly _ana`. The named file does not import the facade.

This mechanism cannot construct with `new` — it needs an inject context.

## Prerequisites

**Compile-time** — unmet means this mechanism does not apply:

- the tracking-facade util is a project in this workspace with a resolvable specifier
- the target's project may import it without a cycle or a module-boundary violation

**Runtime** — unmet means apply anyway and report:

- the host app calls the facade's `prepare(appVersion)` once, then `initOrUpdate` with the analytics type. Until it does, **every `logEvent` is a silent no-op**: the facade guards each sink behind its own `isInit*` flag, all of which start `false`. The call sites are still correct; they simply record nothing.
- **the remote configuration actually enables the analytics integration.** The facade's private init methods return early when their integration flag is off or their config object is missing, leaving the `isInit*` flags `false` — so a correctly-wired app still records nothing in any environment where that flag is off. Read the facade's init guards to see which flag governs, and name the environments in the report. This is the failure that looks most like success: initialization was called, the build is clean, and no data arrives.
- the app gathers consent before calling `initOrUpdate`, where the app collects consent at all
- the custom parameters are registered as custom dimensions in the vendor console

**Never add any of these.** Initialization lives in the app's root component, not in a lib, and consent is a product decision. Report which are unmet, name the file that would own each, and continue.

## Preference keys

This mechanism has none. `prefs.json` → `mechanisms["ng-tracking-v1"]` may be absent or `{}`.

The standard context parameters are skill-wide keys (`contextClass`, `contextRoute`, `contextLibName`); this section covers only how their values are **obtained** here.

## Call shape

The facade takes `(name, data)`. Inside the companion, a private `log` hop merges the standard context parameters into every event so no call site can omit them:

- event name → `name`, the vendor name chosen per `SKILL.md` → _The record shape_
- parameters → `data`, a flat object of `snake_case` keys

Do not expose the facade on the companion. Public methods stay action-named; only `log` talks to the facade.

**Obtaining each context parameter:**

| Parameter  | Source                                                                                                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class`    | the target's `nameThis` field when it has one (the workspace convention on components), otherwise the class's own name. Hold it on the companion as a constructor argument or a settable field — the companion cannot read its host's identity by itself. |
| `route`    | inject `Router` in the **companion** and take `url.split('?')[0]` with the leading slash removed. Never the full URL. |
| `lib_name` | the Nx project name of the target's project, read from its `project.json`. Off by default.                                                                |

**Do not re-derive `route` at each call site.** The companion reads it at emit time inside `log`, so the value is the route at the moment of the event rather than at construction.

**Do not reach for a base class's route helper, even where one exists.** This workspace's feature base class carries a route-resolution helper written for analytics, and it is `protected` — reachable from a subclass, and therefore **not** from a separate companion class. The companion injects `Router` itself. If that helper is ever widened to be reachable, this row changes; until then, preferring it produces an instruction that cannot be followed.

## Reserved names in this workspace

Beyond the vendor's `firebase_*`, `google_*`, `ga_*` prefixes:

- **`user_id`** is the vendor's user-scoped identifier and the facade already sets it app-wide for the signed-in user. An event parameter naming some *other* user must not be called `user_id`, or the two are conflated in every report. Use a qualified name — `selected_user_id`, `viewed_author_id`.
- **`buildId`** is already set as a user property by the facade. Do not send it as an event parameter.

## Where the data goes

The facade fans out to **every** initialized sink: the native analytics plugin on a native platform, the web SDK otherwise, and the feedback/engagement SDK. One `logEvent` call is therefore one event in the analytics property **and** one engagement event in the feedback tool. That is the facade's design, not a side effect to work around — but it means an event name chosen for a dashboard also appears in the feedback tool's targeting rules.

Screen views are already emitted by the facade's automatic screen tracking. Do not hand-log them.

## Verify the value types actually arrive

The facade passes `data` through to each sink unchanged, so what a sink accepts is the sink's business, and the native and web paths are not the same code. Send real booleans and numbers per `SKILL.md`; then **confirm in the vendor's debug view** that each parameter arrived with the type you sent, on the platform the target actually runs on. Record any encoding a sink turns out to require in this section rather than working around it at a call site — a per-call-site workaround is how one lib's booleans stop matching another's.

## Contexts this mechanism cannot serve

The tracking-facade util is not in this workspace (no path mapping, no project). No Angular inject context. A file that cannot import that package without a cycle or a module-boundary violation. A file that is not TypeScript or JavaScript.

Note that a `ui` lib is usually *able* to import this facade — the module boundaries permit it. `SKILL.md` → _Where to log_ forbids it anyway. That is a placement rule, not an applicability one.

When this mechanism is in the catalog and does not apply, the index's `inapplicable: ask` stop fires before any remaining mechanism is used. This file does not restate that stop.

## Worked before/after

Invented target: `advisory-card.component.ts` in a `feature` project, class `V1AdvisoryCardFeaComponent`. Companion: `advisory-card.component.log-analytics.ts`. Context: `class` and `route` on, `lib_name` off. Event source: a tracking plan naming "user opened an advice".

**Named file, before**

```ts
@Component({ selector: 'x-advisory-card-fea-v1', templateUrl: './advisory-card.component.html' })
export class V1AdvisoryCardFeaComponent extends V2BaseFeatureExtComponent {
  readonly nameThis = 'V1AdvisoryCardFeaComponent';

  onAdviceClicked(advice: V1Advisory_MapAdvice) {
    this.adviceSelected.emit(advice);
  }
}
```

**Named file, after** — inject plus one-liners only; no facade import, no parameter map.

```ts
import { V1AdvisoryCardFeaComponentLogAnalytics } from './advisory-card.component.log-analytics';

@Component({ selector: 'x-advisory-card-fea-v1', templateUrl: './advisory-card.component.html' })
export class V1AdvisoryCardFeaComponent extends V2BaseFeatureExtComponent {
  readonly nameThis = 'V1AdvisoryCardFeaComponent';
  private readonly _ana = inject(V1AdvisoryCardFeaComponentLogAnalytics);

  onAdviceClicked(advice: V1Advisory_MapAdvice) {
    this._ana.clickedAdvice({ advice_id: advice.id, position: advice.rank });
    this.adviceSelected.emit(advice);
  }
}
```

**Companion, after** — the tracking plan for this file. `select_content` is the vendor's recommended name for choosing an item, so it populates standard reports; `content_type` distinguishes this card from any other `select_content` in the app, which is the parameter doing the work the lib prefix used to do badly.

```ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { V1TrackingService } from '{mapped tracking-facade package}';

@Injectable({ providedIn: 'root' })
export class V1AdvisoryCardFeaComponentLogAnalytics {
  private readonly _tracking = inject(V1TrackingService);
  private readonly _router = inject(Router);
  private readonly _class = 'V1AdvisoryCardFeaComponent';

  /** `select_content` — the end-user opened an advice from the card. */
  clickedAdvice(attrs: { advice_id: string; position: number }): void {
    this.log('select_content', { content_type: 'advisory_card', ...attrs });
  }

  private log(name: string, params: Record<string, unknown>): void {
    this._tracking.logEvent(name, {
      ...params,
      class: this._class,
      route: this._router.url.split('?')[0].replace(/^\//, ''),
    });
  }
}
```

Note what is **not** here: no `advisoryCard_` prefix on the name, no `-1` for a missing value (an absent parameter is simply not spread in), and no second event for the card merely rendering.

## Already done?

Match on the companion's method name, **and** on the event name it sends. Either alone misses a real case: a method may already exist under a different name for the same action, and an existing method may be sending a stale event name that should be corrected in place rather than joined by a second one.

An existing inline `logEvent(...)` at the same site is the same event — move it into the companion as part of this edit rather than adding a companion method beside it.
