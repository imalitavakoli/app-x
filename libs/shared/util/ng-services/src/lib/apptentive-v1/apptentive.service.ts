import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { v1MiscMakeGA4ForPageNav } from '@x/shared-util-formatters';

import { V1HtmlEditorService } from '../html-editor-v1/html-editor.service';

/**
 * In this service, we provide the Apptentive service.
 * Read more: https://help.alchemer.com/help/alchemer-web-integration-guide
 *
 * In simple terms, Alchemer (Apptentive) is a customer feedback platform that
 * allows our clients to listen to their users, engage with them, and act on
 * their feedback in meaningful ways. By the help of this service, we can send
 * events in different occasions, and our client herself will be able to show
 * Interaction (e.g., surveys, message centers, etc.) based on the app's events
 * in their own Alchemer dashboard to engage with their users.
 *
 * NOTE: When Alchemer (Apptentive) Interactions have been shown, we can listen
 * to their specific events and make callbacks accordingly:
 * `document.addEventListener('apptentive:survey:submit', (event) => { });`
 * Read more: https://help.alchemer.com/help/alchemer-web-faqs
 * Here are the list of events that we can listen to:
 *  'apptentive:love-dialog:no',
 *  'apptentive:love-dialog:yes',
 *  'apptentive:message-center:send',
 *  'apptentive:survey:dismiss',
 *  'apptentive:survey:submit'
 *
 * @export
 * @class V1ApptentiveService
 * @typedef {V1ApptentiveService}
 */
@Injectable({
  providedIn: 'root',
})
export class V1ApptentiveService {
  private _router = inject(Router);

  /* //////////////////////////////////////////////////////////////////////// */
  /* Methods                                                                  */
  /* //////////////////////////////////////////////////////////////////////// */

  init(projectId: string, isDebug = false, interactionsHolder = 'body') {
    // Init Apptentive SDK.
    V1HtmlEditorService.insertScript(
      `
      (function initApptentiveSDK(){var ApptentiveSDK=window.ApptentiveSDK=window.ApptentiveSDK||[];if(!ApptentiveSDK.version){if(!ApptentiveSDK.loaded){ApptentiveSDK.loaded=true;ApptentiveSDK.methods=["buildDevice","createConversation","createMessage","engage","getSegments","identifyPerson","setOption","setPageName","showInteraction","showMessageCenter","updatePerson"];ApptentiveSDK.factory=function factory(t){return function f(){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key]}var e=Array.prototype.slice.call(args);e.unshift(t);ApptentiveSDK.push(e);return ApptentiveSDK}};for(var i=0;i<ApptentiveSDK.methods.length;i++){var method=ApptentiveSDK.methods[i];ApptentiveSDK[method]=ApptentiveSDK.factory(method)}ApptentiveSDK.LOADER_VERSION="1.0.0"}}})();
      `,
    );

    V1HtmlEditorService.insertScript(
      `https://sdk.apptentive.com/v1/apps/${projectId}/websdk`,
    );

    // Set debug mode.
    (window as any).ApptentiveSDK.setOption('debug', isDebug);

    // Define where to render Interactions. Any valid CSS selector is supported.
    (window as any).ApptentiveSDK.setOption('domNode', interactionsHolder);
  }

  /**
   * To begin sending data to Alchemer (Apptentive), the first thing that needs
   * to be done is creating a conversation. We can think of a conversation like
   * an on-going dialog with people engaging with the app. This method should
   * mostly be called once the app initialized (right after `init` method).
   *
   * @param {string} appVersion
   * @param {*} [deviceData=undefined] - Custom data about the device
   */
  createConversation(appVersion: string, deviceData: any = undefined) {
    // Helper function to inject device data.
    const injectDeviceData = (data: any) => {
      if (!data) return {};
      return { device: { custom_data: data } };
    };

    (window as any).ApptentiveSDK.createConversation({
      app_release: {
        version: appVersion,
      },
      ...injectDeviceData(deviceData),
    });
  }

  /**
   * After that user logs in, we call this method to identify the user in
   * Alchemer (Apptentive) system.
   *
   * @param {number} userId
   * @param {*} [userData=undefined] - Custom data about the user
   */
  identifyPerson(userId: number, userData: any = undefined) {
    // Helper function to inject user data.
    const injectUserData = (data: any) => {
      if (!data) return {};
      return { custom_data: data };
    };

    (window as any).ApptentiveSDK.identifyPerson({
      unique_token: userId.toString(),
      // name: 'Ali Tavakoli',
      // email: 'imalitavakoli@gmail.com',
      ...injectUserData(userData),
    });
  }

  /**
   * Send events. These events can be used to trigger Interactions in Alchemer
   * (Apptentive) dashboard. For example, we can send an event when user clicks
   * on a button, and then in Alchemer dashboard, we can show a survey to the
   * user based on that event.
   *
   * @param {string} eventName
   * @param {*} [data=undefined]
   */
  engage(eventName: string, data: any = undefined) {
    (window as any).ApptentiveSDK.engage(eventName, data);
  }

  /** Show the message center. Users can send feedback through it */
  showMessageCenter() {
    (window as any).ApptentiveSDK.showMessageCenter();
  }

  /** Call `engage` when page navigation (routing) happens automatically */
  autoScreenTracking() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.engage(v1MiscMakeGA4ForPageNav(event.urlAfterRedirects));
      }
    });
  }
}
