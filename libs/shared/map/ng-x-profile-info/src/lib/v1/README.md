# shared-map-ng-x-profile-info

x-profile-info v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-x-profile-info' lib.

Here's an example of how to test the lib:

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XProfileInfo } from '@x/shared-map-ng-x-profile-info';
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
  private readonly _proxy = inject(V1XProfileInfo);
  private readonly _baseUrl = '/v1';

  ngOnInit() {
    // Get data
    this._proxy
      .getData(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getData:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-x-profile-info` to execute the unit tests.
