import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
  input,
  model,
} from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { V1BaseUi_DataType } from '@x/shared-util-ng-bases-model';
import { V1BaseUiComponent } from '@x/shared-util-ng-bases';
import { V1XCredit_MapSummary } from '@x/shared-map-ng-x-credit';

/**
 * X Profile-Image sample 'ui' lib.
 *
 * @export
 * @class V1XProfileImageComponent
 * @typedef {V1XProfileImageComponent}
 */
@Component({
  selector: 'x-x-profile-image-v1',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './x-profile-image.component.html',
  styleUrl: './x-profile-image.component.scss',
})
export class V1XProfileImageComponent extends V1BaseUiComponent {
  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  // state = model<V1BaseUi_State>('loading'); // Introduced in base class
  override dataType = model<V1BaseUi_DataType>('one');

  creditSummary = input.required<V1XCredit_MapSummary>();

  imgAvatar = input<string>(
    './assets/images/libs/x-profile-image/img-profile.jpg',
  );

  /* //////////////////////////////////////////////////////////////////////// */
  /* X useful functions                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  protected override _xHasRequiredInputs(): boolean {
    super._xHasRequiredInputs();

    // Read optional inputs to track them.
    this.imgAvatar();

    // Check for required inputs (which also leads to tracking them).
    if (!this.creditSummary()) return false;
    return true;
  }

  protected override _xSetState(): void {
    super._xSetState();

    // Set state.
    this.state.set('data');
  }
}
