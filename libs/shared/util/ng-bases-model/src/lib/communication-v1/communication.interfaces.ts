import { V2BasePage_Error } from '../base-page-v2/base-page.interfaces';
import { V1Communication_Event_Page_V1_Auth } from './communication-lib-auth.interfaces';
import {
  V1Communication_Event_Util_V2_BasePage_ParentExtU,
  V1Communication_Data_Util_V2_BasePage_ParentExtU,
  V1Communication_Event_Util_V2_BasePage_Child,
} from './communication-lib-bases.interfaces';

/**
 * It's the event that the Communication service ('util' lib) can emit.
 *
 * @export
 * @interface V1Communication_Event
 * @typedef {V1Communication_Event}
 */
export interface V1Communication_Event {
  /**
   * The event type.
   *
   * - error: When an error occurs.
   * - changeByUser: When the user changes something by interacting UI.
   * - changeByLogic: When app itself changes something in the TS codes.
   *
   * @type {string}
   */
  type: 'error' | 'changeByUser' | 'changeByLogic';

  /**
   * This is usually the file + event name that gets emitted. Here's
   * the schema: '@ClassName:EventName'.
   *
   * e.g., '@V1DashboardPageBaseComponent:ShowHeader'.
   * Why to use such schema? Because it's easier to search & debug later on, as
   * we can easily understand where this event is related to.
   *
   * @type {string}
   */
  name: string;

  /**
   * The value of the event.
   *
   * @type {any}
   */
  value?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | any
    | V2BasePage_Error
    | V1Communication_Event_Page_V1_Auth
    | V1Communication_Event_Util_V2_BasePage_ParentExtU
    | V1Communication_Event_Util_V2_BasePage_Child;
}

/**
 * It's the data that the Communication service ('util' lib) can store.
 *
 * @export
 * @interface V1Communication_Data
 * @typedef {V1Communication_Data}
 */
export interface V1Communication_Data {
  /**
   * App version.
   *
   * NOTE: If the lib that is going to store a data via the communication
   * service is a 'page' lib, it may have access to the app's version number
   * (if the app already passed this info via the route static data in its
   * `app.routes.ts` file).
   *
   * @type {?string}
   */
  appVersion?: string;

  /**
   * Any probable extra info that is going to be stored in the communication
   * service.
   *
   * @type {any}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: any | V1Communication_Data_Util_V2_BasePage_ParentExtU;
}
