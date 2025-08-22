import {
  v1LocalStorageSet,
  v1LocalStorageGet,
  v1LocalStorageRemove,
} from './local-storage';

type LocalWebcom = {
  // e.g., `chart: { locationId: '123' }`
  [key: string]: any;

  // e.g., `errors: [{ key: 'config', value: 'error message' }]`
  errors?: {
    key: string;
    value: string;
  }[];
};

/* ////////////////////////////////////////////////////////////////////////// */
/* Dealing with stored web-components' data                                   */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Tries to get one of the event's payload of an already loaded web-component in
 * the client's site/app. If it was already in LocalStorage, it returns that
 * value, otherwise it returns `undefined`.
 *
 * @export
 * @param {string} name
 * @param {string} eventName
 * @returns {*}
 */
export function v1LocalWebcomGet(name: string, eventName: string) {
  // First let's see if 'eWebcom' key already exists in LocalStorage or not.
  const webcomObj = v1LocalStorageGet('eWebcom') as LocalWebcom;

  // If `webcomObj` and its key was truthy, then just return the key's value.
  if (webcomObj && webcomObj[name] && webcomObj[name][eventName]) {
    return webcomObj[name][eventName];
  }

  // If we're here, it means that `webcomObj` or its key were not truthy! So
  // just return `undefined`.
  return undefined;
}

/**
 * Tries to get one of the event's payload of an already loaded web-component in
 * the client's site/app. If it was already in LocalStorage, it modifies its
 * value, otherwise it sets it with a value for the first time.
 *
 * NOTE: To remove an event's data (payload), simply call this function and set
 * the `value` to `undefined`.
 *
 * NOTE: It saves all of the loaded web-components items in LocalStorage as a
 * stringified json under the `eWebcom` key.
 *
 * @export
 * @param {string} name
 * @param {string} eventName
 * @param {*} value
 */
export function v1LocalWebcomSet(name: string, eventName: string, value: any) {
  // First let's see if 'eWebcom' key already exists in LocalStorage or not.
  let webcomObj = v1LocalStorageGet('eWebcom') as LocalWebcom;

  // If `webcomObj` was truthy, then just set a new value for the key.
  // Otherwise, create `webcomObj` itself, and put the key with its default
  // value inside of it.
  if (webcomObj) {
    if (webcomObj[name]) webcomObj[name][eventName] = value;
    else webcomObj[name] = { [eventName]: value };
  } else {
    webcomObj = { [name]: { [eventName]: value } };
  }

  // Now we have our created/modified `webcomObj`. So let's save it in LocalStorage.
  v1LocalStorageSet('eWebcom', webcomObj);
}

/**
 * Removed the entire `eWebcom` key in LocalStorage.
 *
 * @export
 */
export function v1LocalWebcomClearAll() {
  v1LocalStorageRemove('eWebcom');
}

/* ////////////////////////////////////////////////////////////////////////// */
/* Dealing with stored errors                                                 */
/* ////////////////////////////////////////////////////////////////////////// */

/**
 * Tries to get all of the errors of an already loaded web-component in the
 * client's site/app. If it was already in LocalStorage, it returns them,
 * otherwise it returns `undefined`.
 *
 * @export
 * @returns {*}
 */
export function v1LocalWebcomGetAllErrors() {
  const webcomObj = v1LocalStorageGet('eWebcom') as LocalWebcom;
  if (webcomObj && webcomObj.errors) {
    return webcomObj.errors;
  }
  return undefined;
}

/**
 * Tries to get all of the errors of an already loaded web-component in the
 * client's site/app. If it was already in LocalStorage, it pushes a new error
 * to the list, otherwise it sets it with a new error for the first time.
 *
 * NOTE: It saves all of the loaded web-components items in LocalStorage as a
 * stringified json under the `eWebcom` key.
 *
 * @export
 * @param {{ key: string; value: string }} error
 */
export function v1LocalWebcomSetOneError(error: {
  key: string;
  value: string;
}) {
  let webcomObj = v1LocalStorageGet('eWebcom') as LocalWebcom;
  if (webcomObj) {
    if (webcomObj.errors) webcomObj.errors.push(error);
    else webcomObj.errors = [error];
  } else {
    webcomObj = { errors: [error] };
  }
  v1LocalStorageSet('eWebcom', webcomObj);
}

/**
 * Tries to get all of the errors of an already loaded web-component in the
 * client's site/app. If it was already in LocalStorage, it clears them.
 *
 * @export
 */
export function v1LocalWebcomClearAllErrors() {
  const webcomObj = v1LocalStorageGet('eWebcom') as LocalWebcom;
  if (webcomObj && webcomObj.errors) {
    webcomObj.errors = undefined;
    v1LocalStorageSet('eWebcom', webcomObj);
  }
}
