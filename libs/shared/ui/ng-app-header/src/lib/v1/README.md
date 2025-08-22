# shared-ui-ng-app-header

v1.

This lib consists of the following globally exported components:

- `V1AppHeaderDesktopComponent`: Desktop styled header.
- `V1AppHeaderMobileComponent`: Mobile styled header.

## Implementation guide

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- V1AppHeaderDesktopComponent                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### V1AppHeaderDesktopComponent

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppHeaderDesktopComponent } from '@x/shared-ui-ng-app-header';
import { V1AppHeaderDesktop_Nav } from '@x/shared-ui-ng-app-header';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    V1DaylightComponent,
    TranslocoDirective,
    V1AppHeaderDesktopComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-app-header-desktop-v1
  [isAuthenticated]="true"
  [imgLogo]="$any((configFacade.dataConfigDep$ | async)?.assets?.logo)"
  [nav]="(configFacade.dataConfigDep$ | async)?.ui?.nav"
></x-app-header-desktop-v1>
```

```css
.e-header-desktop {
  --e-header-desktop--bg-color--gradient-a--light: var(
    --e-primary-color
  ) !important;
  --e-header-desktop--bg-color--gradient-b--light: var(
    --e-accent-color
  ) !important;
  --e-header-desktop--bg-color--gradient-a--dark: var(
    --e-primary-color
  ) !important;
  --e-header-desktop--bg-color--gradient-b--dark: var(
    --e-accent-color
  ) !important;

  --e-header-desktop--color--light: var(--e-day-lighter-color) !important;
  --e-header-desktop--color--dark: var(--e-day-lighter-color) !important;
}

.e-header-desktop__nav-link {
  --e-header-desktop__nav-link--active--bg-color--gradient-a--light: var(
      --e-night-darker-color
    ) / 0.2 !important;
  --e-header-desktop__nav-link--active--bg-color--gradient-b--light: var(
      --e-night-lighter-color
    ) / 0.2 !important;
  --e-header-desktop__nav-link--active--bg-color--gradient-a--dark: var(
      --e-night-darker-color
    ) / 0.2 !important;
  --e-header-desktop__nav-link--active--bg-color--gradient-b--dark: var(
      --e-night-darker-color
    ) / 0.2 !important;
}
```

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- V1AppHeaderMobileComponent                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### V1AppHeaderMobileComponent

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { V1DaylightComponent } from '@x/shared-ui-ng-daylight';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppHeaderMobileComponent } from '@x/shared-ui-ng-app-header';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    V1DaylightComponent,
    TranslocoDirective,
    V1AppHeaderMobileComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  onClickedGoBack() {
    console.log('onClickedGoBack');
  }

  onLayoutChange(layout: 'base' | 'inner') {
    console.log('onLayoutChange:', layout);
  }
}
```

```html
<x-app-header-mobile-v1
  [isAuthenticated]="true"
  [pageRouteName]="dashboard"
  [isPopOpened]="false"
  (clickedGoBack)="onClickedGoBack()"
  [(layout)]="onLayoutChange()"
></x-app-header-mobile-v1>
```

```css
.e-header-mobile {
  --e-header-mobile--bg-color--gradient-a--light: var(
    --e-day-lighter-color
  ) !important;
  --e-header-mobile--bg-color--gradient-b--light: var(--e-day-color) !important;
  --e-header-mobile--bg-color--gradient-a--dark: var(
    --e-night-lighter-color
  ) !important;
  --e-header-mobile--bg-color--gradient-b--dark: var(
    --e-night-color
  ) !important;

  --e-header-mobile--color--light: var(--e-night-color) !important;
  --e-header-mobile--color--dark: var(--e-day-color) !important;
}
```

## Important requirements

_None._
