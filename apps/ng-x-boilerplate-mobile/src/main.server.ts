import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import 'localstorage-polyfill';

// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../libs/shared/ui/framework8/src/lib/v1/blocks/typings.d.ts'; // shared-ui-framework8 related

global['localStorage'] = localStorage;

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, config, context);

export default bootstrap;
