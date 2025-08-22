import { V1XCredit_Currency } from './x-credit-generic.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* API: Payload, Error                                                        */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1XCredit_ApiErrorDetail = 'USER_MISSING_DETAIL_DATA';

/* ////////////////////////////////////////////////////////////////////////// */
/* Get detail data                                                            */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_ApiDetail {
  user_id: number;
  balance: number;
  balance_currency: V1XCredit_Currency;
  updated_at: string; // '2022-05-01T00:00:00'
  expired_at?: string; // '2023-10-01T00:00:00'
}

export interface V1XCredit_MapDetail {
  userId: number;
  balance: number;
  balanceCurrency: V1XCredit_Currency;
  updatedAt: string; // '2022-05-01T00:00:00'
  expiredAt?: string; // '2023-10-01T00:00:00'
}
