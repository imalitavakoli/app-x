# shared-ui-ng-translations

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
  V1TranslationsComponent,
  V1_TRANSLATIONS_LANGS,
} from '@x/shared-ui-ng-translations';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoDirective,
    V1TranslationsComponent,
  ],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent {
  readonly configFacade = inject(V2ConfigFacade);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Inputs                                                                   */
  /* //////////////////////////////////////////////////////////////////////// */

  langs = V1_TRANSLATIONS_LANGS();

  /* //////////////////////////////////////////////////////////////////////// */
  /* Outputs                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  onSelected(cultureCode: string) {
    console.log('onSelected:', cultureCode);
  }
}
```

```html
<x-translations-v1
  default="sv-SE"
  [langs]="langs"
  (selected)="onSelected($event)"
>
</x-translations-v1>
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-ui-ng-translations` to execute the unit tests.
