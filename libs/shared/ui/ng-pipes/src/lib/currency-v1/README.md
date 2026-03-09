# shared-ui-ng-pipes

v1.

## Implementation guide

The Angular's default currency pipe doesn't support some currencies, so this pipe has been created to handle those cases + adding some custom logic.

**What pipe's `truncate` argument does?**
When `truncate` is `true`, in simple terms, we first first cut off extra decimals with `Math.trunc`, and then call `toLocaleString` to format the number... So after truncation, there's nothing left for `toLocaleString` to round up (because if we give a number with more decimals than `fractionDigits` to `toLocaleString`, it will round up the number as well).  
For example, if `value` is `1.235` and `fractionDigits` is `2`, then:

- When `truncate` is `false`, `toLocaleString` will round up `1.235` to `1.24`.
- When `truncate` is `true`, we first truncate `1.235` to `1.23`, and then `toLocaleString` will keep it as `1.23`.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1CurrencyPipe } from '@x/shared-ui-ng-pipes';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective, V1CurrencyPipe],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
{{ 20.45 | currencyV1: 'SEK' : 'sv-SE' : false }} // 20,45 kr
```

## Running unit tests

Run `nx test shared-ui-ng-pipes` to execute the unit tests.
