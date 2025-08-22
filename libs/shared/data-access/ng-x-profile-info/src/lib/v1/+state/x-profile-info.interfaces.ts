import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';

export interface V1XProfileInfo_Loadeds {
  data?: boolean;
}

export interface V1XProfileInfo_Errors {
  data?: string;
}

export interface V1XProfileInfo_Datas {
  data?: V1XProfileInfo_MapData;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XProfileInfo_SuccessAction {
  relatedTo: V1XProfileInfo_ResponseIsRelatedTo;
  data: V1XProfileInfo_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1XProfileInfo_FailureAction {
  relatedTo: V1XProfileInfo_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type V1XProfileInfo_ResponseIsRelatedTo = 'data';

type V1XProfileInfo_ResponseData = V1XProfileInfo_MapData;
