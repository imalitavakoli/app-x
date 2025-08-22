# shared-map-ng-auth

auth v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-auth' lib.

Here's an example of how to test the lib:

```ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { V1Auth } from '@x/shared-map-ng-auth';
import { map, take } from 'rxjs';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  private readonly _proxy = inject(V1Auth);

  ngOnInit() {
    // Call and test the proxy lib's methods one by one...
    this._proxy
      .something(...)
      .pipe(
        take(1),
        map((data) => {
          console.log(data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-auth` to execute the unit tests.
