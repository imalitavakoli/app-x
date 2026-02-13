# shared-map-ng-x-profile-info

x-profile-info v1.

## Implementation guide

We use it in the effects of 'shared-data-access-ng-x-profile-info' lib.

Here's an example of how to test the lib:

```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, take } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1XProfileInfo } from '@x/shared-map-ng-x-profile-info';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

/**
 * NOTE: When calling the lib's methods, we assume the following:
 *
 * The following properties are defined as the following for the app that is being served:
 * - In `apps/{app-name}/src/proxy.conf.json`:
 *   - For all API calls, `target = https://client-x-api.x.com`.
 * - In `apps/{app-name}/{assets-folder}/DEP_config.development.json`:
 *   - `general.environment.environment.items.base_url = /v1`.
 *   - `general.environment.environment.items.client_id = 1234567890`.
 *
 * For authenticated API requests, we assume that the following user is already logged in:
 * - https://admin.x.com/admin/users/123456
 *
 * @export
 * @class V1TestPageComponent
 * @typedef {V1TestPageComponent}
 */
@Component({
  selector: 'x-test-page-v1',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoDirective],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class V1TestPageComponent implements OnInit {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _proxy = inject(V1XProfileInfo);
  private readonly _baseUrl = '/v1';

  ngOnInit() {
    // Get data
    this._proxy
      .getData(this._baseUrl, 123)
      .pipe(
        take(1),
        map((data) => {
          console.log('getData:', data);
        }),
      )
      .subscribe();
  }
}
```

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-x-profile-info` to execute the unit tests.
