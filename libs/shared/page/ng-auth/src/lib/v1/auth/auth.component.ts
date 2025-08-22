import {
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
 * In Auth page, all we do is to just lazy-load the target template dynamically!
 * So where's the rest of the logic happening? In the loaded template itself!
 *
 * NOTE: Templates themeselves are inherited from `templates/tpl.component.ts`.
 * So some of their logic is restting in that class.
 *
 * @export
 * @class V1AuthPageComponent
 * @typedef {V1AuthPageComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'x-auth-page-v1',
  standalone: true,
  imports: [IonContent, CommonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class V1AuthPageComponent implements OnInit {
  @ViewChild('template', { read: ViewContainerRef }) tpl!: ViewContainerRef;
  readonly configFacade = inject(V2ConfigFacade);
  private _template!: 'classic' | 'sample';

  private readonly _capacitorCoreSerivce = inject(V1CapacitorCoreService);
  platform: 'ios' | 'android' | 'desktop' = 'desktop';

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngOnInit(): void {
    // Understand what is the platform that app is running on.
    this.platform = this._capacitorCoreSerivce.getPlatform();

    this.configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      data = data as V2Config_MapDep; // We are already sure DEP config is loaded.

      // Save required data.
      // TODO: Here we should get the template type from the DEP config. But
      // we don't have it yet! So we hard-code it to 'classic' for now.
      this._template = 'classic';

      // Init the component.
      this._init();
    });
  }

  private _init() {
    // Lazy load the page template.
    if (this._template === 'sample') {
      import('./templates/sample/auth-sample.component').then((module) => {
        this.tpl.createComponent(module.V1AuthPageTplSampleComponent);
      });
    } else {
      import('./templates/classic/auth-classic.component').then((module) => {
        this.tpl.createComponent(module.V1AuthPageTplClassicComponent);
      });
    }
  }
}
