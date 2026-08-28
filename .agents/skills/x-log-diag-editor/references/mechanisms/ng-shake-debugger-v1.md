---
applicability: an Angular inject context, in a workspace that has the shake-debugger util, that can import that package without a cycle or module-boundary violation
priority: 10
modes: standing, investigation
companion: yes
inapplicable: ask
---

## Companion

Look at the target. `.ts` → `{stem}.log-diag.ts` and an **injectable class**. Same folder as the target. Mechanism calls (`logDebug`, the private `log` hop, markers) live only in class methods. The named file injects the class and calls one-liner methods. Method name = event key; method argument = attributes object.

## Import and injection

The companion imports `V1ShakeDebuggerService` from **this workspace's mapped package** for the shake-debugger util, and injects it. Resolve the specifier from the TypeScript path mapping or that project's `package.json` `name`. If this workspace has no such mapping or project, **this mechanism does not apply** — do not add the lib, do not invent a specifier. Mark the companion `@Injectable({ providedIn: 'root' })`. The named file imports the companion from `./{stem}.log-diag` and holds `inject(CompanionClass)` as `private readonly _log`. The named file does not import the shake-debugger package.

This mechanism cannot construct with `new` — it needs an inject context.

## Preference keys

This mechanism has none. `prefs.json` → `mechanisms["ng-shake-debugger-v1"]` may be absent or `{}`.

`lib` is not a pref. It follows the service JSDoc: `{type}:{name}` (e.g. `feat:tracking`, `util:device-detector`, `data:auth`, `app:root`). Derive it — do not use the named class's PascalCase name.

## Call shape

The named file's one-liners _are_ the record shape: source is the companion, event key is the method name, attributes are the method argument. Inside the companion, a private `log` hop maps those onto `logDebug(key, value, lib)`:

- event key → `key` (the method name, undecorated)
- attributes → `value`, `JSON.stringify(attrs)` (no attributes → `''`)
- source → `lib`, `{type}:{name}` as below

Do not expose `logDebug` on the companion. Public methods stay event-named; only `log` talks to the service.

**`lib`.** `{type}:{name}`, kebab-case after the colon.

- **type** — the named file's project's library type (`api`, `util`, `map`, `data-access`, `ui`, `feature`, `page`, `app`). Spell `feature` as `feat` and `data-access` as `data`. Spell every other type as itself.
- **name** — that project's short kebab name after the type segment, dropping a redundant tech `ng` segment (`shared-feature-ng-chart` → `feat:chart`). When one project holds unrelated items, use the named file's stem instead (`legacy-auth-migration.service.ts` → `util:legacy-auth-migration`). A product app's root/shell file is `app:root`; any other app file is `app:` plus the app's kebab name.
- If the type cannot be determined, stop and ask — do not invent a prefix.

Hold the string once on the companion as `private readonly _lib`.

## The four levels

This mechanism has one method. Every recommended level maps to `logDebug`. Severity is not retained. Do not encode a level in the key or the value.

## Honoring developer-only vs always-on intent

This mechanism records every call into the in-memory store, in every build. That is the point of the sink — including native builds that are not the framework's development mode. Do not wrap `log` in a development-mode check; that would hide the records the UI exists to show.

Console echo is a session toggle on the service (`consoleLoggingEnabled`) and uses `console.log` with no severity. This reference does not add a second console path.

## Investigation marker

`// log-diag:investigation` on the companion method. Removal is a pass over that string in the companion, then the matching one-liners in the named file. If the companion has no methods left, delete it and the named file's inject/import.

## Where the data goes

The shake-debugger in-memory store (FIFO cap), filterable by `lib`, searchable, exportable as JSON, shown in the Shake Debugger UI. Not the browser console unless the user has enabled that session toggle on the service.

## Contexts this mechanism cannot serve

The shake-debugger util is not in this workspace (no path mapping, no project). No Angular inject context. A file that cannot import that package without a cycle or a module-boundary violation. A file that is not TypeScript or JavaScript.

When this mechanism is in the catalog and does not apply, the index's `inapplicable: ask` stop fires before any remaining mechanism is used. This file does not restate that stop.

## Worked before/after

Invented target: `item-store.ts` in a `util` project whose short name is `item-store`. Companion: `item-store.log-diag.ts`. `lib` → `util:item-store`.

**Named file, before**

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ItemStore {
  loadItems(storeKey: string): unknown[] {
    const raw = localStorage.getItem(storeKey);
    const items = raw === null ? [] : (JSON.parse(raw) as unknown[]);
    return items;
  }
}
```

**Named file, after** — inject plus one-liners only; no shake-debugger import.

```ts
import { Injectable, inject } from '@angular/core';
import { ItemStoreLogDiag } from './item-store.log-diag';

@Injectable({ providedIn: 'root' })
export class ItemStore {
  private readonly _log = inject(ItemStoreLogDiag);

  loadItems(storeKey: string): unknown[] {
    this._log.loadItemsStart({ storeKey });
    try {
      const raw = localStorage.getItem(storeKey);
      const items = raw === null ? [] : (JSON.parse(raw) as unknown[]);
      this._log.loadItemsSuccess({ storeKey, itemCount: items.length });
      return items;
    } catch (err) {
      this._log.loadItemsFailed({
        storeKey,
        reason: err instanceof Error ? err.message : 'unknown',
      });
      throw err;
    }
  }
}
```

**Companion, after** — start / success / failure all go through private `log` → `logDebug`. This mechanism cannot keep start/success out of the store. Attributes name `storeKey`, `itemCount`, and `reason`, not the stored value or the error object.

```ts
import { Injectable, inject } from '@angular/core';
import { V1ShakeDebuggerService } from '{mapped shake-debugger package}';

@Injectable({ providedIn: 'root' })
export class ItemStoreLogDiag {
  private readonly _sdc = inject(V1ShakeDebuggerService);
  private readonly _lib = 'util:item-store';

  private log(key: string, attrs?: Record<string, unknown>): void {
    this._sdc.logDebug(key, attrs == null ? '' : JSON.stringify(attrs), this._lib);
  }

  loadItemsStart(attrs: { storeKey: string }): void {
    this.log('loadItemsStart', attrs);
  }

  loadItemsSuccess(attrs: { storeKey: string; itemCount: number }): void {
    this.log('loadItemsSuccess', attrs);
  }

  loadItemsFailed(attrs: { storeKey: string; reason: string }): void {
    this.log('loadItemsFailed', attrs);
  }
}
```

## Already done?

Match on companion method name = undecorated event key at the same site, **or** an existing inline `logDebug('<eventKey>', …)` at the same site. An existing record for that event is an update in place, never a second method, a second one-liner, or a companion added beside inline calls. Do not rewrite inline `logDebug` into a companion as a side-effect of adding logs elsewhere.
