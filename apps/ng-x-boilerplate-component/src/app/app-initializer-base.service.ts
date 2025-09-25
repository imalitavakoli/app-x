import { Injectable, inject, isDevMode } from '@angular/core';
import {
  TranslocoService,
  AvailableLangs,
  LangDefinition,
  Translation,
} from '@jsverse/transloco';
import { Router } from '@angular/router';
import { asapScheduler, exhaustMap, of, skip, take } from 'rxjs';

import { v1LanguageGetCode } from '@x/shared-util-formatters';
import { V1HtmlEditorService } from '@x/shared-util-ng-services';
import {
  V2Config_MapDataBuild,
  V2Config_MapDep,
  V2Config_MapFirebase,
} from '@x/shared-map-ng-config';
import { mapConfigExtra } from '@x/ng-x-boilerplate-component-map-config';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AuthFacade } from '@x/shared-data-access-ng-auth';
import { V1TranslationsFacade } from '@x/shared-data-access-ng-translations';

import { environment } from '../environments/environment';
import { HaltedState } from './app.interfaces';

/**
 * This is the app's initializer service! Its responsibility is to load all of
 * the app's required assets before the app starts!
 *
 * @export
 * @class AppInitializerBaseService
 * @typedef {AppInitializerBaseService}
 */
@Injectable({ providedIn: 'root' })
export class AppInitializerBaseService {
  /* General //////////////////////////////////////////////////////////////// */

  protected readonly _router = inject(Router);
  protected readonly _langService = inject(TranslocoService);

  private readonly _configFacade = inject(V2ConfigFacade);
  private readonly _authFacade = inject(V1AuthFacade);
  private readonly _translationsFacade = inject(V1TranslationsFacade);

  /** App's DEP config `extra` property mapping function in the 'map' lib of the app. */
  protected readonly _mapConfigExtra = mapConfigExtra;

  /** App's assets folder name. */
  protected readonly _assetsFolder = 'x-assets';

