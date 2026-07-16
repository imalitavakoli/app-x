# shared-feature-ng-modal-network-v1

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1ModalNetworkFeaComponent } from '@x/shared-feature-ng-modal';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1ModalNetworkFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-modal-network-fea-v1> </x-modal-network-fea-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-feature-ng-modal` to execute the unit tests.
