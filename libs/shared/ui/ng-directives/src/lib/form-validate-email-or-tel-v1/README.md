# shared-ui-ng-directives

v1.

## Implementation guide

A template-driven form validator that accepts either a valid email address or a valid telephone number. Telephone validation uses `libphonenumber-js` — values must be at least 11 characters long and pass `isValidPhoneNumber`.

It dynamically switches the host input's `inputmode` attribute (`email` / `tel`) as the user types, giving mobile users the right virtual keyboard. An optional `forceEmailInputMode` input can lock the `inputmode` to `"email"`, bypassing the automatic detection.

It also syncs the validation result to the native Constraint Validation API via `setCustomValidity()`, so CSS pseudo-classes (`:valid` / `:invalid`) react live alongside Angular's `ng-valid` / `ng-invalid` classes.

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@eliq/shared-data-access-ng-config';
import { V1FormValidateEmailOrTelDirective } from '@eliq/shared-ui-ng-directives';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1FormValidateEmailOrTelDirective,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {}
```

```html
<input [xFormValidateEmailOrTelV1]="true" ngModel name="input" />
```

Force email keyboard on mobile:

```html
<input
  [xFormValidateEmailOrTelV1]="true"
  [forceEmailInputMode]="true"
  ngModel
  name="input"
/>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-directives` to execute the unit tests.
