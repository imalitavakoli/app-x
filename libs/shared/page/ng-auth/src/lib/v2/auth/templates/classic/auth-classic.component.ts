import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';

import { V2AuthPageTplComponent } from '../tpl.component';
import { MethodBankidComponent } from './_feature/method-bankid/method-bankid.component';
import { MethodMagicComponent } from './_feature/method-magic/method-magic.component';

/**
 * Classic template of the authentication page.
 *
 * @export
 * @class V1AuthPageTplClassicComponent
 * @typedef {V1AuthPageTplClassicComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-auth-page-tpl-classic-v2',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    LottieComponent,
    V1PreloadersComponent,
    V1PopupComponent,
    MethodMagicComponent,
    MethodBankidComponent,
  ],
  templateUrl: './auth-classic.component.html',
  styleUrls: ['./auth-classic.component.scss'],
})
export class V2AuthPageTplClassicComponent extends V2AuthPageTplComponent {
  /* General //////////////////////////////////////////////////////////////// */

  // platform!: 'ios' | 'android' | 'desktop'; // Introduced in the Base.
  // nativeAppInfo: V1CapacitorCore_AppInfo | null = null; // Introduced in the Base.
  // appVersion!: string; // Introduced in the Base.
  // waitingType?: V2Auth_Submit['type']; // Introduced in the Base.

  showPopup_troubleLogin = false;
}
