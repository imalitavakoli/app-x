# shared-feature-ng-app-footer

footer v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppFooterFeaComponent } from '@x/shared-feature-ng-app-footer';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    V1DaylightComponent,
    TranslocoDirective,
    V1AppFooterFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-app-footer-fea-v1 class="mt-8 block"></x-app-footer-fea-v1>
```
