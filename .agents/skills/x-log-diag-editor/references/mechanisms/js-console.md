---
applicability: any TS/JS context, including those without dependency injection
priority: 100
modes: standing, investigation
companion: yes
---

## Companion

Look at the target. `.ts` → `{stem}.log-diag.ts` and a **class**. `.js` → `{stem}.log-diag.js` and a **class**. Same folder as the target. Mechanism calls (`console.*`, guards, markers) live only in class methods. The named file constructs the class and calls one-liner methods. Method name = event key; method argument = attributes object.

## Import and injection

Import the companion class from the sibling path `./{stem}.log-diag`. Construct it with `new` and hold the instance on the named class as `private readonly _log`, or at module scope for a module of functions. This mechanism does not need injection.

## Preference keys

Under `prefs.json` → `mechanisms["js-console"]`:

| Key            | Announced default        | Role                                                             |
| -------------- | ------------------------ | ---------------------------------------------------------------- |
| `guard`        | `"dev-mode"`             | wraps `DEBUG`/`INFO` only                                        |
| `sourcePrefix` | `"@"`                    | prepended to the named file's stem on the console source string  |
| `eventSuffix`  | `":"`                    | appended to the event string only when the record has attributes |
| `guardFile`    | `"js-console.guard.txt"` | sibling file; only when `guard` is `"custom"`                    |

Missing object or key → that row's announced default. Do not fail the run.

## Call shape

The named file's one-liners _are_ the record shape: source is the companion, event key is the method name, attributes are the method argument. Inside the companion method, those three map onto the console API as three arguments — never as one concatenated string.

On the console strings, use `sourcePrefix` and `eventSuffix` from this mechanism's prefs object (Preference keys).

- source → `sourcePrefix` + the named file's stem, e.g. `'@item-store'`
- event key → the method name, plus `eventSuffix` **only when this record has attributes**, e.g. `'loadItemsStart:'`

The `:` (or whatever `eventSuffix` is) marks "payload follows." No attributes means nothing follows, so do not append the suffix and do not pass a third console argument:

- with attributes: `console.<level>('@item-store', 'loadItemsStart:', attrs)`
- without: `console.<level>('@item-store', 'loadItemsStart')`

Method names stay the undecorated event key (`loadItemsStart`) so they are legal identifiers. Do not put `@` or `:` on the one-liner names. An empty attributes object still counts as attributes — "no attributes" means the method takes no attributes argument.

## The four levels

These mappings appear in the companion class, not in the named file.

| Level   | Console method                                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------------------------- |
| `DEBUG` | `console.debug` (hidden behind the browser's verbose filter by default, which is useful for developer-only records) |
| `INFO`  | `console.info`                                                                                                      |
| `WARN`  | `console.warn`                                                                                                      |
| `ERROR` | `console.error`                                                                                                     |

Never a console method that carries no severity.

## Honoring developer-only vs always-on intent

`DEBUG` and `INFO` run only in development (unless `guard` is `none`). `WARN` and `ERROR` always run — in development and in production. This mechanism still emits `console.warn` / `console.error`; it just does not wrap those two in a development check.

Guard values apply to `DEBUG`/`INFO` only, inside the companion methods. Read `guard` from this mechanism's prefs object (Preference keys).

- `none` — `DEBUG`/`INFO` also run in production. Anyone who opens the console in an optimized build can read them. State that consequence once when this value is used.
- `dev-mode` — the framework's development-mode check. Wrap `DEBUG`/`INFO` so they do not run in an optimized build.
- `custom` — a guard expression the user supplies once, stored verbatim and replayed verbatim, never re-interpreted. `guardFile` on the same object names the sibling file holding the expression and its import.

A runtime check leaves the strings in the built output; removing them entirely is build configuration and outside this skill.

## Investigation marker

`// log-diag:investigation` on the companion method. Removal is a pass over that string in the companion, then the matching one-liners in the named file. If the companion has no methods left, delete it and the named file's construct/import.

## Where the data goes

The browser console. **No retention and no export** — records are read where the console shows them, so a machine-readable report is not available with this mechanism.

## Contexts this mechanism cannot serve

A file that is not TypeScript or JavaScript. A context that needs records retained or exported — this mechanism has no sink.

## Worked before/after

Invented target: `item-store.ts`. Companion: `item-store.log-diag.ts`. Guard: `dev-mode`.

**Named file, before**

```ts
export class ItemStore {
  loadItems(storeKey: string): unknown[] {
    const raw = localStorage.getItem(storeKey);
    const items = raw === null ? [] : (JSON.parse(raw) as unknown[]);
    return items;
  }
}
```

**Named file, after** — construct plus one-liners only; no `console.*`.

```ts
import { ItemStoreLogDiag } from './item-store.log-diag';

export class ItemStore {
  private readonly _log = new ItemStoreLogDiag();

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

**Companion, after** — I/O start / success as `DEBUG`/`INFO` that run only in development; failure as `ERROR` that also runs in production; attributes name `storeKey`, `itemCount`, and `reason`, not the stored value or the error object. `devMode` is the framework's development-mode check, not an import.

```ts
export class ItemStoreLogDiag {
  loadItemsStart(attrs: { storeKey: string }): void {
    if (devMode) {
      console.debug('@item-store', 'loadItemsStart:', attrs);
    }
  }

  loadItemsSuccess(attrs: { storeKey: string; itemCount: number }): void {
    if (devMode) {
      console.info('@item-store', 'loadItemsSuccess:', attrs);
    }
  }

  loadItemsFailed(attrs: { storeKey: string; reason: string }): void {
    console.error('@item-store', 'loadItemsFailed:', attrs);
  }
}
```

## Already done?

Match on companion method name = undecorated event key at the same site. Prefix and suffix live only on the console strings, and the suffix is omitted when the method has no attributes. An existing method for that event is an update in place, never a second method or a second one-liner.
