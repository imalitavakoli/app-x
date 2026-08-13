# Grab-bag 'ui' lib samples (pipes / directives)

Sample files from a **grab-bag** `ui` lib (`CONTEXT.md`) — here, presentational items such as pipes, directives and animations. Use them as inspiration when adding an item to a lib like `shared-ui-ng-pipes` or `shared-ui-ng-directives`.

> **A grab-bag is not a functionality.** It gets **no** `docs/x/{name}/` PRD or TFS, no ACs, and never e2e. Each item carries its own `requirements/` registry for unit-test IDs (`README.md` live + `DECISIONS.md` burned). See `docs/getting-started/library-types-and-their-relationship.md` → Single-purpose vs grab-bag. Compare with [ui.md](ui.md), which is a **single-purpose** `ui` lib and _is_ a functionality.

Everything below is **per item**. The lib-level files (`project.json`, `jest.config.ts`, tsconfigs, outer `README.md`) already exist — adding an item never touches them except `src/index.ts`.

```
libs/shared/ui/ng-pipes/
├── src/
│   ├── lib/
│   │   ├── currency-v1/            ← existing item, untouched
│   │   │   ├── currency.pipe.ts
│   │   │   ├── currency.pipe.spec.ts
│   │   │   └── README.md (inner)
│   │   └── truncate-v1/            ← the item you are adding
│   │       ├── truncate.pipe.ts
│   │       ├── truncate.pipe.spec.ts
│   │       ├── requirements/          ← FR/BR IDs for this item (README.md + DECISIONS.md)
│   │       └── README.md (inner)
│   ├── index.ts                    ← one export line added
│   └── test-setup.ts
├── .eslintrc.json
├── jest.config.ts
├── project.json
├── README.md (outer)               ← generic; usually unchanged
├── tsconfig.json
├── tsconfig.lib.json
└── tsconfig.spec.json
```

**Note the shape:** one folder **per item**, each named `{item}-v{n}` — not a single `src/lib/v1/`. That per-item versioning is exactly what makes the lib a grab-bag: the items version independently because they are independent concerns.

## `README.md` (outer) file

Generic and item-agnostic — it names the bucket, not the items, so adding an item does not change it:

```markdown
# shared-ui-ng-pipes

Here's the home of Angular apps & libs pipes.
```

## `index.ts` file

One line per item. Never `export * as V1NAME` — an aliased pipe cannot be used in a template:

```ts
export * from './lib/currency-v1/currency.pipe';
export * from './lib/truncate-v1/truncate.pipe';
```

## `truncate-v1` item files

### `truncate.pipe.ts` file

Version lives in the **class name and the pipe name**, per the versioning convention:

```ts
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Shortens a string to `max` characters and appends an ellipsis.
 *
 * @example
 * {{ product.title | truncateV1: 20 }}
 */
@Pipe({
  name: 'truncateV1',
  standalone: true,
})
export class V1TruncatePipe implements PipeTransform {
  /**
   * @param value - The text to shorten.
   * @param max - Maximum characters to keep. Values below `1` return `''`.
   * @param ellipsis - Appended only when `value` was actually shortened.
   */
  transform(value: string, max: number, ellipsis = '…'): string {
    if (!value || max < 1) return '';
    if (value.length <= max) return value;

    return `${value.slice(0, max).trimEnd()}${ellipsis}`;
  }
}
```

### `requirements/README.md` file

The item's own FR/BR registry — this is what its unit tests map to, because a grab-bag has no TFS. IDs are `UI-{KEY}-…`, where `{KEY}` is the folder basename minus `-v{n}`, uppercased (`truncate-v1` → `TRUNCATE`):

```markdown
# `truncate-v1` requirements

Shortens a string for display and marks the cut with an ellipsis.

## UI-TRUNCATE-FR-01: Shorten only when the text exceeds the limit

- **UI-TRUNCATE-BR-01**: Given `value` is `'Hello'` and `max` is `20`; When transformed; Then the result is `'Hello'` (unchanged, no ellipsis).
- **UI-TRUNCATE-BR-02**: Given `value` is `'Hello world'` and `max` is `5`; When transformed; Then the result is `'Hello…'`.
- **UI-TRUNCATE-BR-03**: Given `value` is `'Hello     '` and `max` is `8`; When transformed; Then trailing spaces are dropped before the ellipsis, giving `'Hello…'`.

## UI-TRUNCATE-FR-02: Guard invalid input

- **UI-TRUNCATE-BR-04**: Given `value` is `''`; When transformed; Then the result is `''`.
- **UI-TRUNCATE-BR-05**: Given `max` is `0`; When transformed; Then the result is `''`.
```

### `truncate.pipe.spec.ts` file

`describe` ↔ FR, `it` ↔ BR, using the exact IDs above:

```ts
import { V1TruncatePipe } from './truncate.pipe';

describe('UI-TRUNCATE-FR-01: Shorten only when the text exceeds the limit', () => {
  /* //////////////////////////////////////////////////////////////////////// */

  it('UI-TRUNCATE-BR-01: Given a short value; When transformed; Then it is unchanged', () => {
    const pipe = new V1TruncatePipe(); // Arrange
    const result = pipe.transform('Hello', 20); // Act
    expect(result).toBe('Hello'); // Assert
  });

  it('UI-TRUNCATE-BR-02: Given a long value; When transformed; Then it is cut with an ellipsis', () => {
    const pipe = new V1TruncatePipe(); // Arrange
    const result = pipe.transform('Hello world', 5); // Act
    expect(result).toBe('Hello…'); // Assert
  });
});
```

### `README.md` (inner) file

Copy-paste-ready for the Boilerplate Test page, same shape as the sibling items:

````markdown
# shared-ui-ng-pipes

v1 — `truncateV1`.

## Implementation guide

Shortens long text for display. Trailing whitespace is trimmed before the ellipsis so the cut never reads as `'Hello …'`.

```ts
import { Component } from '@angular/core';
import { V1TruncatePipe } from '@x/shared-ui-ng-pipes';

@Component({
  standalone: true,
  imports: [V1TruncatePipe],
  template: `<p>{{ title | truncateV1: 20 }}</p>`,
})
export class TestPageComponent {
  title = 'A very long product title that will not fit';
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-pipes` to execute the unit tests.
````

## What is deliberately absent

| Not here                                             | Why                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `docs/x/{name}/PRD/README.md` and `TFS/`             | a grab-bag is not a functionality                                                      |
| PRD ACs, and any e2e spec                            | no PRD ⇒ no ACs to drive an `it`                                                       |
| `data-cy` attributes                                 | a pipe or attribute directive renders no element of its own                            |
| A base class                                         | pipes and directives extend nothing; only `ui` **components** take `V1BaseUiComponent` |
| Changes to `project.json` / tsconfigs / outer README | the lib already exists; an item only adds a folder and one `index.ts` line             |
