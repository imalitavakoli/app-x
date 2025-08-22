# shared-ui-ng-app-footer

v1.

This lib consists of the following globally exported components:

- `V1AppFooterDesktopComponent`: Desktop styled footer.
- `V1AppFooterMobileComponent`: Mobile styled footer.

## Implementation guide

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- V1AppFooterDesktopComponent                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### V1AppFooterDesktopComponent

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppFooterDesktopComponent } from '@x/shared-ui-ng-app-footer';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1AppFooterDesktopComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);
}
```

```html
<x-app-footer-desktop-v1
  [txtCompanyName]="
    $any((configFacade.dataConfigDep$ | async)?.ui?.footer?.txtCompanyName)
  "
  [txtCompanySite]="
    $any((configFacade.dataConfigDep$ | async)?.ui?.footer?.txtCompanySite)
  "
  [txtCompanySiteLink]="
    $any((configFacade.dataConfigDep$ | async)?.ui?.footer?.txtCompanySiteLink)
  "
  [txtCopyright]="
    $any((configFacade.dataConfigDep$ | async)?.ui?.footer?.txtCopyright)
  "
  [nav]="(configFacade.dataConfigDep$ | async)?.ui?.footer?.nav"
></x-app-footer-desktop-v1>
```

```css
.e-footer-desktop {
  --e-footer-desktop--bg-color--gradient-a--light: var(
    --e-primary-color
  ) !important;
  --e-footer-desktop--bg-color--gradient-b--light: var(
    --e-accent-color
  ) !important;
  --e-footer-desktop--bg-color--gradient-a--dark: var(
    --e-primary-color
  ) !important;
  --e-footer-desktop--bg-color--gradient-b--dark: var(
    --e-accent-color
  ) !important;

  --e-footer-desktop--color--light: var(--e-day-lighter-color) !important;
  --e-footer-desktop--color--dark: var(--e-day-lighter-color) !important;

  --e-footer-desktop--link-color--light: var(--e-day-color) !important;
  --e-footer-desktop--link-color--dark: var(--e-day-color) !important;
}
```

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- V1AppFooterMobileComponent                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### V1AppFooterMobileComponent

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppFooterMobileComponent } from '@x/shared-ui-ng-app-footer';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1AppFooterMobileComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Communication events                                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  _communicationEvents() {
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((action: V1Communication_Event) => {
        // `changeByUser` events.
        if (action.type === 'changeByUser') {
          if (action.name === '@V1AppFooterMobileComponent:ClickedNavItem') {
            // ...
          }
        }
      });
  }
}
```

```html
<x-app-footer-mobile-v1
  [isAuthenticated]="isAuthenticated"
  [nav]="(configFacade.dataConfigDep$ | async)?.ui?.nav"
></x-app-footer-mobile-v1>
```

```css
.e-footer-mobile {
  --e-footer-mobile--bg-color--gradient-a--light: var(
    --e-day-lighter-color
  ) !important;
  --e-footer-mobile--bg-color--gradient-b--light: var(--e-day-color) !important;
  --e-footer-mobile--bg-color--gradient-a--dark: var(
    --e-night-lighter-color
  ) !important;
  --e-footer-mobile--bg-color--gradient-b--dark: var(
    --e-night-color
  ) !important;

  --e-footer-mobile--color--light: var(--e-night-color) !important;
  --e-footer-mobile--color--dark: var(--e-day-color) !important;

  --e-footer-mobile--active-color--light: var(--e-primary-color) !important;
  --e-footer-mobile--active-color--dark: var(--e-primary-color) !important;
}
```

## Important requirements

_None._
