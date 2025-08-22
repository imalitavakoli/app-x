import {
  v1LocalStorageSet,
  v1LocalStorageGet,
  v1LocalStorageRemove,
} from './local-storage';

type LocalPref = {
  [key: string]: any;
};

/**
 * Tries to get one of the user's saved local preferences. If it was already in
 * LocalStorage, it returns that value, otherwise it returns `undefined`.
 *
 * @example
 * const storedItem =v1LocalPrefGet('libname_param');
 * const storedItem =v1LocalPrefGet('insights_lastSelectedLocationId');
 *
 * @export
 * @param {string} key
 * @returns {*}
 */
export function v1LocalPrefGet(key: string) {
  // First let's see if 'ePref' key already exists in LocalStorage or not.
  const prefObj = v1LocalStorageGet('ePref') as LocalPref;

  // If `prefObj` and its key was truthy, then just return the key's value.
  if (prefObj) {
    if (prefObj[key] !== undefined) return prefObj[key];
  }

  // If we're here, it means that `preObj` or its key were not truthy! So just
  // return `undefined`.
  return undefined;
}

/**
 * Tries to get one of the user's saved local preferences. If it was already in
 * LocalStorage, it modifies its value, otherwise it sets it with a value for
 * the first time.
 *
 * NOTE: It saves all of the preferences in LocalStorage as a stringified json
 * under the `ePref` key.
 *
 * @example
 *v1LocalPrefSet('libname_param', 12345);
 *v1LocalPrefSet('insights_lastSelectedLocationId', 12345);
 *
 * @export
 * @param {string} key
 * @param {*} value
 */
export function v1LocalPrefSet(key: string, value: any): void {
  // First let's see if 'ePref' key already exists in LocalStorage or not.
  let prefObj = v1LocalStorageGet('ePref') as LocalPref;

  // If `prefObj` was truthy, then just set a new value for the key. Otherwise,
  // create `prefObj` itself, and put the key with its default value inside of it.
  if (prefObj) {
    prefObj[key] = value;
  } else {
    prefObj = { [key]: value };
  }

  // Now we have our created/modified `prefObj`. So let's save it in LocalStorage.
  v1LocalStorageSet('ePref', prefObj);
}

/**
 * Removed the entire `ePref` key in LocalStorage.
 *
 * @export
 */
export function v1LocalPrefClearAll() {
  v1LocalStorageRemove('ePref');
}
