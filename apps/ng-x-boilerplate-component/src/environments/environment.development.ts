import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  version: '1.0.0',
  simulator: true,
  config_dep: './x-assets/DEP_config.development.json',
  config_firebase: './x-assets/firebase_config.json',
  translations_components: [],
  providers: [provideStoreDevtools({ maxAge: 25, connectInZone: true })],
};
