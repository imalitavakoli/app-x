/**
 * Halted step that prevented the app from being initialized.
 *
 * @export
 * @interface HaltedState
 * @typedef {HaltedState}
 */
export interface HaltedState {
  haltedStep: string;
}

export type ComType =
  | 'initializer-v1'
  | 'x-profile-image-v1'
  | 'x-profile-info-v1'
  | 'x-full-dashboard-v1';

// IMPORTANT: In a real-world scenario (in your sites or apps), most of the
// components, require some inputs that you already need to know their valid
// values, otherwise you cannot load them successfully. For example, to load the
// 'x-profile-info' component, you need to provide it with some inputs such as
// `user-id`.So to satisfy such components' required inputs, first you need to use
// our API to gather some information about your users data (e.g., by calling
// `GET {url}/v1/users` API endpoint), and then load the components. Only after
// that, you can initialize most of the components and provide their required
// inputs with valid values.

/* ////////////////////////////////////////////////////////////////////////// */
/* Initializer component                                                      */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * URL Query parameters that our app accepts for this component: initializer.
 *
 * This component itself doesn't present anything, it just sets up all
 * prerequisites of all the other components. Such as authenticating, changing
 * the components' language, showing errors, and tracking user activities (if
 * you already have your users' consent).
 *
 * @export
 * @interface ApiInputsInitializerV1
 * @typedef {ApiInputsInitializerV1}
 */
export interface ApiInputsInitializerV1 {
  // Optional inputs.
  'ticket-id'?: string; // Default: `null`.
  lang?: string; // Default: `undefined`.
  'show-errors'?: string; // Default: 'true'. Valid values: 'true' | 'false'
  'track-activity'?: string; // Default: 'false'. Valid values: 'true' | 'false'
}

/* ////////////////////////////////////////////////////////////////////////// */
/* X Profile Image component                                                  */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * URL Query parameters that our app accepts for this component: x-profile-image.
 *
 * It shows user's profile image.
 *
 * @export
 * @interface ApiInputsXProfileImageV1
 * @typedef {ApiInputsXProfileImageV1}
 */
export interface ApiInputsXProfileImageV1 {
  // Required inputs.
  'user-id': string;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* X Profile Info component                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * URL Query parameters that our app accepts for this component: x-profile-info.
 *
 * It shows user's profile information.
 *
 * @export
 * @interface ApiInputsXProfileInfoV1
 * @typedef {ApiInputsXProfileInfoV1}
 */
export interface ApiInputsXProfileInfoV1 {
  // Required inputs.
  'user-id': string;

  // Optional inputs.
  'show-btn-read-more'?: string; // Default: 'false'. Valid values: 'true' | 'false'. NOTE: If 'true', then it shows 'Read More' button.
}

/* ////////////////////////////////////////////////////////////////////////// */
/* X Full Dashboard component                                                 */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * URL Query parameters that our app accepts for this component: full-dashboard.
 *
 * It's our full dashboard solution. It provides a controller (that has a
 * user dropdown, and shows user's profile image, info, and etc.).
 *
 * @export
 * @interface ApiInputsXFullDashboardV1
 * @typedef {ApiInputsXFullDashboardV1}
 */
export interface ApiInputsXFullDashboardV1 {
  // Optional inputs.
  'user-id'?: string; // Default: `undefined`. NOTE: If not provided, then it will use the first user that is fetched from API.
  'show-profile-image'?: string; // Default: 'true'. Valid values: 'true' | 'false'.
  'show-profile-info'?: string; // Default: 'true'. Valid values: 'true' | 'false'.

  // Optional inputs (specifically for inner profile-info component).
  'profile-info_show-btn-read-more'?: string; // Default: 'false'. Valid values: 'true' | 'false'. NOTE: If 'true', then it shows 'Read More' button.
}
