import { provideStoreDevtools } from '@ngrx/store-devtools';

export const environment = {
  version: '1.0.0',
  config_dep: './assets/DEP_config.development.json',
  config_firebase: './assets/firebase_config.json',
  data_build: './assets/DEP_buildId.json',
  protected_initial_path: '/dashboard',
  translations_components: [],
  providers: [provideStoreDevtools({ maxAge: 25, connectInZone: true })],
};
