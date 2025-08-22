import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';

import { V1AuthPageTplComponent } from '../tpl.component';
import { V1AuthPageTplEvent } from '../tpl.interfaces';

/**
 * Sample template of the authentication page.
 *
 * @export
 * @class V1AuthPageTplSampleComponent
 * @typedef {V1AuthPageTplSampleComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-auth-page-tpl-sample-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    LottieComponent,
    V1PopupComponent,
    V1PreloadersComponent,
  ],
  templateUrl: './auth-sample.component.html',
  styleUrls: ['./auth-sample.component.scss'],
})
export class V1AuthPageTplSampleComponent
  extends V1AuthPageTplComponent
  implements OnInit, OnDestroy
{
  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override _initPre(): void {
    super._initPre();
  }

  protected override _init(): void {
    super._init();
  }

  protected override _initAfterAuth() {
    super._initAfterAuth();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
