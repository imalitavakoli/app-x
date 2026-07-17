import { V1XProfileInfo_MapData } from '@x/shared-map-ng-x-profile-info';

export interface V2XProfileInfo_Loadeds {
  data?: boolean;
}

export interface V2XProfileInfo_Errors {
  data?: string;
}

export interface V2XProfileInfo_Datas {
  data?: V1XProfileInfo_MapData;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V2XProfileInfo_SuccessAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  data: V2XProfileInfo_ResponseData;
  extra?: { [key: string]: any };
}

export interface V2XProfileInfo_FailureAction {
  relatedTo: V2XProfileInfo_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type V2XProfileInfo_ResponseIsRelatedTo = 'data';

type V2XProfileInfo_ResponseData = V1XProfileInfo_MapData;
