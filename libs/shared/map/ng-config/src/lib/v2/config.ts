import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  V2Config_ApiDataBuild,
  V2Config_ApiFirebase,
  V2Config_ApiDep,
  V2Config_MapDep,
  V2Config_MapUiNav,
} from './config.interfaces';
import { v1MiscFixPath } from '@x/shared-util-formatters';

import { uiAuthConfig } from './config.mocks';
import { libXProfileImageInjectAssets } from './config-lib-x-profile-image';
import {
  libXProfileInfoInjectAssets,
  libXProfileInfoInjectV1Inputs,
} from './config-lib-x-profile-info';

/**
 * Here we load the config files of the app and modify them.
 *
 * @export
 * @class Config
 * @typedef {Config}
 */
@Injectable({
  providedIn: 'root',
})
export class V2Config {
  private readonly _http = inject(HttpClient);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Load Config: DEP                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Load DEP configuration.
   * Where the URL is coming from? Environment object.
   *
   * @param {string} url
   * @param {?<T, U, V>(d: T, a: U) => V} [extraMapFun]
   * @param {string} [assetsFolderName='assets']
   * @returns {Observable<V2Config_MapDep>}
   */
  loadConfigDep(
    url: string,
    extraMapFun?: <T, U, V>(d: T, a: U) => V,
    assetsFolderName = 'assets',
  ): Observable<V2Config_MapDep> {
    // Let's add a cache buster to the url
    const cacheBusterUrl = url + '?t=' + new Date().getTime();

    // Let's send the request
    return this._http.get<V2Config_ApiDep>(cacheBusterUrl).pipe(
      map((data) => {
        let proxifiedData = this._mapLoadConfigDep(data, assetsFolderName);
        if (extraMapFun) {
          proxifiedData = extraMapFun(proxifiedData, assetsFolderName);
        }

        return proxifiedData;
      }),
      catchError((err) => {
        const error = err.message || err;

        // NOTE: We should NOT log the error, if we are in SSR environment.
        if (typeof document !== 'undefined') {
          console.error('@Config/loadConfigDep:', error);
        }

        return throwError(() => error);
      }),
    );
  }

