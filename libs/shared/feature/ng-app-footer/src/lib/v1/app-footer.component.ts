import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoDirective } from '@jsverse/transloco';

import { V1CommunicationService } from '@x/shared-util-ng-services';
import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V1Communication_Event } from '@x/shared-util-ng-bases-model';
import {
  V1AppFooterDesktopComponent,
  V1AppFooterMobileComponent,
} from '@x/shared-ui-ng-app-footer';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';

@Component({
  selector: 'x-app-footer-fea-v1',
  standalone: true,
  imports: [
    CommonModule,
    V1AppFooterDesktopComponent,
    V1AppFooterMobileComponent,
    TranslocoDirective,
  ],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class V1AppFooterFeaComponent implements OnInit {
  /* General //////////////////////////////////////////////////////////////// */

  protected _destroyRef = inject(DestroyRef);
  readonly configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  /* For desktop platform /////////////////////////////////////////////////// */

  // ...

  /* For mobile platform //////////////////////////////////////////////////// */

  // ...

  /* //////////////////////////////////////////////////////////////////////// */
  /* Input, Output                                                            */
  /* //////////////////////////////////////////////////////////////////////// */

  @Input() isAuthenticated = true;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Understand the current platform that app is running on.
    this.platform = this._capacitorCoreService.getPlatform();

    // Init.
    this._init();
  }

  private _init() {
    // Initialize the header UI based on the platform.
    if (this.platform === 'desktop') {
      this._initForDesktop();
    } else {
      this._initForMobile();
    }
  }

  private _initForDesktop() {
    // For desktop platform, we don't need to do anything special.
  }

  private _initForMobile() {
    // For mobile platform, we don't need to do anything special.
  }
}
