# shared-ui-ng-directives

v1.

## Implementation guide

Default status of the directive when it is initialzied:

- It's close. i.e., the `closeClass` CSS class is added on the element.
- There's no Closer, or Target elements defined.
- `isSelfToggleEnable` is true. i.e., if user clicks the element itself, it toggles CSS classes on itself (and also Target, if it's defined), and dispatches `statusChanged` event.
- `isDocCloseEnable` is true. i.e., if user clicks outside of the element (and also target, it it's defined), it closes the toggle (adds close CSS classes to the element and target, and removed open CSS classes from them), and dispatches `statusChanged` event.

**Note!** If `isSelfToggleEnable` and `isDocCloseEnable` options are true, and the button that likes to toggle your target has child elements (e.g., it's something like `<button xToggleMeV1 [target]="collapse"><i class="bi bi-list pointer-events-none"></i></button>`) always remember to apply `pointer-events: none;` CSS style on the child elements of the button. Why? Because when user clicks such buttons, as the button element itself doesn't have any direct text content, then user is actually clicking the child elements... So The toggle won't work properly.

**Note!** If the element itself is inside of the Target, then you can just set `isDocCloseEnable` to false, to let the toggle happen ONLY IF user clicks the element itself and NOT its child elements. This is mostly useful for creating popups... In such cases, the Target is the popup holder (which gets visible/invisible by CSS classes), and the element is the child of the holder (it's usually a fader which covers the whole screen). Now the element has a child itself (it's usually the popup content), so if user clicks the popup content, nothing happens... But if she clicks the fader (the toggle element itself), then CSS classes will be toggles on the whole popup holder.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1ToggleMeDirective } from '@x/shared-ui-ng-directives';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1ToggleMeDirective,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
<button
  xToggleMeV1
  [target]="mytarget"
  [isOpen]="true"
  targetCloseClass="hidden"
  (statusChanged)="onStatusChanged($event)"
>
  Click me
</button>

<div #mytarget>I am target</div>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-directives` to execute the unit tests.
