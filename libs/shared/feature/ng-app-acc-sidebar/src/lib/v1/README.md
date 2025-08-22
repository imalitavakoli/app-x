# shared-feature-ng-app-acc-sidebar

acc-sidebar v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppAccSidebarFeaComponent } from '@x/shared-feature-ng-app-acc-sidebar';
import { V1AppAccSidebar_State } from '@x/shared-ui-ng-app-acc-sidebar';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-name/src/environments/environment';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1AppAccSidebarFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  state: V1AppAccSidebar_State = 'general';
  appVersion = environment.version;

  isStateViewActive = false;
  showPopupLogout = false;
}
```

```html
<x-app-acc-sidebar-fea-v1
  class="w-full md:relative md:block"
  [ngClass]="{
          'e-acc-ani-hide absolute': isStateViewActive,
          'e-acc-ani-show': !isStateViewActive
        }"
  [state]="state"
  [appVersion]="appVersion"
  (clickedInternalLink)="isStateViewActive = true"
  (clickedLogout)="showPopupLogout = true"
></x-app-acc-sidebar-fea-v1>
```

```scss
.e-acc-ani-show {
  @media (max-width: 768px) {
    animation: eAniShow 0.6s forwards;
  }
}

.e-acc-ani-hide {
  @media (max-width: 768px) {
    animation: eAniHide 0.3s forwards;
  }
}
```
