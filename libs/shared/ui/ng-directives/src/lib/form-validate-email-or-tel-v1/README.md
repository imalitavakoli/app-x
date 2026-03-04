# shared-ui-ng-directives

v1.

## Implementation guide

A template-driven form validator that accepts either a valid email address or a valid telephone number.

It dynamically switches the host input's `inputmode` attribute (`email` / `tel`) as the user types, giving mobile users the right virtual keyboard.

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

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-directives` to execute the unit tests.
