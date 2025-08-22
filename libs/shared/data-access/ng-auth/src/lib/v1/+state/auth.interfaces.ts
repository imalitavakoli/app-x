import {
  V1Auth_MapMagicSendLoginLink,
  V1Auth_MapCheckIfLinkSeen,
  V1Auth_MapBankidCheckIfAuthenticated,
  V1Auth_MapBankidGetRequiredData,
  V1Auth_MapGetToken,
  V1Auth_MapAutoGetTicketId,
} from '@x/shared-map-ng-auth';

export interface V1Auth_Loadeds {
  magicSendLoginLink?: boolean;
  checkIfLinkSeen?: boolean;
  bankidGetRequiredData?: boolean;
  bankidCheckIfAuthenticated?: boolean;
  getToken?: boolean;
  autoGetTicketId?: boolean;
}

export interface V1Auth_Errors {
  magicSendLoginLink?: string;
  checkIfLinkSeen?: string;
  bankidGetRequiredData?: string;
  bankidCheckIfAuthenticated?: string;
  getToken?: string;
  autoGetTicketId?: string;
}

export interface V1Auth_Datas {
  magicSendLoginLink?: V1Auth_MapMagicSendLoginLink;
  checkIfLinkSeen?: V1Auth_MapCheckIfLinkSeen;
  bankidGetRequiredData?: V1Auth_MapBankidGetRequiredData;
  bankidCheckIfAuthenticated?: V1Auth_MapBankidCheckIfAuthenticated;
  getToken?: V1Auth_MapGetToken;
  autoGetTicketId?: V1Auth_MapAutoGetTicketId;
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Interface of success/failure Actions                                       */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1Auth_SuccessAction {
  relatedTo: V1Auth_ResponseIsRelatedTo;
  data: V1Auth_ResponseData;
  extra?: { [key: string]: any };
}

export interface V1Auth_FailureAction {
  relatedTo: V1Auth_ResponseIsRelatedTo;
  error: string;
  extra?: { [key: string]: any };
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Useful within success/failure Actions interfaces                           */
/* ////////////////////////////////////////////////////////////////////////// */

type V1Auth_ResponseIsRelatedTo =
  | 'magicSendLoginLink'
  | 'checkIfLinkSeen'
  | 'bankidGetRequiredData'
  | 'bankidCheckIfAuthenticated'
  | 'getToken'
  | 'autoGetTicketId';

type V1Auth_ResponseData =
  | V1Auth_MapMagicSendLoginLink
  | V1Auth_MapCheckIfLinkSeen
  | V1Auth_MapBankidGetRequiredData
  | V1Auth_MapBankidCheckIfAuthenticated
  | V1Auth_MapGetToken
  | V1Auth_MapAutoGetTicketId;
