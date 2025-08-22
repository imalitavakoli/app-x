import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-not-found-page-v1',
  standalone: true,
  imports: [CommonModule, RouterModule, LottieComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class V1NotFoundPageComponent {
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _translocoService = inject(TranslocoService);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  getTextTitle(): string {
    let txt = this._translocoService.translate('generic_errors.404_title');
    if (txt === 'generic_errors.404_title') txt = 'Oops!';
    return txt;
  }
  getTextDesc(): string {
    let txt = this._translocoService.translate('generic_errors.404_desc');
    if (txt === 'generic_errors.404_desc')
      txt = `It looks like you're lost in space!`;
    return txt;
  }
  getTextBtnHome(): string {
    let txt = this._translocoService.translate(
      'generic_errors.404_btn_back_to_home',
    );
    if (txt === 'generic_errors.404_btn_back_to_home') txt = 'Back to home';
    return txt;
  }
}
