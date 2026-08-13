# 'util' lib samples

Sample files from a `util` lib — non-UI, framework-free helpers that any lib or app may import. Use them as inspiration when creating or extending one, e.g. `shared-util-formatters`.

> **A `util` is never a functionality.** No `docs/x/{name}/` PRD or TFS, no ACs, no e2e — ever, whatever shape it takes. Its unit-test FR/BR IDs come from a local `requirements/` registry (`README.md` live + `DECISIONS.md` burned). See `docs/getting-started/library-types-and-their-relationship.md` → 'util' type.

## Two shapes — and why it changes nothing here

A `util` may be **single-purpose** (one concern, one `src/lib/v1/`) or a **grab-bag** (several unrelated helpers, each in its own `src/lib/{item}-v1/`). Unlike `ui` / `feature`, the shape decides **nothing** for a `util`: it is not a functionality either way, and the `requirements/` folder always sits beside the **inner version README** — which resolves per item for a grab-bag and per lib for a single-purpose one.

The sample below is a **grab-bag** (the common case), so the tree shows per-item folders:

```
libs/shared/util/formatters/
├── src/
│   ├── lib/
│   │   ├── number-v1/               ← existing item, untouched
│   │   │   ├── number-formatter.ts
│   │   │   └── number-formatter.spec.ts
│   │   └── date-v1/                 ← the item you are adding
│   │       ├── date-formatter.ts
│   │       ├── date-formatter.spec.ts
│   │       ├── requirements/           ← FR/BR IDs for this item (README.md + DECISIONS.md)
│   │       └── README.md (inner)
│   └── index.ts                     ← one export line added
├── .eslintrc.json
├── jest.config.ts
├── project.json
├── README.md (outer)
├── tsconfig.json
├── tsconfig.lib.json
└── tsconfig.spec.json
```

A **single-purpose** util is identical except the tree is `src/lib/v1/` with the `requirements/` folder and inner `README.md` in that one folder.

## `README.md` (outer) file

```markdown
# shared-util-formatters

Here's the home of framework-free formatting helpers, shared across apps and libs.
```

## `index.ts` file

One line per item:

```ts
export * from './lib/number-v1/number-formatter';
export * from './lib/date-v1/date-formatter';
```

## `date-v1` item files

### `date-formatter.ts` file

A `util` exports **plain functions**, not Angular classes. The version goes in the function name — `v{n}{FunName}` per `docs/guidelines/naming-conventions.md` — because a `util` has no selector or class to carry it:

```ts
/** The date shapes this formatter accepts. */
export type V1Date_Input = Date | string | number;

/**
 * Formats a date as a short, locale-aware label.
 *
 * @param value - A `Date`, an ISO string, or an epoch in milliseconds.
 * @param locale - BCP-47 tag, e.g. `'en-GB'`. Defaults to `'en-GB'`.
 * @returns The formatted label, or `''` when `value` is not a valid date.
 *
 * @example
 * v1DateFormatShort('2026-02-03T14:05:00Z');        // '03 Feb 2026'
 * v1DateFormatShort(new Date(), 'sv-SE');           // '12 aug. 2026'
 */
export function v1DateFormatShort(
  value: V1Date_Input,
  locale = 'en-GB',
): string {
  const date = value instanceof Date ? value : new Date(value);

  // Invalid input must never throw — callers bind the result straight to a template.
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
```

### `requirements/README.md` file

The item's own FR/BR registry — a `util` has no TFS, so this is what its unit tests map to. IDs are `UTIL-{KEY}-…`, where `{KEY}` is the folder basename minus `-v{n}`, uppercased with `-` → `_` (`date-v1` → `DATE`):

```markdown
# `date-v1` requirements

Locale-aware short-date formatting for display.

## UTIL-DATE-FR-01: Format a valid date

- **UTIL-DATE-BR-01**: Given a `Date` of `2026-02-03T14:05:00Z` and locale `'en-GB'`; When formatted; Then the result is `'03 Feb 2026'`.
- **UTIL-DATE-BR-02**: Given the ISO string `'2026-02-03T14:05:00Z'`; When formatted; Then the result equals the result for the equivalent `Date`.
- **UTIL-DATE-BR-03**: Given an epoch in milliseconds; When formatted; Then the result equals the result for the equivalent `Date`.

## UTIL-DATE-FR-02: Never throw on invalid input

- **UTIL-DATE-BR-04**: Given `'not-a-date'`; When formatted; Then the result is `''`.
- **UTIL-DATE-BR-05**: Given `NaN`; When formatted; Then the result is `''`.
```

### `date-formatter.spec.ts` file

`describe` ↔ FR, `it` ↔ BR, exact IDs from `requirements/README.md`. No `TestBed` — a `util` is framework-free, so tests are plain function calls:

```ts
import { v1DateFormatShort } from './date-formatter';

describe('UTIL-DATE-FR-01: Format a valid date', () => {
  /* //////////////////////////////////////////////////////////////////////// */

  it('UTIL-DATE-BR-01: Given a Date and en-GB; When formatted; Then it reads "03 Feb 2026"', () => {
    const value = new Date('2026-02-03T14:05:00Z'); // Arrange
    const result = v1DateFormatShort(value, 'en-GB'); // Act
    expect(result).toBe('03 Feb 2026'); // Assert
  });

  it('UTIL-DATE-BR-02: Given an ISO string; When formatted; Then it matches the Date result', () => {
    const iso = '2026-02-03T14:05:00Z'; // Arrange
    const result = v1DateFormatShort(iso, 'en-GB'); // Act
    expect(result).toBe(v1DateFormatShort(new Date(iso), 'en-GB')); // Assert
  });
});

describe('UTIL-DATE-FR-02: Never throw on invalid input', () => {
  /* //////////////////////////////////////////////////////////////////////// */

  it('UTIL-DATE-BR-04: Given a non-date string; When formatted; Then the result is empty', () => {
    const result = v1DateFormatShort('not-a-date'); // Arrange + Act
    expect(result).toBe(''); // Assert
  });
});
```

### `README.md` (inner) file

````markdown
# shared-util-formatters

v1 — `v1DateFormatShort`.

## Implementation guide

Formats a date as a short, locale-aware label for display. Accepts a `Date`, an ISO string, or an epoch, and returns `''` for anything unparseable — so a template can bind the result without a guard.

```ts
import { v1DateFormatShort } from '@x/shared-util-formatters';

const label = v1DateFormatShort(order.placedAt, user.locale); // '03 Feb 2026'
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-util-formatters` to execute the unit tests.
````

## Boundaries a `util` must respect

| Rule                             | Why                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| No Angular, no RxJS, no DOM      | a `util` must be importable from anywhere, including other `util` libs                               |
| No `data-access` / `map` imports | if it needs data, take it as an argument; if it truly must import, go through an `api` re-export lib |
| No URL / route access            | that is a `page` concern                                                                             |
| Exports are `v{n}{FunName}`      | there is no class or selector to carry the version                                                   |
| Never a `docs/x/` PRD or TFS     | a `util` is not a functionality, whatever its shape                                                  |
