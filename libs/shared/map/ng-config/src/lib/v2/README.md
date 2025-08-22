# shared-map-ng-config

config v2.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-config' lib.

Here's an example of how to test the lib:

```ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';

import { V2Config } from '@x/shared-map-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  private readonly _proxy = inject(V2Config);

  ngOnInit() {
    // Load config: DEP
    this._proxy
      .loadConfigDep('./assets/DEP_config.json')
      .pipe(
        take(1),
        map((data) => {
          console.log('loadConfigDep:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-config` to execute the unit tests.
