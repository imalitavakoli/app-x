import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { IonContent } from '@ionic/angular/standalone';

/**
 * In this component, all we do is to just lazy-load the target template
 * dynamically! Where's the rest of the logic? In the loaded template itself!
 *
 * @export
 * @class V2AuthPageComponent
 * @typedef {V2AuthPageComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-auth-page-v2',
  standalone: true,
  imports: [IonContent, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class V2AuthPageComponent implements AfterViewInit {
  @ViewChild('templateDesktop', { read: ViewContainerRef })
  tpl_desktop!: ViewContainerRef;
  @ViewChild('templateMobile', { read: ViewContainerRef })
  tpl_mobile!: ViewContainerRef;
  tpl!: ViewContainerRef;

  readonly configFacade = inject(V2ConfigFacade);
  private readonly _capacitorCoreService = inject(V1CapacitorCoreService);

  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  private _template!: 'classic' | 'aligator';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterViewInit(): void {
    // Understand what is the platform that app is running on.
    this.platform = this._capacitorCoreService.getPlatform();

    // Define the template container based on platform.
    this.tpl = this.platform === 'desktop' ? this.tpl_desktop : this.tpl_mobile;

    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      data = data as V2Config_MapDep; // We are already sure DEP config is loaded.

      // Save required data.
      // NOTE: We can read the lib's template from DEP config... But for now,
      // we hard-code it to 'classic'.
      this._template = 'classic';

      // Init the component.
      this._init();
    });
  }

  private _init() {
    // Lazy load lib's template.
    if (this._template === 'classic') {
      import('./templates/classic/auth-classic.component').then((module) => {
        this.tpl.createComponent(module.V2AuthPageTplClassicComponent);
      });
    }
  }
}
