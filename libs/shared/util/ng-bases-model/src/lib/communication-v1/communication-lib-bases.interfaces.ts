import { V1XUsers_MapUser } from '@x/shared-map-ng-x-users';

/* ////////////////////////////////////////////////////////////////////////// */
/* base-page-v2 'util' lib                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * This is an interface that can be used to store data from
 * `shared-util-ng-bases` lib (`base-page-parent-ext-x-users.component.ts`).
 * It's one of the probable `extra` types of a 'Communication Data' interface
 * (`V1Communication_Data`).
 *
 * @export
 * @interface V1Communication_Data_Util_V2_BasePage_ParentExtU
 * @typedef {V1Communication_Data_Util_V2_BasePage_ParentExtU}
 */
export interface V1Communication_Data_Util_V2_BasePage_ParentExtU {
  initialUserId: number;
  initialUser: V1XUsers_MapUser;
}

/**
 * This is an interface that can be emitted from `shared-util-ng-bases` lib
 * (`base-page-parent-ext-x-users.component.ts`).
 * It's one of the probable `value` types of a 'Communication Event' interface
 * (`V1Communication_Event`).
 *
 * @export
 * @interface V1Communication_Event_Util_V2_BasePage_ParentExtU
 * @typedef {V1Communication_Event_Util_V2_BasePage_ParentExtU}
 */
export interface V1Communication_Event_Util_V2_BasePage_ParentExtU {
  user: V1XUsers_MapUser;
}

/**
 * This is an interface that can be emitted from `shared-util-ng-bases` lib
 * (`base-page-child.component.ts`).
 * It's one of the probable `value` types of a 'Communication Event' interface
 * (`V1Communication_Event`).
 *
 * @export
 * @interface V1Communication_Event_Util_V2_BasePage_Child
 * @typedef {V1Communication_Event_Util_V2_BasePage_Child}
 */
export interface V1Communication_Event_Util_V2_BasePage_Child {
  urlRoot: string;
  pageName: string;
}
