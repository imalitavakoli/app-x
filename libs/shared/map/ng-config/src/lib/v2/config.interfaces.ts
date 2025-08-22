/* ////////////////////////////////////////////////////////////////////////// */
/* Load DEP config                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Interface of the json file we're going to receive.
 *
 * @export
 * @interface V2Config_ApiDep
 * @typedef {V2Config_ApiDep}
 */
export interface V2Config_ApiDep {
  assets?: {
    font_base?: string;
    font_bold?: string;

    logo?: string;
    logo_in_day?: string;
    logo_in_night?: string;
    logo_in_desktop?: string;
    logo_in_mobile?: string;

    gfx_celebration?: string;
    gfx_email?: string;
    gfx_empty?: string;
    gfx_error?: string;
    gfx_notfound?: string;
    gfx_success?: string;

    // App-specific assets
    this_auth_img_bg?: string;

    // X Profile Image lib
    lib_xprofileimage_img_avatar?: string;

    // X Profile Info lib
    lib_xprofileinfo_ico_info?: string;
  };

  general: {
    environment: {
      environment: 'APP_BUILD_PROD' | 'APP_BUILD_UAT';
      items: {
        base_url: string;
        client_id: string;
      };
    };
    app_name: string; // 'X'
  };

  fun: {
    configs: {
      google_analytics_measurement_id: string; // 'G-XXXXXXXXXX'
      firebase_integration: boolean;
      default_lang: string; // 'en-GB'
      default_currency_code: string; // 'SEK'
    };

    /**
     * List of available authentication methods that our app can use.
     */
    auth: {
      AUTH_METHOD_MAGIC_LINK?: 'Magic link';
      AUTH_METHOD_BANK_ID?: 'Bank ID';
    }[];

    feat: {
      daylight_switch?: 'WEB_FEAT_DAYLIGHT';

      marker_io?: 'WEB_FEAT_MARKER_IO_V1';

      apptentive?: 'WEB_FEAT_APPTENTIVE_V2';

      // NOTE: Some features have their own settings... So this property holds
      // such settings.
      items?: {
        // Used by `marker_io` feature.
        project_id?: string;

        // Used by `apptentive` feature.
        signature?: string;
        key?: string;
        // project_id?: string;
      };
    }[];
  };

  ui: {
    nav: {
      TABBAR_OPTIONS_DASHBOARD?: string;
      TABBAR_OPTIONS_X_USERS?: string;
      TABBAR_OPTIONS_TEST?: string;
      TABBAR_OPTIONS_ACCOUNT?: string;
      items: {
        link: string;
        browser_type:
          | 'BROWSER_TYPE_WEBVIEW'
          | 'BROWSER_TYPE_INTERNAL_BROWSER'
          | 'BROWSER_TYPE_DEFAULT_BROWSER';
        load_link_directly: boolean;
      };
    }[];

    footer: {
      footer: 'UI_FOOTER_STANDARD' | 'UI_FOOTER_LITE';
      items: {
        txt_company_name: string;
        txt_company_site: string;
        txt_company_site_link: string;
        txt_copyright?: string;

        /**
         * Footer navigation items. key is the text of the item and value is the
         * link of the item.
         *
         * NOTE: It's only available, if the `footer` is set to 'UI_FOOTER_STANDARD'.
         */
        nav?: {
          [key: string]: string;
        }[];
      };
    };

    /**
     * The 'auth' page configurations of our apps.
     */
    welcome_screen: {
      type: {
        type: 'WELCOME_SCREEN_SIMPLE' | 'WELCOME_SCREEN_CLASSIC';
        items: {
          client_phone?: string;
          client_email?: string;
          client_address?: string;
        };
      };
    };

    home_view: {
      HOME_WIDGET_X_PROFILE_IMAGE?: 'shared-feature-ng-x-profile-image';
      HOME_WIDGET_X_PROFILE_INFO?: 'shared-feature-ng-x-profile-info';
    }[];

    acc_view: {
      ITEM_HEADING?: string; // If this is available, then this item in the array is a heading.
      ITEM_SPACE?: string; // If this is available, then this item in the array represents an empty space.
      ITEM_LOGOUT?: string;
      ITEM_APP_VERSION?: string;

      /**
       * If the following properties are available: It tells us that the item in
       * the array is an external link, and `items` property is also available.
       */
      ITEM_WITH_URL?: string;
      ITEM_MY_TARIFF_EXTERNAL?: string;
      items?: {
        url: string;
        browser_type: 'BROWSER_TYPE_WEBVIEW';
      };

      // NOTE: The following items are normal links in the account view.
      ITEM_GENERAL?: string;
      ITEM_LANGUAGE?: string;
    }[];
  };

