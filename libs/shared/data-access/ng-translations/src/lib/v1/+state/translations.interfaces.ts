import {
  V1Translations_MapTrans,
  V1Translations_MapAllLangs,
  V1Translations_MapSelectedLang,
} from '@x/shared-map-ng-translations';

export interface V1Translations_Loadeds {
  translations?: boolean;
  allLangs?: boolean;
  selectedLang?: boolean;
}

export interface V1Translations_Errors {
  translations?: string;
  allLangs?: string;
  selectedLang?: string;
}

export interface V1Translations_Datas {
  translations?: V1Translations_MapTrans;
  allLangs?: V1Translations_MapAllLangs;
  selectedLang?: V1Translations_MapSelectedLang;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Translations_SuccessAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  data: V1Translations_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1Translations_FailureAction {
  relatedTo: V1Translations_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type V1Translations_ResponseIsRelatedTo =
  | 'translations'
  | 'allLangs'
  | 'selectedLang';

type V1Translations_ResponseData =
  | V1Translations_MapTrans
  | V1Translations_MapAllLangs
  | V1Translations_MapSelectedLang;
