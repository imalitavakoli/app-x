/**
 * @file Here's the class that is going to be provided in `app.config.ts` file
 * (as `APP_INITIALIZER`) as soon as the app gets initialized.
 */

import { Injectable, inject, isDevMode } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

import { V1BaseAppInitService } from '@x/shared-util-ng-bases';
import { V1HtmlEditorService } from '@x/shared-util-ng-services';
import {
  V2Config_MapDataBuild,
  V2Config_MapDep,
  V2Config_MapFirebase,
} from '@x/shared-map-ng-config';
import { mapConfigExtra } from '@x/ng-x-boilerplate-desktop-map-config';

import { environment } from '../environments/environment';

/**
 * This is the app's initializer service! Its responsibility is to load all of
 * the app's required assets before the app starts!
 *
 * NOTE: You may see that we have overridden some of the variables or functions
 * from the Base class, ALTHOUGH we didn't change them! So why is that? We have
 * done this, because the Base class is very similar among other apps that we
 * have in our workspace. So whenever we update the Base class in the a
 * Boilerplate app, we immediately copy-paste the very same Base class for
 * (almost) all of the other apps (including this app). But because we may need
 * to slightly change some stuff for it, specifically for this app, we override
 * those changes here in this Child class, so that we won't forget about the
 * changes that this app's initializer service has compared to the copied
 * Boilerplate's initializer service.
 *
 * @export
 * @class AppInitializerService
 * @typedef {AppInitializerService}
 * @extends {V1BaseAppInitService}
 */
@Injectable({ providedIn: 'root' })
export class AppInitializerService extends V1BaseAppInitService {
  /* General //////////////////////////////////////////////////////////////// */

  // protected readonly _router = inject(Router); // Introduced in Base.
  // protected readonly _langService = inject(TranslocoService); // Introduced in Base.

  protected override readonly _mapConfigExtra = mapConfigExtra; // Introduced in Base.
  // protected readonly _assetsFolder = 'assets'; // Introduced in Base.
  // protected readonly _loadDataBuild = true; // Introduced in Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * NOTE: This is an inherited service! So no need to do anything here in
   * most cases! If app could load all of its required assets, then
   * `_initSucceeded` function is called, otherwise `_initFailed` function is
   * called.
   *
   * @inheritdoc
   */
  override init() {
    return super.init(environment);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Final operations BEFORE initialization                        */
  /* //////////////////////////////////////////////////////////////////////// */

  /** @inheritdoc */
  protected override _initSucceeded(resolve: (value: unknown) => void) {
    super._initSucceeded(resolve);
  }

  /** @inheritdoc */
  protected override _initFailed(resolve: (value: unknown) => void) {
    super._initFailed(resolve);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Configurations                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /** @inheritdoc */
  protected override _configDepLoaded(data: V2Config_MapDep) {
    super._configDepLoaded(data);
  }

  /** @inheritdoc */
  protected override _configDepAfterAuth(
    data: V2Config_MapDep,
    userId: number,
  ) {
    super._configDepAfterAuth(data, userId);
  }
}
