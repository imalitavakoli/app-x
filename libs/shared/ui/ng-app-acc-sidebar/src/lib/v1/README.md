# shared-ui-ng-app-acc-sidebar

v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import {
  V1AppAccSidebarComponent,
  V1AppAccSidebar_State,
} from '@x/shared-ui-ng-app-acc-sidebar';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from 'apps/app-name/src/environments/environment';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1AppAccSidebarComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  state: V1AppAccSidebar_State = 'general';
  appVersion = environment.version;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Let's listen to the outputs                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  onClickedInternalLink() {
    console.log('Internal link clicked');
  }

  onClickedLogout() {
    console.log('Logout clicked');
  }
}
```

```html
<x-app-acc-sidebar-v1
  [nav]="(configFacade.dataConfigDep$ | async)?.ui?.accountNav"
  [state]="state"
  [appVersion]="appVersion"
  (clickedInternalLink)="onClickedInternalLink()"
  (clickedLogout)="onClickedLogout()"
></x-app-acc-sidebar-v1>
```

```css
.e-acc-sidebar {
  --e-acc-sidebar--bg-color--light: var(--e-day-color) !important;
  --e-acc-sidebar--bg-color--dark: var(--e-night-darker-color) !important;
}
```

## Important requirements

_None._
