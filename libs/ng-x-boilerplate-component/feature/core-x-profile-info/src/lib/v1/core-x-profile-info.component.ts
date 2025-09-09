import { Component, EventEmitter, Input, Output } from '@angular/core';

import { take } from 'rxjs';

import { V1BaseCoreComponent } from '@x/ng-x-boilerplate-component-util-bases';
import { V1XProfileInfoFeaComponent } from '@x/shared-feature-ng-x-profile-info';

@Component({
  selector: 'x-core-x-profile-info-v1',
  standalone: true,
  imports: [V1XProfileInfoFeaComponent],
  templateUrl: './core-x-profile-info.component.html',
  styleUrl: './core-x-profile-info.component.scss',
})
export class V1CoreXProfileInfoComponent extends V1BaseCoreComponent {
  /* General //////////////////////////////////////////////////////////////// */

  // readonly insightsFacade = inject(V3InsightsFacade); // Introduced in the Base component.
  // isAuthenticated = false; // Introduced in the Base component.

  /* Initialized inner 'feature' lib related //////////////////////////////// */

  // isReadyToInitLib = false; // Introduced in the Base component.

  /* Inherited children components related ////////////////////////////////// */

  /** @inheritdoc */
  override readonly comName = 'V1CoreXProfileInfoComponent';

  /** @inheritdoc */
  override readonly _coreName = 'x-profile-info';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() userId!: string; // e.g., '12345'

  @Input() showBtnReadMore: 'true' | 'false' = 'false';

  @Output() clickedReadMore = new EventEmitter<void>();

  // @Output() hasError = new EventEmitter<{ key: string; value: string }>(); // Introduced in the Base component.
  // @Output() ready = new EventEmitter<void>(); // Introduced in the Base component.

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Lifecycle                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Let's initialze the inner 'feature' lib, now that `isReadyToInitLib` is
   * true, user is authenticated and all data is ready :)
   *
   * @inheritdoc
   */
  protected override _xInitOrUpdateAfterAllDataReady() {
    super._xInitOrUpdateAfterAllDataReady();

    // ...
  }
}
