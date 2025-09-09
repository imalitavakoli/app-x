/* eslint-disable @nx/enforce-module-boundaries */
import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

import { V1CoreInitializerComponent } from '@x/ng-x-boilerplate-component-feature-core-initializer';
import { V1CoreXProfileImageComponent } from '@x/ng-x-boilerplate-component-feature-core-x-profile-image';
import { V1CoreXProfileInfoComponent } from '@x/ng-x-boilerplate-component-feature-core-x-profile-info';
import { V1CoreXFullDashboardComponent } from '@x/ng-x-boilerplate-component-feature-core-x-full-dashboard';

import { environment } from '../environments/environment';
import {
  ComType,
  ApiInputsInitializerV1,
  ApiInputsXProfileImageV1,
  ApiInputsXProfileInfoV1,
  ApiInputsXFullDashboardV1,
} from './app.interfaces';
import { SimulatorComponent } from './simulator/simulator.component';

/**
 * this app is just a wrapper to hold core components.
 * It receives some URL Query parameters and provides them as inputs to the core
 * components.
 *
 * NOTE: The simulator codes will be visible ONLY in development mode (via
 * `environment.simulator`)... They actually add the sample codes that the
 * client herself should add in her own site/app, and then load this wrapper app
 * in her environment as an iFrame.
 *
 * @export
 * @class AppComponent
 * @typedef {AppComponent}
 */