  libs: {
    X_PROFILE_INFO_1_0_0?: 'shared-feature-ng-x-profile-info';
    X_PROFILE_INFO_1_1_0?: 'shared-feature-ng-x-profile-info';
    items:
      | {
          // NOTE: The following properties are for 'X_PROFILE_INFO_1_0_0' lib.
          show_info_icon?: boolean;

          // NOTE: The following properties are for 'X_PROFILE_INFO_1_1_0' lib.
          // show_info_icon?: boolean;
          show_bg?: boolean;
        }
      | {
          // NOTE: The following properties are for 'BLAHBLAH_1_0_0' lib.
          // BLAHBLAH?: 'xxx';
        }[];
  }[];

  /**
   * Any other settings that might be available in the config file and will be
   * handled by API typed lib of the specific app that is loading config inside
   * itself.
   *
   * @type {?*}
   */
  extra?: any;
}

/**
 * Simplified interface of the config data.
 *
 * NOTE: We created this interface with the key names, value types, and the
 * structure that we need inside our app! And we only mention the options that
 * we need to work with! As the json file is an external resource, it might have
 * more options with completly different structure... We don't care about that!
 * Because in our 'dep' typed 'ng-config' lib (our proxy layer) we will
 * modify the http response in a way which this interface is designed :)
 *
 * @export
 * @interface V2Config_MapDep
 * @typedef {V2Config_MapDep}
 */
export interface V2Config_MapDep {
  /**
   * Path to some of the assets that our WL app needs.
   *
   * @type {*}
   */
  assets: {
    fontBase: string;
    fontBold: string;

    logo: string;
    logoInDay: string;
    logoInNight: string;
    logoInDesktop: string;
    logoInMobile: string;

    gfxCelebration: string;
    gfxEmail: string;
    gfxEmpty: string;
    gfxError: string;
    gfxNotfound: string;
    gfxSuccess: string;

    // App-specific assets
    thisAuthImgBg: string;

    // X Profile Image lib
    libXprofileImageImgAvatar?: string;

    // X Profile Info lib
    libXprofileInfoIcoInfo?: string;
  };

  /**
   * Some general settings that ALL of our WL apps have.
   *
   * @type {*}
   */
  general: {
    /**
     * Base URL of API calls that we're gonig to call inside our app.
     *
     * @type {string}
     */
    baseUrl: string;

    /**
     * ID of the client that our WL app is going to be customized for via DEP.
     *
     * @type {number}
     */
    clientId: number;

    appName: string;
  };

  /**
   * List of available functionalities of our WL app.
   * NOTE: It may not be available in some apps.
   *
   * @type {*}
   */
  fun: {
    configs: {
      /**
       * Google Analtytics measurement ID of the app.
       * Learn more: https://support.google.com/analytics/answer/9304153
       *
       * @type {string}
       */
      googleAnalyticsMeasurementId: string;

      firebaseIntegration: boolean;

      /**
       * Default language of the app.
       * NOTE: It will be used for the apps that use translations 'data-access'
       * lib. In such apps we should read the value of this property to see when
       * user is not login yet, in what language we should initialize the app.
       *
       * @type {string}
       */
      defaultLang: string;

      /**
       * Default currency code of the app.
       * NOTE: It will be used for the apps that use insights 'data-access'
       * lib. In such apps we can show  the energy data in the currency that is
       * set.
       *
       * @type {string}
       */
      defaultCurrencyCode: string;
    };

    /**
     * List of available authentication methods that our app can use.
     */
    auth: {
      hasAuthMagic?: boolean;
      hasAuthBankid?: boolean;
    };

    feat: {
      daylightSwitch?: boolean;

      markerIo?: {
        projectId: string;
      };

      apptentive?: {
        signature?: string; // This property is available ONLY in native apps.
        key?: string; // This property is available ONLY in native apps.
        projectId?: string; // This property is available ONLY in web apps.
      };
    };
  };

