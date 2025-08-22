# shared-ui-ng-popup

v1.

## Implementation guide

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Simple usage                                                            -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### Simple usage

```ts
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { V1CommunicationService } from '@x/shared-util-ng-services';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule, RouterModule, V1PopupComponent],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  private _communicationService = inject(V1CommunicationService);
  showPopup = false;
  isPopOpened = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    this._communicationEvents();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Communication events                                                     */
  /* //////////////////////////////////////////////////////////////////////// */

  _communicationEvents() {
    this._communicationService.changeEmitted$
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((action: V1Communication_Event) => {
        // `changeByUser` events.
        if (action.type === 'changeByUser') {
          if (action.name === '@V1PopupComponent:Opened') {
            setTimeout(() => {
              this.isPopOpened = true;
            });
          }
          if (action.name === '@V1PopupComponent:Closed') {
            setTimeout(() => {
              this.isPopOpened = false;
            });
          }
        }
      });
  }
}
```

```html
<button
  class="e-btn bg-eprimary hover:bg-eprimary-darker text-eday-lighter"
  (click)="showPopup = true"
>
  Open popup
</button>

<x-popup-v1
  [isBgClosingEnabled]="false"
  [isHeadEnable]="true"
  [isFootEnable]="true"
  [isOpen]="showPopup"
  (closed)="showPopup = false"
>
  <ng-container slot="head">
    Title
    <button (click)="showPopup = false">X</button>
  </ng-container>
  <ng-container slot="body">Something is here.</ng-container>
  <ng-container slot="foot">Footer</ng-container>
</x-popup-v1>
```

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Error usage                                                             -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### Error usage

```html
<x-popup-v1
  *ngIf="myFacade.error$ | async"
  [isHeadEnable]="true"
  [isOpen]="true"
>
  <div slot="head">
    <i class="bi bi-exclamation-triangle-fill mr-2"></i>
    <span class="font-semibold">Please try again!</span>
  </div>

  <div slot="body">
    <ng-lottie
      width="100%"
      height="180px"
      containerClass="e-ani pb-6"
      [options]="{ path: './assets/images/anims/error.json', loop: false }"
    ></ng-lottie>
    <p class="p text-center text-2xl">
      Something went wrong!
      <br />
      Please try again.
    </p>
  </div>
</x-popup-v1>
```

<!-- /////////////////////////////////////////////////////////////////////// -->
<!-- Holding a child page                                                    -->
<!-- /////////////////////////////////////////////////////////////////////// -->

### Holding a child page

```ts
// Parent Component
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { of, switchMap, take } from 'rxjs';

@Component({
  selector: 'x-core',
  standalone: true,
  imports: [CommonModule, RouterModule, V1PopupComponent],
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  showPopup = false;

  ngOnInit(): void {
    // Understand if we are on the page itself, or in a child route. Because if
    // that's the case, we must show our popup! Why? Our child routes are inside
    // of the popup!
    this._router.events
      .pipe(
        take(1),
        switchMap(() => of(this._route.children.length > 0)),
      )
      .subscribe((isChildActive) => {
        if (isChildActive) this.showPopup = true;
      });
  }

  onPopupClosed() {
    // Close the popup, and navigate to the page itself.
    this.showPopup = false;
    this._router.navigate(['parent']);
  }
}
```

```html
<!-- Parent Template -->
<button
  class="e-btn bg-eprimary hover:bg-eprimary-darker text-eday-lighter"
  (click)="showPopup = true"
  [routerLink]="['child']"
>
  Open popup
</button>

<x-popup-v1
  [isClassicEnable]="true"
  [isOpen]="showPopup"
  (closed)="onPopupClosed()"
>
  <router-outlet slot="classic"></router-outlet>
</x-popup-v1>

<!-- Child Template -->
<section
  class="flex max-h-[calc(100vh-8rem)] min-w-[250px] flex-col md:w-[650px]"
>
  Content of the child page.
</section>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-popup` to execute the unit tests.
