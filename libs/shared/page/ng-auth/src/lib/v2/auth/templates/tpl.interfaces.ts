export interface V2Auth_Submit {
  type: 'email' | 'bankid';

  /** This is available for the following login types: email */
  whatUserEntered?: string;

  /** This is available for the following login types: bankid */
  whatUrlToRedirect?: string;
}
