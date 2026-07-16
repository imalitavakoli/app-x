# shared-ui-ng-modal-network-v1

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V1ModalNetworkComponent } from '@x/shared-ui-ng-modal';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1ModalNetworkComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-modal-network-v1 [show]="true"> </x-modal-network-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-modal` to execute the unit tests.
