# shared-ui-ng-directives

v1.

## Implementation guide

It adds 'long press' handler for an element.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1LongPressMeDirective } from '@x/shared-ui-ng-directives';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1LongPressMeDirective,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
<button xLongPressMeV1 [longPressDur]="500" (longPress)="handleLongPress()">
  Long Press Me
</button>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-directives` to execute the unit tests.
