/* ////////////////////////////////////////////////////////////////////////// */
/* Set/Update/Delete XUsers                                                    */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Interface of a single user, that is in the json file we're going to receive.
 *
 * @export
 * @interface V1XUsers_ApiUser
 * @typedef {V1XUsers_ApiUser}
 */
export interface V1XUsers_ApiUser {
  id?: number; // Primary ID. NOTE: We don't provide it in POST requests.
  name: string;
  username: string;
  email: string;
  created_at?: string; // '2022-05-01T00:00:00'
}

/**
 * Simplified interface of the users entity.
 *
 * @export
 * @interface V1XUsers_MapUser
 * @typedef {V1XUsers_MapUser}
 */
export interface V1XUsers_MapUser {
  id?: number; // Primary ID. NOTE: We don't have it when adding an entity.
  name: string;
  username: string;
  email: string;
  createdAt?: string; // '2022-05-01T00:00:00'
}