  private _mapLoadConfigDep(
    data: V2Config_ApiDep,
    assetsFolderName: string,
  ): V2Config_MapDep {
    // Let's save the response in the way we like it to be.
    const map: V2Config_MapDep = {
      assets: {
        ...this._injectAssets(data?.assets, assetsFolderName),

        // 'feature' libs assets paths.
        ...libXProfileImageInjectAssets(data?.assets, assetsFolderName),
        ...libXProfileInfoInjectAssets(data?.assets, assetsFolderName),
      },

      general: {
        baseUrl: v1MiscFixPath(data.general.environment.items.base_url),
        clientId: +data.general.environment.items.client_id,
        appName: data.general.app_name || '',
      },

      fun: {
        configs: {
          googleAnalyticsMeasurementId:
            data.fun?.configs?.google_analytics_measurement_id || '',
          firebaseIntegration: data.fun?.configs?.firebase_integration || false,
          defaultLang: data.fun.configs.default_lang,
          defaultCurrencyCode: data.fun.configs.default_currency_code,
        } as V2Config_MapDep['fun']['configs'],

        auth: this._injectFunAuth(data.fun?.auth),

        feat: this._injectFunFeat(data.fun?.feat),
      },

      ui: {
        nav: this._injectUiNav(data.ui?.nav),

        footer: {
          txtCompanyName: data.ui?.footer?.items?.txt_company_name || '',
          txtCompanySite: data.ui?.footer?.items?.txt_company_site || '',
          txtCompanySiteLink:
            data.ui?.footer?.items?.txt_company_site_link || '',

          ...this._injectUiFooterMore(data.ui?.footer?.items),
        },

        authConfig: this._injectUiAuthConfig(data.ui?.welcome_screen),

        dashboardFuns: this._injectUiDashboardFuns(data.ui?.home_view),
        accountNav: this._injectUiAccountNav(data.ui?.acc_view),
      },

      // 'feature' libs DEP inputs.
      libs: {
        xProfileInfoV1: libXProfileInfoInjectV1Inputs(data.libs),
      },
    };

    // Let's add any other property that we didn't map at above codes.
    if (data.extra) {
      map.extra = data.extra;
    }

    // Let's return the final object
    return map;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Load config: Firebase                                                    */
  /* //////////////////////////////////////////////////////////////////////// */

  loadConfigFirebase(url: string): Observable<V2Config_ApiFirebase> {
    // Let's add a cache buster to the url
    const cacheBusterUrl = url + '?t=' + new Date().getTime();

    // Let's send the request
    return this._http.get<V2Config_ApiFirebase>(cacheBusterUrl).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        const error = err.message || err;

        // NOTE: We should NOT log the error, if we are in SSR environment.
        if (typeof document !== 'undefined') {
          console.error('@Config/loadConfigFirebase:', error);
        }

        return throwError(() => error);
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Load data: Build                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  loadDataBuild(url: string): Observable<V2Config_ApiDataBuild> {
    // Let's add a cache buster to the url
    const cacheBusterUrl = url + '?t=' + new Date().getTime();

    // Let's send the request
    return this._http.get<V2Config_ApiDataBuild>(cacheBusterUrl).pipe(
      map((data) => {
        return data;
      }),
      catchError((err) => {
        const error = err.message || err;

        // NOTE: We should NOT log the error, if we are in SSR environment.
        if (typeof document !== 'undefined') {
          console.error('@Config/loadDataBuild:', error);
        }

        return throwError(() => error);
      }),
    );
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Useful functions                                                         */
  /* //////////////////////////////////////////////////////////////////////// */

  private _injectAssets(
    data: V2Config_ApiDep['assets'],
    assetsFolderName: string,
  ) {
    // Defaults.
    const map: Partial<V2Config_MapDep['assets']> = {
      fontBase: `./${assetsFolderName}/fonts/E-Base.ttf`,
      fontBold: `./${assetsFolderName}/fonts/E-Bold.ttf`,

      logo: `./${assetsFolderName}/images/logo.webp`,
      logoInDay: `./${assetsFolderName}/images/logo_in-day.webp`,
      logoInNight: `./${assetsFolderName}/images/logo_in-night.webp`,

      logoInDesktop: `./${assetsFolderName}/images/logo_in-desktop.webp`,
      logoInMobile: `./${assetsFolderName}/images/logo_in-mobile.webp`,

      gfxCelebration: `./${assetsFolderName}/images/anims/celebration.json`,
      gfxEmail: `./${assetsFolderName}/images/anims/email.json`,
      gfxEmpty: `./${assetsFolderName}/images/anims/empty.json`,
      gfxError: `./${assetsFolderName}/images/anims/error.json`,
      gfxNotfound: `./${assetsFolderName}/images/anims/not-found.json`,
      gfxSuccess: `./${assetsFolderName}/images/anims/success.json`,

      thisAuthImgBg: `./${assetsFolderName}/images/this/auth/img-login-bg.jpg`,
    };

    // Mapping.
    if (data) {
      // Fonts.
      if (data.font_base && data.font_base !== '') {
        map.fontBase = v1MiscFixPath(data.font_base);
      }
      if (data.font_bold && data.font_bold !== '') {
        map.fontBold = v1MiscFixPath(data.font_bold);
      }

      // Logos.
      if (data.logo && data.logo !== '') {
        map.logo = v1MiscFixPath(data.logo);
      }
      if (data.logo_in_day && data.logo_in_day !== '') {
        map.logoInDay = v1MiscFixPath(data.logo_in_day);
      }
      if (data.logo_in_night && data.logo_in_night !== '') {
        map.logoInNight = v1MiscFixPath(data.logo_in_night);
      }
      if (data.logo_in_desktop && data.logo_in_desktop !== '') {
        map.logoInDesktop = v1MiscFixPath(data.logo_in_desktop);
      }
      if (data.logo_in_mobile && data.logo_in_mobile !== '') {
        map.logoInMobile = v1MiscFixPath(data.logo_in_mobile);
      }

      // Animations.
      if (data.gfx_celebration && data.gfx_celebration !== '') {
        map.gfxCelebration = v1MiscFixPath(data.gfx_celebration);
      }
      if (data.gfx_email && data.gfx_email !== '') {
        map.gfxEmail = v1MiscFixPath(data.gfx_email);
      }
      if (data.gfx_empty && data.gfx_empty !== '') {
        map.gfxEmpty = v1MiscFixPath(data.gfx_empty);
      }
      if (data.gfx_error && data.gfx_error !== '') {
        map.gfxError = v1MiscFixPath(data.gfx_error);
      }
      if (data.gfx_notfound && data.gfx_notfound !== '') {
        map.gfxNotfound = v1MiscFixPath(data.gfx_notfound);
      }
      if (data.gfx_success && data.gfx_success !== '') {
        map.gfxSuccess = v1MiscFixPath(data.gfx_success);
      }

      // Auth.
      if (data.this_auth_img_bg && data.this_auth_img_bg !== '') {
        map.thisAuthImgBg = v1MiscFixPath(data.this_auth_img_bg);
      }
    }

    return map as V2Config_MapDep['assets'];
  }

  private _injectFunAuth(data: V2Config_ApiDep['fun']['auth']) {
    if (!data) return {}; // `data` might not be available in Webcom app.
    const map: V2Config_MapDep['fun']['auth'] = {};

    for (const item of data) {
      if (item.AUTH_METHOD_MAGIC_LINK) {
        map.hasAuthMagic = true;
      }
      if (item.AUTH_METHOD_BANK_ID) {
        map.hasAuthBankid = true;
      }
    }

    return map;
  }

  private _injectFunFeat(data: V2Config_ApiDep['fun']['feat']) {
    if (!data) return {}; // `data` might not be available in Webcom app.
    const map: V2Config_MapDep['fun']['feat'] = {};

    for (const item of data) {
      if (item.daylight_switch) {
        map.daylightSwitch = true;
      }

      // markerIo.
      if (item.marker_io && item.items?.project_id) {
        map.markerIo = {
          projectId: item.items.project_id,
        };
      }

      // apptentive.
      if (item.apptentive) {
        if (
          item.items?.signature ||
          item.items?.key ||
          item.items?.project_id
        ) {
          map.apptentive = {};
          if (item.items?.signature)
            map.apptentive.signature = item.items.signature;
          if (item.items?.key) map.apptentive.key = item.items.key;
          if (item.items?.project_id)
            map.apptentive.projectId = item.items.project_id;
        }
      }
    }

    return map;
  }

  private _injectUiNav(data: V2Config_ApiDep['ui']['nav']) {
    if (!data) return []; // `data` might not be available in Webcom app.
    const map: V2Config_MapDep['ui']['nav'] = [];

    for (const item of data) {
      let uiNavMapped: V2Config_MapUiNav = <V2Config_MapUiNav>{};
      if (item.TABBAR_OPTIONS_DASHBOARD) {
        uiNavMapped = {
          name: item.TABBAR_OPTIONS_DASHBOARD,
          type: 'dashboard',
        };
      }
      if (item.TABBAR_OPTIONS_X_USERS) {
        uiNavMapped = { name: item.TABBAR_OPTIONS_X_USERS, type: 'x-users' };
      }
      if (item.TABBAR_OPTIONS_TEST) {
        uiNavMapped = { name: item.TABBAR_OPTIONS_TEST, type: 'test' };
      }
      if (item.TABBAR_OPTIONS_ACCOUNT) {
        uiNavMapped = { name: item.TABBAR_OPTIONS_ACCOUNT, type: 'account' };
      }

      // According to the above codes, our mapped item (`uiNavMapped`) may not
      // have any properties, so we should check if it has any, and only then
      // continue with the mapping.
      if (Object.entries(uiNavMapped).length && item.items.link !== '') {
        uiNavMapped.link = item.items.link;
        uiNavMapped.isLinkDirect = item.items.load_link_directly;

        switch (item.items.browser_type) {
          case 'BROWSER_TYPE_DEFAULT_BROWSER':
            uiNavMapped.browserType = 'external';
            break;
          case 'BROWSER_TYPE_INTERNAL_BROWSER':
            uiNavMapped.browserType = 'cap-inappbrowser';
            break;
          case 'BROWSER_TYPE_WEBVIEW':
            uiNavMapped.browserType = 'cap-browser';
            break;
        }
      }

      // If our mapped item (`uiNavMapped`) is not empty, then we push it to the
      // map array that we wanna return.
      if (Object.entries(uiNavMapped).length) {
        map.push(uiNavMapped);
      }
    }

    return map;
  }

  private _injectUiFooterMore(data: V2Config_ApiDep['ui']['footer']['items']) {
    if (!data) return {}; // `data` might not be available in Webcom app.
    const map: Partial<V2Config_MapDep['ui']['footer']> = {};

    // Map `txt_copyright`.
    if (data.txt_copyright && data.txt_copyright !== '') {
      map.txtCopyright = data.txt_copyright;
    }

    // Map `nav`.
    if (data.nav) {
      map.nav = data.nav.map((item) => {
        const [[key, value]] = Object.entries(item);
        return {
          name: key,
          link: value,
        };
      });
    }

    return map;
  }

  private _injectUiAuthConfig(data: V2Config_ApiDep['ui']['welcome_screen']) {
    if (!data) return uiAuthConfig; // `data` might not be available in web-component related apps.

    // Helper function to map `type`.
    const setType = () => {
      switch (data.type.type) {
        case 'WELCOME_SCREEN_CLASSIC':
          return 'classic';
        default:
          return 'simple';
      }
    };

    // Helper function to map `clientPhone`.
    const setClientPhone = () => {
      if (data.type.items.client_phone) {
        return { clientPhone: data.type.items.client_phone };
      } else {
        return {};
      }
    };

    // Helper function to map `clientEmail`.
    const setClientEmail = () => {
      if (data.type.items.client_email) {
        return { clientEmail: data.type.items.client_email };
      } else {
        return {};
      }
    };

    // Helper function to map `clientAddress`.
    const setClientAddress = () => {
      if (data.type.items.client_address) {
        return { clientAddress: data.type.items.client_address };
      } else {
        return {};
      }
    };

    const map: V2Config_MapDep['ui']['authConfig'] = {
      type: setType(),
      ...setClientPhone(),
      ...setClientEmail(),
      ...setClientAddress(),
    };

    return map;
  }

  private _injectUiDashboardFuns(data: V2Config_ApiDep['ui']['home_view']) {
    if (!data) return []; // `data` might not be available in Webcom app.
    const map: V2Config_MapDep['ui']['dashboardFuns'] = [];

    for (const item of data) {
      if (item.HOME_WIDGET_X_PROFILE_IMAGE) {
        map.push({ showXProfileImage: true });
      }
      if (item.HOME_WIDGET_X_PROFILE_INFO) {
        map.push({ showXProfileInfo: true });
      }
    }

    return map;
  }

  private _injectUiAccountNav(data: V2Config_ApiDep['ui']['acc_view']) {
    if (!data) return []; // `data` might not be available in Webcom app.
    const map: V2Config_MapDep['ui']['accountNav'] = [];

    for (const item of data) {
      if (item.ITEM_HEADING) {
        map.push({ type: 'heading', name: item.ITEM_HEADING });
      }
      if (item.ITEM_SPACE) {
        map.push({ type: 'space', name: item.ITEM_SPACE });
      }
      if (item.ITEM_LOGOUT) {
        map.push({ type: 'logout', name: item.ITEM_LOGOUT });
      }
      if (item.ITEM_APP_VERSION) {
        map.push({ type: 'appVersion', name: item.ITEM_APP_VERSION });
      }

      if (item.ITEM_WITH_URL) {
        map.push({
          type: 'itemExternalLink',
          name: item.ITEM_WITH_URL,
          link: item.items?.url,
        });
      }
      if (item.ITEM_GENERAL) {
        map.push({ type: 'itemGeneral', name: item.ITEM_GENERAL });
      }
      if (item.ITEM_LANGUAGE) {
        map.push({ type: 'itemLanguage', name: item.ITEM_LANGUAGE });
      }
    }

    return map;
  }
}
