---
applicability: any TS/JS context with the `firebase` package installed and an initialized Firebase app the target can reach
priority: 100
companion: yes
---

## Companion

Look at the target. `.ts` → `{stem}.log-analytics.ts` and a **class**. `.js` → `{stem}.log-analytics.js` and a **class**. Same folder as the target. SDK calls, the analytics handle and the context parameters live only in class methods. The named file constructs the class and calls one-liner methods.

**Method name is the developer's word; the event name is the vendor's.** They are deliberately different, and the companion is the only place both appear together.

## Import and injection

The companion imports from `firebase/analytics` — the modular entry point, not a compat namespace — and obtains the analytics handle from an already-initialized app. Construct it with `new` and hold the instance on the named class as `private readonly _ana`, or at module scope for a module of functions. This mechanism needs no dependency injection, which is the whole reason it exists beside the facade.

## Prerequisites

**Compile-time** — unmet means this mechanism does not apply:

- **the `firebase` package is installed.** If it is not, say so and stop. Tell the user it is required and how their package manager would add it — then let them decide. **Never install it**, and never fall through to another mechanism as if the choice were free: adding a dependency to make a mechanism apply is a change to the project, not to a call site.
- **an initialized Firebase app is reachable from the target** — a module that exports it, or a service that holds it. If nothing exposes one, this mechanism does not apply; creating that wiring is app work, not this edit.

**Runtime** — unmet means apply anyway and report:

- `initializeApp` has actually run before the first event
- the custom parameters are registered as custom dimensions in the vendor console
- analytics is supported in the execution environment at all — the SDK exposes a support check, and it is false in server-side rendering and in some browser configurations

## Consent cannot be retrofitted here — read this before wiring anything

Obtaining the analytics handle **is** the start of collection. Initialization injects the vendor's tag script and sends an automatic page view immediately; the SDK's own collection-disable call awaits that same initialization promise, so it **cannot retroactively prevent** what already went out.

The consequence is a real constraint, not a caution: "initialize it, then disable until consent" does not work. Consent must gate the *acquisition of the handle*. If the target's app obtains the handle at startup regardless of consent, say so plainly in the report — the events this edit adds are not the problem, but the surrounding wiring has a consent defect this edit does not fix.

This is the sharpest difference from the facade mechanism, which keeps every sink behind an init flag the app controls.

## Preference keys

This mechanism has none. `prefs.json` → `mechanisms["js-firebase-analytics"]` may be absent or `{}`.

The standard context parameters are skill-wide keys (`contextClass`, `contextRoute`, `contextLibName`); this section covers only how their values are **obtained** here.

## Call shape

The modular SDK's log call takes `(analyticsHandle, name, params?)`. Inside the companion, a private `log` hop merges the standard context parameters so no call site can omit them:

- event name → the `name` argument, chosen per `SKILL.md` → _The record shape_
- parameters → the params object, a flat object of `snake_case` keys

**The SDK ships typed overloads for the vendor's recommended event names.** Passing `'share'` or `'sign_up'` type-checks its documented parameters; a custom name falls through to an untyped index signature. That is a second, concrete reason to prefer a recommended name — you get parameter checking for free, and lose it the moment you invent one.

**Obtaining each context parameter:**

| Parameter  | Source                                                                                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class`    | the named file's class name, or its file stem for a module of functions. Pass it to the companion's constructor; the companion cannot read its host's identity by itself. |
| `route`    | normalized from `location` at emit time. Hash routing → the hash's path portion; history routing → `pathname`. **Strip the query string and any fragment parameters, and the leading slash.** Never the full URL. |
| `lib_name` | the project name of the target's project. Off by default.                                                                                                     |

Read `route` inside `log`, not at construction, so the value is the route at the moment of the event.

## Screen views

Initialization emits one automatic page view. **Single-page route changes do not emit further ones** — this mechanism has no automatic screen tracking, unlike the facade. Adding route-change tracking is app wiring and is out of scope for this edit; if the target's product needs per-route screen views, report that gap rather than hand-logging screen views at call sites, which is forbidden by `SKILL.md` → _Where not to log_ for the usual double-counting reason.

## Where the data goes

The Firebase/GA4 property for the initialized app, and nowhere else. No feedback-tool fan-out, and no native SDK: inside a native shell this still runs in the webview and behaves as the web SDK, so native-only automatic events are absent.

## Contexts this mechanism cannot serve

A file that is not TypeScript or JavaScript. A project without the `firebase` package. A context with no reachable initialized app. A server-side or prerender context, where analytics support is false.

## Worked before/after

Invented target: `checkout-summary.ts`, a plain class in a project with `firebase` installed and an app exported from a local module. Companion: `checkout-summary.log-analytics.ts`. Context: `class` and `route` on, `lib_name` off. Event source: a tracking plan naming "user completed checkout".

**Named file, before**

```ts
export class CheckoutSummary {
  confirm(order: Order): void {
    this._orders.submit(order);
  }
}
```

**Named file, after** — construct plus one-liners only; no SDK import, no parameter map.

```ts
import { CheckoutSummaryLogAnalytics } from './checkout-summary.log-analytics';

export class CheckoutSummary {
  private readonly _ana = new CheckoutSummaryLogAnalytics('CheckoutSummary');

  confirm(order: Order): void {
    this._ana.confirmedOrder({ value: order.total, currency: order.currency, items_count: order.lines.length });
    this._orders.submit(order);
  }
}
```

**Companion, after** — the tracking plan for this file. `purchase` is the vendor's recommended name and is type-checked by the SDK.

```ts
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';
import { firebaseApp } from './firebase-app';

export class CheckoutSummaryLogAnalytics {
  private readonly _analytics: Analytics = getAnalytics(firebaseApp);

  constructor(private readonly _class: string) {}

  /** `purchase` — the end-user confirmed the order. */
  confirmedOrder(attrs: { value: number; currency: string; items_count: number }): void {
    this.log('purchase', attrs);
  }

  private log(name: string, params: Record<string, unknown>): void {
    logEvent(this._analytics, name, {
      ...params,
      class: this._class,
      route: this._route(),
    });
  }

  private _route(): string {
    const raw = location.hash ? location.hash.slice(1) : location.pathname;
    return raw.split('?')[0].split('#')[0].replace(/^\//, '');
  }
}
```

Note what is **not** here: no lib prefix on the event name, no sentinel for an absent value, and no hand-logged screen view.

## Already done?

Match on the companion's method name, **and** on the event name it sends. Either alone misses a real case: a method may already exist under a different name for the same action, and an existing method may be sending a stale event name that should be corrected in place rather than joined by a second one.

An existing inline SDK log call at the same site is the same event — move it into the companion as part of this edit rather than adding a companion method beside it.
