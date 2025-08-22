/* ////////////////////////////////////////////////////////////////////////// */
/* Auth by: Magic                                                             */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Exact payload object that API expects.
 *
 * @export
 * @interface V1Auth_ApiPayloadMagicSendLoginLink
 * @typedef {V1Auth_ApiPayloadMagicSendLoginLink}
 */
export interface V1Auth_ApiPayloadMagicSendLoginLink {
  /**
   * ID Of our client! i.e., person/company who's using our service.
   *
   * @type {number}
   */
  client_id: number; // 14934656510

  /**
   * Type of user authentication.
   *
   * NOTE: It's `email` most of the times.
   *
   * @type {('email' | 'custom' | 'account_number')}
   */
  type: 'email' | 'custom' | 'account_number';

  /**
   * It's the user's email address most of the times.
   *
   * NOTE: If authentication type is `account_number`, this property may not be
   * the user's email address.
   *
   * NOTE: If authentication type is `custom`, this property will not be
   * available. Instead, we should send the user's email address in the `custom`
   * property.
   *
   * @type {?string}
   */
  user_reference?: string; // 'ali+demo@x.io'

  /**
   * Some custom properties that we may need to send to the server, when
   * authenticating the user.
   *
   * NOTE: It will be required, if authentication type is `custom`.
   *
   * @type {?{
   *     pref_language?: string;
   *     customer_number?: string;
   *     email?: string;
   *   }}
   */
  custom?: {
    pref_language?: string;
    customer_number?: string;
    email?: string;
  };
}

/**
 * Exact API response object interface.
 *
 * @export
 * @interface V1Auth_ApiMagicSendLoginLink
 * @typedef {V1Auth_ApiMagicSendLoginLink}
 */
export interface V1Auth_ApiMagicSendLoginLink {
  email: string;
  ticket: {
    id: string; // '6c8a8cb2-dacc-498f-8f5f-5db99494f852'
    status: 'initiated';
  };
}

/**
 * Simplified version of API response object interface.
 *
 * @export
 * @interface V1Auth_MapMagicSendLoginLink
 * @typedef {V1Auth_MapMagicSendLoginLink}
 */
export interface V1Auth_MapMagicSendLoginLink {
  email: string;
  ticketId: string; // '6c8a8cb2-dacc-498f-8f5f-5db99494f852'
}

export interface V1Auth_ApiCheckIfLinkSeen {
  id: string;
  status: 'initiated' | 'completed' | 'error';
}

export interface V1Auth_MapCheckIfLinkSeen {
  ticketId: string;
  ticketStatus: 'initiated' | 'completed' | 'error';
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Auth by: Bankid                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Auth_ApiBankidGetRequiredData {
  order_ref: string; // '7356d25f-e0ee-32vb-59rj-538c5a4d6436'
  auto_start_token: string; // '254501c4-58fg-98pb-8d5c-efe718faadbt'
  status: 'pending';
}

export interface V1Auth_MapBankidGetRequiredData {
  orderRef: string;
  autoStartToken: string;
}

export interface V1Auth_ApiBankidCheckIfAuthenticated {
  order_ref: string; // '123abc-456def'
  ticket_id?: string | null; // '123abc-456def'
  bankid_status: 'unknown' | 'outstanding_transaction' | 'expired_transaction';
  status: 'pending' | 'complete' | 'failed' | 'error';
}

export interface V1Auth_MapBankidCheckIfAuthenticated {
  /**
   * Completed ticket ID.
   * NOTE: This property will be available ONLY IF `ticketStatus` is `complete`.
   *
   * @type {?string}
   */
  ticketId?: string;

  ticketStatus: 'pending' | 'complete' | 'failed' | 'error';
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Auth by: Magic, Bankid                                                     */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Auth_ApiGetToken {
  /**
   * Id of the user who is trying to login.
   *
   * @type {number}
   */
  user_id: number;

  /**
   * Access/Refresh tokens details.
   *
   * @type {{
   *     access_token: string;
   *     token_type: 'bearer';
   *     expires_in: number;
   *     refresh_token?: string;
   *     refresh_token_expires_in: number;
   *   }}
   */
  token: {
    token_type: 'bearer';
    access_token: string;
    expires_in: number;
    refresh_token?: string; // Some clients may not have refresh token.
    refresh_token_expires_in?: number; // Some clients may not have refresh token.
  };
}

export interface V1Auth_MapGetToken {
  userId: number;
  accessToken: string;
  refreshToken?: string; // Some clients may not have refresh token.
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Auth by: SSO (auto-login)                                                  */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Auth_ApiAutoGetTicketId {
  ticket_id: string;
}

export interface V1Auth_MapAutoGetTicketId {
  ticketId: string;
}
