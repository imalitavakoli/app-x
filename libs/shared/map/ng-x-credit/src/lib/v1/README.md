# shared-map-ng-x-credit

x-credit v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-x-credit' lib.

Here's an example of how to test the lib:

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XCredit } from '@x/shared-map-ng-x-credit';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _proxy = inject(V1XCredit);
  private readonly _baseUrl = '/v1';

  ngOnInit() {
    // Get Summary
    this._proxy
      .getSummary(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getSummary:', data);
        }),
      )
      .subscribe();

    // Get Detail
    this._proxy
      .getDetail(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getDetail:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-x-credit` to execute the unit tests.
