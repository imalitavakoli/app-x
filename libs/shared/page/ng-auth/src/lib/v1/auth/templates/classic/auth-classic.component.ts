import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1PreloadersComponent } from '@x/shared-ui-ng-preloaders';
import { V1LongPressMeDirective } from '@x/shared-ui-ng-directives';

import { V1AuthPageTplComponent } from '../tpl.component';
import { V1AuthPageTplEvent } from '../tpl.interfaces';
import { MethodBankidComponent } from './method-bankid/method-bankid.component';
import { MethodMagicComponent } from './method-magic/method-magic.component';

/**
 * Classic template of the authentication page.
 *
 * @export
 * @class V1AuthPageTplClassicComponent
 * @typedef {V1AuthPageTplClassicComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-auth-page-tpl-classic-v1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoDirective,
    LottieComponent,
    V1LongPressMeDirective,
    V1PopupComponent,
    V1PreloadersComponent,
    MethodMagicComponent,
    MethodBankidComponent,
  ],
  templateUrl: './auth-classic.component.html',
  styleUrls: ['./auth-classic.component.scss'],
})
export class V1AuthPageTplClassicComponent
  extends V1AuthPageTplComponent
  implements OnInit, OnDestroy
{
  readonly sanitizer = inject(DomSanitizer);
  showPopupTroubleLogin = false;
  isTroubleLoggingSecretShown = false;

  // nativeAppInfo: V1CapacitorCore_AppInfo | null = null; // Introduced in the Base.
  // appVersion!: string; // Introduced in the Base.

  // contentWaitingType?: V1AuthPageContentWaiting; // Introduced in the Base.
  // platform!: 'ios' | 'android' | 'desktop'; // Introduced in the Base.

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * NOTE: This is an inherited component! So no need to do anything here in
   * most cases.
   *
   * @inheritdoc
   */
  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override _initPre(): void {
    super._initPre();
  }

  /**
   * Any initialization code should be here (rather than in `ngOnInit`).
   *
   * @inheritdoc
   */
  protected override _init(): void {
    super._init();
  }

  protected override _initAfterAuth() {
    super._initAfterAuth();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Emitting event for child components                                      */
  /* //////////////////////////////////////////////////////////////////////// */

  onTroubleTitleLongPress(): void {
    this.showPopupTroubleLogin = false;
    this.isTroubleLoggingSecretShown = true;
    this.contentTo(3); // Switch to the "secret" content.
  }

  onClickBack(): void {
    // Now when the Back button in the header is clicked, let's check if if we
    // are already in the secret step (view) or not... If we are NOT, then just
    // get back to previous step normally. But if we are, then go to the very
    // first step :)
    if (!this.isTroubleLoggingSecretShown) {
      this.contentToPrev(); // Switch to the previous content.
    } else {
      this.isTroubleLoggingSecretShown = false; // Reset the flag.
      this.contentTo(0); // Switch to the first content (step).
    }

    // Eventually emit the event, now that `contentCurrIndex` is already updated
    // by the above codes (`contentToPrev` or `contentTo` methods).
    this._communicationService.emitChange({
      template: 'classic',
      eventType: 'changeByUser',
      eventName: 'onClickBack',
      eventValue: this.contentCurrIndex, // To see in what content (step) we are.
    } as V1AuthPageTplEvent);
  }

  onSubmitSmsCode(form: NgForm): void {
    this._communicationService.emitChange({
      template: 'classic',
      eventType: 'changeByUser',
      eventName: 'onClickSmsCode',
      eventValue: form.value.inputSmsCode,
    } as V1AuthPageTplEvent);
    form.reset();
  }
}
