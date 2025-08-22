# shared-ui-ng-preloaders

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1PreloadersComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
<x-preloaders-v1
  preset="rings"
  svgClass="scale-[1]"
  class="flex scale-90 justify-center fill-current"
>
</x-preloaders-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-preloaders` to execute the unit tests.