  /**
   * Settings related to the UI of our WL app.
   * NOTE: It may not be available in some apps.
   *
   * @type {*}
   */
  ui: {
    /**
     * The navigation that we have in our apps header.
     *
     * @type {V2Config_MapUiNav[]}
     */
    nav: V2Config_MapUiNav[];

    footer: {
      txtCompanyName: string;
      txtCompanySite: string;
      txtCompanySiteLink: string;
      txtCopyright?: string;

      /**
       * The optional navigation that our apps can have in footer.
       *
       * @type {?V2Config_MapUiFooterNav[]}
       */
      nav?: V2Config_MapUiFooterNav[];
    };

    /**
     * The 'auth' page configurations of our apps.
     */
    authConfig: {
      type: 'simple' | 'classic';

      // NOTE: The following properties might not be available for some types in
      // the future. But they are available if `type` is 'simple' or 'classic'.
      // In future, we might have more types.
      clientPhone?: string;
      clientEmail?: string;
      clientAddress?: string;
    };

    /**
     * List of functionalities (widgets) that we can show in the dashboard page
     * of our apps in order.
     */
    dashboardFuns: {
      showXProfileImage?: boolean;
      showXProfileInfo?: boolean;
    }[];

    /**
     * List of nav items in the account page of our apps in order.
     */
    accountNav: V2Config_MapUiAccountNav[];
  };

  /**
   * DEP configurations of any shared lib that we might have in our WL apps.
   *
   * @type {*}
   */
  libs: {
    xProfileInfoV1?: {
      hasInfoIcon?: boolean;
      hasBg?: boolean;
    };
  };

  /**
   * Any other specific setting that our WL app might have.
   *
   * @type {?*}
   */
  extra?: any;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Map (DEP): Partial interfaces                                              */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Interface of the app's navigation item.
 * It will be used in the header 'ui' lib of the apps.
 *
 * @export
 * @typedef {V2Config_MapUiNav}
 */
export type V2Config_MapUiNav = {
  name: string;
  type: 'dashboard' | 'x-users' | 'test' | 'account';

  /**
   * If this property is defined, then it means that the item is an external link.
   *
   * @type {?string}
   */
  link?: string;

  /**
   * If the item is an external link, then this property defines how it should be opened.
   *
   * @type {?('external' | 'cap-browser' | 'cap-inappbrowser')}
   */
  browserType?: 'external' | 'cap-browser' | 'cap-inappbrowser';

  /**
   * If the item is an external link, then this property comes in handy.
   * If true, we redirect to the link directly.
   * If false, we need to call an API endpoint (to fetch the link from server).
   *
   * @type {?boolean}
   */
  isLinkDirect?: boolean;
};

/**
 * Interface of the app's footer navigation item.
 * It will be used in the footer 'ui' lib of the apps.
 *
 * @export
 * @typedef {V2Config_MapUiFooterNav}
 */
export type V2Config_MapUiFooterNav = {
  name: string;
  link: string;
};

/**
 * Interface of the app's account page sidebar navigation item.
 * It will be used in the acc-sidebar 'ui' lib of the apps.
 *
 * @export
 * @typedef {V2Config_MapUiAccountNav}
 */
export type V2Config_MapUiAccountNav = {
  name: string;
  type:
    | 'heading' // This type tells us that the item in the array is a heading.
    | 'itemExternalLink' // This type tells us that the item in the array is an external link.
    | 'space'
    | 'logout'
    | 'appVersion'

    // NOTE: The following items are normal links in the account view.
    | 'itemGeneral'
    | 'itemLanguage';

  /**
   * This property is available ONLY IF `type` is 'itemExternalLink'.
   *
   * @type {?string}
   */
  link?: string;
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Load Firebase config                                                       */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The interface of the Firebase config object that we're going to receive.
 *
 * NOTE: We don't need to map this JSON object.
 *
 * @export
 * @interface V2Config_ApiFirebase
 * @typedef {V2Config_ApiFirebase}
 */
export interface V2Config_ApiFirebase {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL?: string;

  // Any other key might also be possible, according to the Firebase SDK updates.
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V2Config_MapFirebase extends V2Config_ApiFirebase {}

/* ////////////////////////////////////////////////////////////////////////// */
/* Load Build data interfaces                                                 */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * The interface of the Build data object that we're going to receive.
 *
 * NOTE: We don't need to map this JSON object.
 *
 * @export
 * @interface V2Config_ApiDataBuild
 * @typedef {V2Config_ApiDataBuild}
 */
export interface V2Config_ApiDataBuild {
  buildId: string; // '46b864c-9c3caa5'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface V2Config_MapDataBuild extends V2Config_ApiDataBuild {}
