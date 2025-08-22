import { createFeature, createReducer, on } from '@ngrx/store';

import { TranslationsActions } from './translations.actions';
import {
  V1Translations_Errors,
  V1Translations_Loadeds,
  V1Translations_Datas,
  V1Translations_SuccessAction,
  V1Translations_FailureAction,
} from './translations.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Interface & Object                                           */
/* ////////////////////////////////////////////////////////////////////////// */

// NOTE: Exported ONLY for test codes.
export const translationsFeatureKey = 'v1Translations';

export interface V1Translations_State {
  lastLoadedLangCultureCode: string | undefined;

  loadedLatest: V1Translations_Loadeds;
  loadeds: V1Translations_Loadeds;
  errors: V1Translations_Errors;
  datas: V1Translations_Datas;
}

// NOTE: Exported ONLY for test codes.
export const initialState: V1Translations_State = {
  lastLoadedLangCultureCode: undefined,

  loadedLatest: {} as V1Translations_Loadeds,
  loadeds: {} as V1Translations_Loadeds,
  errors: {} as V1Translations_Errors,
  datas: {} as V1Translations_Datas,
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Reducer                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

export const v1TranslationsReducer = createReducer(
  initialState,

  /* Get translations in a specific language //////////////////////////////// */

  on(
    TranslationsActions.getTranslations,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { translations: false },
      loadeds: { ...state.loadeds, translations: undefined },
      errors: { ...state.errors, translations: undefined },
      datas: { ...state.datas, translations: undefined },
    }),
  ),

  /* Get client all available langs & user selected lang //////////////////// */

  on(
    TranslationsActions.getAllLangs,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { allLangs: false },
      loadeds: { ...state.loadeds, allLangs: undefined },
      errors: { ...state.errors, allLangs: undefined },
      datas: { ...state.datas, allLangs: undefined },
    }),
  ),

  on(
    TranslationsActions.getSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { selectedLang: false },
      loadeds: { ...state.loadeds, selectedLang: undefined },
      errors: { ...state.errors, selectedLang: undefined },
      datas: { ...state.datas, selectedLang: undefined },
    }),
  ),

  /* Set user selected lang ///////////////////////////////////////////////// */

  on(
    TranslationsActions.patchSelectedLang,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { selectedLang: false },
      loadeds: { ...state.loadeds, selectedLang: undefined },
      errors: { ...state.errors, selectedLang: undefined },
      datas: { ...state.datas, selectedLang: undefined },
    }),
  ),

  /* Other actions ////////////////////////////////////////////////////////// */

  on(
    TranslationsActions.success,
    (state, action): V1Translations_State => ({
      ...state,
      ...setMorePropsBasedOnActSuccess(action),
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      datas: { ...state.datas, [action.relatedTo]: action.data },
    }),
  ),

  on(
    TranslationsActions.failure,
    (state, action): V1Translations_State => ({
      ...state,
      loadedLatest: { [action.relatedTo]: true },
      loadeds: { ...state.loadeds, [action.relatedTo]: true },
      errors: { ...state.errors, [action.relatedTo]: action.error },
    }),
  ),
);

/* ////////////////////////////////////////////////////////////////////////// */
/* Feature State Selectors (auto generated via `createFeature()`)             */
/* ////////////////////////////////////////////////////////////////////////// */

export const translationsFeature = createFeature({
  name: translationsFeatureKey,
  reducer: v1TranslationsReducer,
});

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful functions                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

function setMorePropsBasedOnActSuccess(
  action: V1Translations_SuccessAction,
): Partial<V1Translations_State> {
  switch (action.relatedTo) {
    case 'translations':
      return {
        lastLoadedLangCultureCode: action.extra?.['cultureCode'],
      };
    case 'selectedLang':
      return {
        lastLoadedLangCultureCode: action.extra?.['cultureCode'],
      };
    default:
      return {};
  }
}
