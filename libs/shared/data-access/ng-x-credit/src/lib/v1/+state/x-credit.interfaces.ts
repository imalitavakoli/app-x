import {
  V1XCredit_MapSummary,
  V1XCredit_MapDetail,
} from '@x/shared-map-ng-x-credit';

export interface V1XCredit_Loadeds {
  summary?: boolean;
  detail?: boolean;
}

export interface V1XCredit_Errors {
  summary?: string;
  detail?: string;
}

export interface V1XCredit_Datas {
  summary?: V1XCredit_MapSummary;
  detail?: V1XCredit_MapDetail;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XCredit_InstancePropsSuccess {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  data: V1XCredit_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1XCredit_InstancePropsFailure {
  relatedTo: V1XCredit_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

export type V1XCredit_ResponseIsRelatedTo = 'summary' | 'detail';

type V1XCredit_ResponseData = V1XCredit_MapSummary | V1XCredit_MapDetail;
