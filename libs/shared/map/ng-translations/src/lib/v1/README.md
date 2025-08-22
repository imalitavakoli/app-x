# shared-map-ng-translations

translations v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-translations' lib.

Here's an example of how to test the lib:

```ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';

import { V1Translations } from '@x/shared-map-ng-translations';

@Component({
  selector: 'x-test',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  private readonly _proxy = inject(V1Translations);
  private readonly _baseUrl = '/v3';

  ngOnInit() {
    // Get translations
    this._proxy
      .getTranslations(this._baseUrl, 14934656510, 'en-GB', ['generic_errors'])
      .pipe(
        take(1),
        map((data) => {
          console.log('getTranslations:', data);
        }),
      )
      .subscribe();

    // Get all logged user's available languages
    this._proxy
      .getAllLangs(this._baseUrl)
      .pipe(
        take(1),
        map((data) => {
          console.log('getAllLangs:', data);
        }),
      )
      .subscribe();

    // Get currently logged in user's selected language
    this._proxy
      .getSelectedLang(this._baseUrl, 11318242)
      .pipe(
        take(1),
        map((data) => {
          console.log('getSelectedLang:', data);
        }),
      )
      .subscribe();

    // Set a new language for the logged in user
    // this._proxy
    // .patchSelectedLang(
    //   this._baseUrl,
    //   11318242,
    //   'en-GB',
    // )
    // .pipe(
    //   take(1),
    //   map((data) => {
    //     console.log('patchSelectedLang:', data);
    //   }),
    // )
    // .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-translations` to execute the unit tests.
