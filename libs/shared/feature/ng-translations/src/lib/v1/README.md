# shared-feature-ng-translations

translations v1.

## Implementation guide

Here's a simple example of how to use the lib:

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1TranslationsFeaComponent } from '@x/shared-feature-ng-translations';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1TranslationsFeaComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * It will be emitted if there's any error.
   *
   * NOTE: It might be emitted multiple times, and each time with a different
   * error message.
   */
  onError(err: { key: string; value: string }) {
    console.log('An error occurred:', err.key);
  }
}
```

```html
<x-translations-fea-v1
  [showErrors]="true"
  (hasError)="onError($event)"
></x-translations-fea-v1>
```

## More

**Considerations before implementing this lib:**

You should NOT initialize this lib at all, if:

- User is NOT authenticated in the app (logged in).
- The `allLangs` method of Translations 'data-access' method is NOT already called.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-feature-ng-translations` to execute the unit tests.
