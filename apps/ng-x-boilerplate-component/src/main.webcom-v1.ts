/* eslint-disable @nx/enforce-module-boundaries */
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';

import { V1CoreInitializerComponent } from '@x/ng-x-boilerplate-component-feature-core-initializer';
import { V1CoreXProfileImageComponent } from '@x/ng-x-boilerplate-component-feature-core-x-profile-image';
import { V1CoreXProfileInfoComponent } from '@x/ng-x-boilerplate-component-feature-core-x-profile-info';
import { V1CoreXFullDashboardComponent } from '@x/ng-x-boilerplate-component-feature-core-x-full-dashboard';

import { appConfig } from './app/app.config';
import './scripts';

(async () => {
  const app = await createApplication(appConfig);

  /* x-core-initializer-v1 ////////////////////////////////////////////////// */
  const elInitializerV1 = createCustomElement(V1CoreInitializerComponent, {
    injector: app.injector,
  });
  customElements.define('x-core-initializer-v1', elInitializerV1);

  /* x-core-x-profile-image-v1 ////////////////////////////////////////////// */
  const elXProfileImageV1 = createCustomElement(V1CoreXProfileImageComponent, {
    injector: app.injector,
  });
  customElements.define('x-core-x-profile-image-v1', elXProfileImageV1);

  /* x-core-x-profile-info-v1 /////////////////////////////////////////////// */
  const elXProfileInfoV1 = createCustomElement(V1CoreXProfileInfoComponent, {
    injector: app.injector,
  });
  customElements.define('x-core-x-profile-info-v1', elXProfileInfoV1);

  /* x-core-x-full-dashboard-v1 ///////////////////////////////////////////// */
  const elXFullDashboardV1 = createCustomElement(
    V1CoreXFullDashboardComponent,
    {
      injector: app.injector,
    },
  );
  customElements.define('x-core-x-full-dashboard-v1', elXFullDashboardV1);
})();
