import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { EMPTY, mergeMap, of, Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IonContent, IonRouterOutlet } from '@ionic/angular/standalone';

import { V1CapacitorCoreService } from '@x/shared-util-ng-capacitor';
import { V1OnNavScrollMeToTopDirective } from '@x/shared-ui-ng-directives';
import { V2ConfigFacade } from '@x/shared-data-access-ng-config';
import { V1AppHeaderFeaComponent } from '@x/shared-feature-ng-app-header';
import { V1AppFooterFeaComponent } from '@x/shared-feature-ng-app-footer';

@Component({
  selector: 'x-base-page-v1',
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    RouterModule,
    V1OnNavScrollMeToTopDirective,
    V1AppHeaderFeaComponent,
    V1AppFooterFeaComponent,
  ],
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class V1BasePageComponent {
  readonly configFacade = inject(V2ConfigFacade);
  capacitorCoreSerivce = inject(V1CapacitorCoreService);

  // NOTE: This variable will be used (in HTML) ONLY when we're in mobile view.
  currPageName!: string;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  onChangedPageOnMobile(pageName: string) {
    this.currPageName = pageName;
  }
}
