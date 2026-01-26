import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  V1Translations_SuccessAction,
  V1Translations_FailureAction,
} from './translations.interfaces';

export const TranslationsActions = createActionGroup({
  source: 'V1Translations',
  events: {
    /* Get translations in a specific language ////////////////////////////// */

    getTranslations: props<{
      lib: string;
      url: string;
      clientId: number;
      cultureCode: string;
      modules: string[];
    }>(),

    /* Get client all available langs & user selected lang ////////////////// */

    getAllLangs: props<{ lib: string; url: string }>(),

    getSelectedLang: props<{ lib: string; url: string; userId: number }>(),

    /* Set user selected lang /////////////////////////////////////////////// */

    patchSelectedLang: props<{
      lib: string;
      url: string;
      userId: number;
      cultureCode: string;
    }>(),

    /* Other actions //////////////////////////////////////////////////////// */

    success: props<V1Translations_SuccessAction>(),
    failure: props<V1Translations_FailureAction>(),
  },
});
