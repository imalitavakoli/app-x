# shared-ui-ng-pipes

v1.

## Implementation guide

The Angular's default currency pipe doesn't support some currencies, so this pipe has been created to handle those cases.

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
{{ 20.45 | currencyV1: 'SEK' : 'sv-SE' }} // 20,45 kr
```

## Running unit tests

Run `nx test shared-ui-ng-pipes` to execute the unit tests.
