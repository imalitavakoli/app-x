import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  exhaustMap,
  map,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LottieComponent } from 'ngx-lottie';

import { V1BaseFeatureExtXCreditComponent } from '@x/shared-util-ng-bases';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V1PopupComponent } from '@x/shared-ui-ng-popup';
import { V1XProfileImageComponent } from '@x/shared-ui-ng-x-profile-image';

@Component({
  selector: 'x-x-profile-image-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    V1PopupComponent,
    LottieComponent,
    V1XProfileImageComponent,
  ],
  templateUrl: './x-profile-image.component.html',
  styleUrl: './x-profile-image.component.scss',
})
export class V1XProfileImageFeaComponent extends V1BaseFeatureExtXCreditComponent {
  override readonly comName: string = 'V1XProfileImageFeaComponent_main';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  userId = input.required<number>();

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    // Check for required inputs (which also leads to tracking them).
    if (!this.userId()) return false;
    return true;
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Prepare & reset & fetch data functions                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xDataFetch(): void {
    // LIB: XCredit (main)
    this._xCreditRequestedData_main.push('summary');
    this.xCreditFacade.getSummary(this._baseUrl, this.userId(), this.comName);
  }
}
