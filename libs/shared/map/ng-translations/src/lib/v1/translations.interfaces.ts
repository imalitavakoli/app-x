/* ////////////////////////////////////////////////////////////////////////// */
/* Get translations in a specific language                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Exact API response object interface.
 *
 * @export
 * @interface V1Translations_ApiTrans
 * @typedef {V1Translations_ApiTrans}
 */
export interface V1Translations_ApiTrans {
  [key: string]: string;
}

/**
 * Simplified version of API response object interface.
 *
 * NOTE: We don't do any specific proxying for translations... Because there are
 * lots of properties that can change time to time! So what if the API JSON
 * response structure changes then? Well, in such a case, for translations, we
 * don't do anything in this 'api' lib... Instead we need to update the
 * 'feature'/'page' libs whom are using the modified translations keys from API
 * in their template HTML file.
 *
 * @export
 * @interface V1Translations_MapTrans
 * @typedef {V1Translations_MapTrans}
 */
export interface V1Translations_MapTrans {
  [key: string]: string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Get client all available langs & user selected lang                        */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_ApiAllLangs {
  language_codes: string[];
}

export interface V1Translations_MapAllLangs {
  codes: {
    id: string; // culture code (e.g. 'en-GB')
    label: string; // language code (e.g. 'en')
  }[];
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Set user selected lang                                                     */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_ApiPayloadSelectedLang {
  op: 'replace';
  path: '/language_code';
  value: string; // culture code (e.g. 'en-GB')
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful                                                                     */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_ApiSelectedLang {
  id: number;
  client_id: number;
  ext_ref: string;
  name?: number;
  email?: string;
  phone?: string;
  terms_accepted?: string;
  language_code: string;
  is_integrationless_user: boolean;
  custom?: unknown;
}

export interface V1Translations_MapSelectedLang {
  id: string; // culture code (e.g. 'en-GB')
  label: string; // language code (e.g. 'en')
}
