# shared-ui-ng-directives

v1.

## Implementation guide

It adds 'scroll to top' behaviour on `ion-content` element.

**NOTE:** What about Angular original router behaviour? This directive is not required for that! Because for window scroll positioning we can just config it in `app.config.ts` file of the app.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { IonContent } from '@ionic/angular/standalone';

import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1OnNavScrollMeToTopDirective } from '@x/shared-ui-ng-directives';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    IonContent,
    V1OnNavScrollMeToTopDirective,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
<ion-content xOnNavScrollMeToTopV1> ... </ion-content>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-directives` to execute the unit tests.
