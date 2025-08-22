/* ////////////////////////////////////////////////////////////////////////// */
/* Get data                                                                   */
/* ////////////////////////////////////////////////////////////////////////// */

export interface V1XProfileInfo_ApiData {
  user_id: number;
  full_name: string;
  date_of_birth: string; // '1991-05-01T00:00:00'
  bio?: string;
  country?: string;
}

export interface V1XProfileInfo_MapData {
  userId: number;
  fullName: string;
  dateOfBirth: string; // '1991-05-01T00:00:00'
  bio?: string;
  country?: string;
}
