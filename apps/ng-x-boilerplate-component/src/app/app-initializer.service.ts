/**
 * @file Here's the class that is going to be provided in `app.config.ts` file
 * (as `APP_INITIALIZER`) as soon as the app gets initialized.
 */

import { Injectable, inject, isDevMode } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

import { V1BaseAppInitService } from '@x/shared-util-ng-bases';
import { v1LocalWebcomClearAll } from '@x/shared-util-local-storage';
import { V1HtmlEditorService } from '@x/shared-util-ng-services';
import {
  V2Config_MapDataBuild,
  V2Config_MapDep,
  V2Config_MapFirebase,
} from '@x/shared-map-ng-config';
import { mapConfigExtra } from '@x/ng-x-boilerplate-component-map-config';

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
 * @extends {AppInitializerBaseService}
 */
@Injectable({ providedIn: 'root' })
export class AppInitializerService extends V1BaseAppInitService {
  /* General //////////////////////////////////////////////////////////////// */

  // protected readonly _router = inject(Router); // Introduced in Base.
  // protected readonly _langService = inject(TranslocoService); // Introduced in Base.

  protected override readonly _mapConfigExtra = mapConfigExtra; // Introduced in Base.
  protected override readonly _assetsFolder = 'x-assets'; // Introduced in Base.
  protected override readonly _loadDataBuild = false; // Introduced in Base.

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
    // Right here at the initialization phase let's clear the entire web-com
    // related key in LocalStorage. Because web-coms may have already loaded
    // and stored some stuff in LocalStorage in user's previous app visit...
    // But now that we're initializing the app (user is re-visitng the app),
    // the old LocalStorage items are useless and we need to clear them! New
    // items will be stored again by the Initializer web-com :)
    v1LocalWebcomClearAll();

    return super.init(environment);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Final operations BEFORE initialization                        */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _initSucceeded(resolve: (value: unknown) => void) {
    resolve(true);
  }

  /**
   * This function is called when the app initialization is failed. i.e.,
   * config (DEP) + one of the other config JSON files are NOT loaded, or
   * the app's language is NOT loaded successfully.
   *
   * NOTE: When the app initialization is failed, we do nothing! Because it's
   * the 'initializer' component responsibility to understand the failure and
   * show an error message to the user.
   *
   * @protected
   * @param {(value: unknown) => void} resolve
   * @returns {void) => void}
   */
  protected override _initFailed(resolve: (value: unknown) => void) {
    resolve(true);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Configurations                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /** @inheritdoc */
  protected override _configDepLoaded(data: V2Config_MapDep) {
    // Add some codes to HTML.
    this._addDepStyles();
    this._addFonts(data.assets.fontBase, data.assets.fontBold);
    this._addMarkerIoCode(data.fun.feat.markerIo?.projectId);
  }

  /** @inheritdoc */
  protected override _configDepAfterAuth(
    data: V2Config_MapDep,
    userId: number,
  ) {
    super._configDepAfterAuth(data, userId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Config DEP: More settings                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _addDepStyles() {
    const cacheBuster = Math.random().toString(36).substring(7);
    const depStyles = `
      <link rel="stylesheet" href="./x-assets/DEP_style.css?cache=${cacheBuster}" type="text/css">
      `;
    V1HtmlEditorService.insertContent(depStyles);
  }
}
