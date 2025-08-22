# shared-ui-ng-ionic

v1.

`V1IonicAppHolderComponent` utilizes `<ion-app>`. Mostly useful to be used in `app.component.ts` file of the apps.

## Implementation guide

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1IonicAppHolderComponent } from '@x/shared-ui-ng-ionic';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1IonicAppHolderComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-ionic-app-holder-v1></x-ionic-app-holder-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-ionic` to execute the unit tests.