  /** Whether to load data (Build) JSON file or not (set to true, if app already has such file). */
  protected readonly _loadDataBuild = false;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Here's what we do step by step to make sure that the app can get
   * initialized successfully:
   * 1. Try to load configs:
   *  - If we couldn't, the app initialization simply fails.
   *  - If we could, we continue...
   * 2. Now we check if the user is already login:
   *  - If she is not, we simply try to load the default language for the app.
   *  - If she is, we fetch the user's already selected lang from server, and
   *    then try to load the user's selected language for the app.
   * 3. If we couldn't load the language file, again the app initialization
   * simply fails.
   *
   * @returns {() => any}
   */
  init() {
    // Set required variables.
    let numOfSecondaryConfigsToLoad = 0;
    let configDep: V2Config_MapDep;
    let configFirebase: V2Config_MapFirebase;
    let dataBuild: V2Config_MapDataBuild;
    let baseUrl: string;
    let clientId: number;
    let defaultLang: string;

    // Helper function to load config (DEP).
    const loadConfigDep = () => {
      this._configFacade.loadConfigDep(
        environment.config_dep,
        this._mapConfigExtra as <T, U, V>(d: T, a: U) => V,
        this._assetsFolder,
      );
    };

    // Helper function to load config (Firebase).
    const loadConfigFirebase = (shallLoad: boolean) => {
      if (!shallLoad) return;
      this._configFacade.loadConfigFirebase(environment.config_firebase);
      numOfSecondaryConfigsToLoad++;
    };

    // Helper function to load data (Build).
    const loadDataBuild = (shallLoad: boolean) => {
      if (!shallLoad) return;
      this._configFacade.loadDataBuild('./x-assets/DEP_buildId.json');
      numOfSecondaryConfigsToLoad++;
    };

    // Helper function to check if config (DEP) loaded successfully or not.
    const checkConfigDep = (data: V2Config_MapDep | undefined) => {
      // If data (DEP) was NOT truthy, just return.
      if (!data) {
        return of({ haltedStep: 'config' } as HaltedState).pipe(take(1));
      }
      // If data (DEP) was truthy, save some of its properties for later use.
      configDep = data;
      baseUrl = configDep.general.baseUrl;
      clientId = configDep.general.clientId;
      defaultLang = configDep.fun.configs.defaultLang || 'en-GB';
      // Do more settings, now that data (DEP) is loaded.
      this._configDepLoaded(configDep);
      return null;
    };

    // Helper function to check if config (Firebase) loaded successfully or not.
    const checkConfigFirebase = (
      shallBeLoaded: boolean,
      data: V2Config_MapFirebase | undefined,
    ) => {
      if (!shallBeLoaded) return null;
      // If data (Firebase) was NOT truthy, just return.
      if (!data) {
        return of({ haltedStep: 'config' } as HaltedState).pipe(take(1));
      }
      // If data (Firebase) was truthy, save some of its properties for later use.
      configFirebase = data;
      // Do more settings, now that data (Firebase) is loaded.
      this._configFirebaseLoaded(configFirebase);
      return null;
    };

    // Helper function to check if data (Build) loaded successfully or not.
    const checkDataBuild = (
      shallBeLoaded: boolean,
      data: V2Config_MapDataBuild | undefined,
    ) => {
      if (!shallBeLoaded) return null;
      // If data (Build) was NOT truthy, just return.
      if (!data) {
        return of({ haltedStep: 'config' } as HaltedState).pipe(take(1));
      }
      // If data (Build) was truthy, save some of its properties for later use.
      dataBuild = data;
      // Do more settings, now that data (Build) is loaded.
      this._dataBuildLoaded(dataBuild);
      return null;
    };

    // Helper function to set more settings after user is login.
    const setMoreSettingsAfterAuth = (userId: number) => {
      this._configDepAfterAuth(configDep, userId);
      if (configFirebase) this._configFirebaseAfterAuth(configFirebase, userId);
      if (dataBuild) this._dataBuildAfterAuth(dataBuild, userId);
    };

    // Helper function to set app's language (by using `setAvailableLangs` &
    // `setActiveLang` methods of `TranslocoService`).
    const setAppLang = (langId: string, langs?: LangDefinition[]) => {
      if (!langs) {
        this._langService.setAvailableLangs([
          {
            id: langId,
            label: v1LanguageGetCode(langId),
          },
        ]);
      } else {
        this._langService.setAvailableLangs(langs);
      }

      this._langService.setActiveLang(langId);
    };

    // Helper function to load app's language which is already set (by using
    // `load` method of `TranslocoService`)!
    const loadAppLang = (resolve: (value: unknown) => void, lang = 'en-GB') => {
      let loadedLangData: Translation | undefined;
      this._langService
        .load(lang)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            loadedLangData = data;
          },
          error: (e) => {
            this._initFailed(resolve);
          },
          complete: () => {
            // Why to check `loadedLangData` here again? Because if we have set
            // the Transloco `fallbackLang` option (although it's NOT recommended),
            // and then, even the default lang file (which is 'en-GB') couldn't
            // get loaded... our `next()` or `error()` functions of our subscriber
            // won't be called, and we will be straightly right here! So we
            // check if this variable is truthy, and if it's not, again we
            // redirect to the error page...
            if (loadedLangData) this._initSucceeded(resolve);
            else this._initFailed(resolve);
          },
        });
    };

    // Helper function to validated the fetched app language.
    const validateFetchedAppLang = (
      langId: string,
      langs: LangDefinition[],
    ) => {
      // Now before setting the language, let's do one more step!
      // let's look into `langs` arrray to see if it contains an item
      // which its `id` matches the one that we already have in `langId`
      // object. If it does, then we're good to go! If it doesn't, then
      // we're going to set `langId` based on the first item in `langs`
      // array.
      // But how is that possible? Well, it might be a server error!
      // e.g., server might say that the app only support Swedish, but
      // then, it might send the user's selected lang as 'en-GB'! So, in
      // that case, we're going to set the lang to the first item in
      // `langs` array.
      const langExists = langs.some((l) => {
        return l.id === langId;
      });
      if (!langExists) return langs[0].id;
      return langId;
    };

    return () =>
      new Promise((resolve, reject) => {
        this._configFacade.appInitStart();
        loadConfigDep();

        // Start the Observable from `_configFacade` to save required data for
        // the rest of our operations.
        this._configFacade.configState$
          .pipe(
            skip(1),
            take(1),
            exhaustMap((state) => {
              const halt$ = checkConfigDep(state.dataConfigDep);
              if (halt$) return halt$;

              // Before moving forward (switching to another observable), let's
              // also do one last step! Let's check, whether we're suppose to
              // load more config JSON files (secondary) by `_configFacade` or
              // not...
              const isCF = configDep.fun.configs.firebaseIntegration;
              loadConfigFirebase(isCF);

              const isDB = this._loadDataBuild;
              loadDataBuild(isDB);

              // Keep the same `configState$` Observable.
              return this._configFacade.configState$.pipe(
                skip(numOfSecondaryConfigsToLoad),
                take(1),
              );
            }),
            exhaustMap((state) => {
              // Last `exhaustMap` was halted? straightly return here as well.
              if ('haltedStep' in state) return of(state);

              // In the above operation, we may have loaded more configs... If
              // that's the case, then let's check them to see whether they
              // could be loaded or not...
              const isCF = configDep.fun.configs.firebaseIntegration;
              const haltCF$ = checkConfigFirebase(
                isCF,
                state.dataConfigFirebase,
              );
              if (haltCF$) return haltCF$;

              const isDB = this._loadDataBuild;
              const haltDB$ = checkDataBuild(isDB, state.dataDataBuild);
              if (haltDB$) return haltDB$;

              // Now that ALL configs are loaded, let's finish config effect.
              this._configFacade.appInitFinish();

              // Set Auth facade config.
              this._setAuthConfig(baseUrl);

              // Switch to the `authState$` Observable.
              return this._authFacade.authState$.pipe(skip(4), take(1));
            }),
            exhaustMap((state) => {
              // Last `exhaustMap` was halted? straightly return here as well.
              if ('haltedStep' in state) return of(state);

              // If user was NOT login, just return.
              // Why? Because later in our operations (in our subscription), we
              // will let Transloco itself to load the default lang in its
              // loader function.
              if (!state?.datas.getToken) {
                return of({ haltedStep: 'auth' } as HaltedState).pipe(take(1));
              }

              // Do more settings, now that user is login.
              setMoreSettingsAfterAuth(state.datas.getToken.userId);

              // Set Translations facade config.
              this._setTranslationsConfig(baseUrl, state.datas.getToken.userId);

              // Switch to the `translationsState$` Observable.
              return this._translationsFacade.translationsState$.pipe(
                skip(4),
                take(1),
              );
            }),
          )
          .subscribe((state) => {
            // Decide what to do, if any of the above `exhaustMap` operations
            // were halted, and then return.
            if ('haltedStep' in state) {
              switch (state.haltedStep) {
                case 'config':
                  this._initFailed(resolve);
                  break;
                case 'auth':
                  setAppLang(defaultLang);
                  loadAppLang(resolve, defaultLang);
                  break;
              }
              return;
            }

            // If we're here, it means none of the above `exhaustMap` operations
            // were halted. So before continuing to use Transloco (to set some
            // of its settings) let's make sure we have all required data in
            // `translationsState$` state object. If not, again just try to
            // load the default language and return.
            if (!state.datas.allLangs || !state.datas.selectedLang) {
              setAppLang(defaultLang);
              loadAppLang(resolve, defaultLang);
              return;
            }

            // Let's set available langs, active lang, and load the active lang.
            const langs = state.datas.allLangs.codes as LangDefinition[];
            const lang = state.datas.selectedLang;
            const langId = validateFetchedAppLang(lang.id, langs);

            setAppLang(langId, langs);
            loadAppLang(resolve, langId);
          });
      });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: ONLY `init` ONLY related                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  /** Helper function to define Auth facade config. */
  protected _setAuthConfig(baseUrl: string) {
    // Use auth to see if user is already login or not.
    this._authFacade.checkIfAlreadyLoggedin();
    // Set public URLs of the app.
    this._authFacade.setPublicUrls([]); // Default: []
    // Set the default protected path of the app.
    this._authFacade.setProtectedInitialPath('/dashboard');
    // Set the app version.
    this._authFacade.setAppVersion(environment.version);
  }

  /** Helper function to define Translations facade config. */
  protected _setTranslationsConfig(baseUrl: string, userId: number) {
    // If user was login, use translations to fetch client all
    // available langs & user selected lang.
    this._translationsFacade.getAllLangs(baseUrl);
    this._translationsFacade.getSelectedLang(baseUrl, userId);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Final operations BEFORE initialization                        */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * This function is called when the app initialization is succeeded. i.e.,
   * config (DEP) + all of the other config JSON files are not only loaed, but
   * also the app's language is loaded successfully.
   *
   * @protected
   * @param {(value: unknown) => void} resolve
   * @returns {void) => void}
   */
  protected _initSucceeded(resolve: (value: unknown) => void) {
    resolve(true);
  }

  /**
   * This function is called when the app initialization is failed. i.e.,
   * config (DEP) + one of the other config JSON files are NOT loaded, or
   * the app's language is NOT loaded successfully.
   *
   * NOTE: When the app initialization is failed, we redirect the user to the
   * '/shell' page, which is a simple error page with a message.
   *
   * @protected
   * @param {(value: unknown) => void} resolve
   * @returns {void) => void}
   */
  protected _initFailed(resolve: (value: unknown) => void) {
    resolve(true);
    this._router.navigate(['/shell']);
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions: Configurations                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * This function is called when the config (DEP) is loaded successfully. Here
   * we may like to edit the HTML page in some ways, such as changing the page
   * title, adding some styles, or even some scripts.
   *
   * @protected
   * @param {V2Config_MapDep} data
   */
  protected _configDepLoaded(data: V2Config_MapDep) {
    // Add some codes to HTML.
    this._addDepStyles();
    this._addFonts(data.assets.fontBase, data.assets.fontBold);
    this._addMarkerIoCode(data.fun.feat.markerIo?.projectId);
  }

  protected _configDepAfterAuth(data: V2Config_MapDep, userId: number) {
    // Update already added codes to HTML after user is login.
    // NOTE: Nothing to do here for now!
  }

  protected _configFirebaseLoaded(data: V2Config_MapFirebase) {
    // NOTE: It will be initialized in the `trackingService`.
  }

  protected _configFirebaseAfterAuth(
    data: V2Config_MapFirebase,
    userId: number,
  ) {
    // NOTE: It will be updated in the `trackingService` after user is login.
  }

  protected _dataBuildLoaded(data: V2Config_MapDataBuild) {
    // ...
  }

  protected _dataBuildAfterAuth(data: V2Config_MapDataBuild, userId: number) {
    // ...
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Config DEP: More settings                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  protected _editTitle(title: string) {
    V1HtmlEditorService.editTitle(title);
  }

  protected _addDepStyles() {
    const cacheBuster = Math.random().toString(36).substring(7);
    const depStyles = `
    <link rel="stylesheet" href="./x-assets/DEP_style.css?cache=${cacheBuster}" type="text/css">
    `;
    V1HtmlEditorService.insertContent(depStyles);
  }

  protected _addFonts(fontBasePath: string, fontBoldPath: string) {
    const fonts = `
    <style>
      @font-face {
        font-family: e;
        src: url('${fontBasePath}');
      }
      @font-face {
        font-family: e;
        src: url('${fontBoldPath}');
        font-weight: bold;
      }
    </style>
    `;
    V1HtmlEditorService.insertContent(fonts);
  }

  protected _addMarkerIoCode(projectId?: string) {
    if (!projectId) return;

    V1HtmlEditorService.insertScript(
      `
      window.markerConfig = {
        project: '${projectId}', 
        source: 'snippet'
      };
      !function(e,r,a){if(!e.__Marker){e.__Marker={};var t=[],n={__cs:t};["show","hide","isVisible","capture","cancelCapture","unload","reload","isExtensionInstalled","setReporter","setCustomData","on","off"].forEach(function(e){n[e]=function(){var r=Array.prototype.slice.call(arguments);r.unshift(e),t.push(r)}}),e.Marker=n;var s=r.createElement("script");s.async=1,s.src="https://edge.marker.io/latest/shim.js";var i=r.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}}(window,document);
      `,
    );
  }
}
