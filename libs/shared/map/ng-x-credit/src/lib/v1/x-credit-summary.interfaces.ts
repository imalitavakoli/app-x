import { V1XCredit_Status } from './x-credit-generic.interfaces';

/* ////////////////////////////////////////////////////////////////////////// */
/* Get summary data                                                           */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_ApiSummary {
  user_id: number;
  status: V1XCredit_Status;
  created_at: string; // '2022-05-01T00:00:00'
}

export interface V1XCredit_MapSummary {
  userId: number;
  status: V1XCredit_Status;
  createdAt: string; // '2022-05-01T00:00:00'
}