@Component({
  standalone: true,
  imports: [RouterModule, SimulatorComponent],
  selector: 'x-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _routeSub!: Subscription;
  @ViewChild('com', { read: ViewContainerRef }) com!: ViewContainerRef;

  /**
   * Determine if we need to initialize the simulator component in our template.
   *
   * NOTE: Simulator codes are ONLY be shown in development and they are for
   * development purposes.
   *
   * @type {boolean}
   */
  simulator = environment.simulator;

  // Core(s)
  comInitializer!: ComponentRef<V1CoreInitializerComponent>;
  comXProfileImage!: ComponentRef<V1CoreXProfileImageComponent>;
  comXProfileInfo!: ComponentRef<V1CoreXProfileInfoComponent>;
  comXFullDashboard!: ComponentRef<V1CoreXFullDashboardComponent>;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Lifecycle                                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  ngAfterViewInit() {
    // Let's log the app version to the console.
    console.log(`XBoilerplateComponent version: ${environment.version}`);

    // Let's initialize the core component(s) by parsing the URL query
    // parameters.
    this._routeSub = this._route.queryParams.subscribe((params) => {
      // if `params.com` is not available, then we don't need to do anything...
      // Because we actually need it to understand which one of our components
      // (web-components) must be lazy-loaded.
      if (!params['com']) return;

      // If we're here, it means that the `com` query parameter is available.
      // So let's parse it and see which component(s) we need to load.
      const coms: ComType[] = params['com'].split(',');

      // Loop through `coms` to load the required components.
      for (const com of coms) {
        switch (com) {
          case 'initializer-v1':
            this.loadComInitializer();
            break;

          case 'x-profile-image-v1':
            this.loadComXProfileImage();
            break;

          case 'x-profile-info-v1':
            this.loadComXProfileInfo();
            break;

          case 'x-full-dashboard-v1':
            this.loadComXFullDashboard();
            break;

          default:
            console.error(`Unknown component: ${com}`);
            break;
        }
      }

      // Now that we've already lazy-loaded all of the required components, we
      // unsubscribe from the `queryParams` observable. Why? Because we don't
      // want to load the components again and again, whenever the URL query
      // parameters change!
      this._routeSub.unsubscribe();

      // Finally, let's subscribe to the the `queryParams` observable once
      // again, but this time, we only change the inputs of the already loaded
      // component(s).
      this._init();
    });
  }

  private _init() {
    // Let's listen to  all of the required/optional URL query parameters, and
    // pass them all to the core components (i.e., update the components' inputs
    // with new values).
    this._route.queryParams.subscribe((params) => {
      this.setComInitializer();
      this.setComXProfileImage();
      this.setComXProfileInfo();
      this.setComXFullDashboard();
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Functions, Methods                                                       */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Update the URL query parameter with the given key and value. This method
   * will be called by the HTML template (when we receive a new ticket ID).
   *
   * @async
   * @param {string} coreInputKey
   * @param {string} coreInputValue
   * @returns {*}
   */
  async updateUrlQueryParam(coreInputKey: string, coreInputValue: string) {
    // Let's update the URL query parameters with the new key-value pair...
    const currQueryParams = this._route.snapshot.queryParams;
    const newQueryParams = { [coreInputKey]: coreInputValue };
    const mergedQueryParams = { ...currQueryParams, ...newQueryParams };
    await this._router.navigate(['./'], { queryParams: mergedQueryParams });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Initializer component                                                    */
  /* //////////////////////////////////////////////////////////////////////// */

  loadComInitializer() {
    import('@x/ng-x-boilerplate-component-feature-core-initializer').then(
      (module) => {
        this.comInitializer = this.com.createComponent(
          module.V1CoreInitializerComponent,
        );
        this.setComInitializer();
      },
    );
  }

  setComInitializer() {
    if (!this.comInitializer) return;
    const params = this._route.snapshot.queryParams as ApiInputsInitializerV1;

    // Optional inputs.
    if (params['ticket-id']) {
      this.comInitializer.setInput('ticketId', params['ticket-id']);
    }
    if (params.lang) {
      this.comInitializer.setInput('lang', params.lang);
    }
    if (params['show-errors']) {
      this.comInitializer.setInput('showErrors', params['show-errors']);
    }
    if (params['track-activity']) {
      this.comInitializer.setInput('trackActivity', params['track-activity']);
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Profile Image component                                                */
  /* //////////////////////////////////////////////////////////////////////// */

  loadComXProfileImage() {
    import('@x/ng-x-boilerplate-component-feature-core-x-profile-image').then(
      (module) => {
        this.comXProfileImage = this.com.createComponent(
          module.V1CoreXProfileImageComponent,
        );
        this.setComXProfileImage();
      },
    );
  }

  setComXProfileImage() {
    if (!this.comXProfileImage) return;
    const params = this._route.snapshot.queryParams as ApiInputsXProfileImageV1;

    // Required inputs.
    if (params['user-id']) {
      this.comXProfileImage.setInput('userId', params['user-id']);
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Profile Info component                                                 */
  /* //////////////////////////////////////////////////////////////////////// */

  loadComXProfileInfo() {
    import('@x/ng-x-boilerplate-component-feature-core-x-profile-info').then(
      (module) => {
        this.comXProfileInfo = this.com.createComponent(
          module.V1CoreXProfileInfoComponent,
        );
        this.setComXProfileInfo();
      },
    );
  }

  setComXProfileInfo() {
    if (!this.comXProfileInfo) return;
    const params = this._route.snapshot.queryParams as ApiInputsXProfileInfoV1;

    // Required inputs.
    if (params['user-id']) {
      this.comXProfileInfo.setInput('userId', params['user-id']);
    }

    // Optional inputs.
    if (params['show-btn-read-more']) {
      this.comXProfileInfo.setInput(
        'showBtnReadMore',
        params['show-btn-read-more'],
      );
    }
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* X Full Dashboard component                                               */
  /* //////////////////////////////////////////////////////////////////////// */

  loadComXFullDashboard() {
    import('@x/ng-x-boilerplate-component-feature-core-x-full-dashboard').then(
      (module) => {
        this.comXFullDashboard = this.com.createComponent(
          module.V1CoreXFullDashboardComponent,
        );
        this.setComXFullDashboard();
      },
    );
  }

  setComXFullDashboard() {
    if (!this.comXFullDashboard) return;
    const params = this._route.snapshot
      .queryParams as ApiInputsXFullDashboardV1;

    // Optional inputs.
    if (params['user-id']) {
      this.comXFullDashboard.setInput('userId', params['user-id']);
    }
    if (params['show-profile-image']) {
      this.comXFullDashboard.setInput(
        'showProfileImage',
        params['show-profile-image'],
      );
    }
    if (params['show-profile-info']) {
      this.comXFullDashboard.setInput(
        'showProfileInfo',
        params['show-profile-info'],
      );
    }

    // Optional inputs (specifically for inner profile-info component).
    if (params['profile-info_show-btn-read-more']) {
      this.comXFullDashboard.setInput(
        'profileInfo_showBtnReadMore',
        params['profile-info_show-btn-read-more'],
      );
    }
  }
}
