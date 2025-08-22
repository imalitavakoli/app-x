/* ////////////////////////////////////////////////////////////////////////// */
/* Auth 'page' V1 lib                                                         */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * This is an interface that can be emitted from `shared-page-ng-auth` lib (V1).
 * It's one of the probable `value` types of a 'Communication Event' interface
 * (`V1Communication_Event`).
 *
 * @export
 * @interface V1Communication_Event_Page_V1_Auth
 * @typedef {V1Communication_Event_Page_V1_Auth}
 */
export interface V1Communication_Event_Page_V1_Auth {
  type: 'email' | 'bankid';
  input?: string;
  url?: string;
}
