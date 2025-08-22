export function v1LocalStorageSet(key: string, value: object) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function v1LocalStorageGet(key: string): object {
  return JSON.parse(localStorage.getItem(key) as string);
}

export function v1LocalStorageRemove(key: string) {
  localStorage.removeItem(key);
}

export function v1LocalStorageClear() {
  localStorage.clear();
}

/**
 * This function is useful for deleting an item in Local Storage after a certain
 * amount of time. So it does the following:
 * 1. If the item is not in Local Storage at all , it just returns `true`.
 * 2. If the item is in Local Storage, but it didn't exceed the given time, it
 *    returns `false`.
 * 3. If the item is in Local Storage and it exceeded the given time, it removes
 *    the item from Local Storage and returns `true`.
 *
 * @example
 * // Here's what you need to do whenever you like to set an item (for the 1st time or any other time) with limited lifetime in Local Storage:
 * v1LocalStorageSet('eLibname_something', { some: 'data' });
 * v1LocalStorageCheckLifeOfItem('eLibname_something', 'eLibname_somethingDeleteTime', 1000 * 60 * 60 * 24 * 10);
 *
 * // Here's what you need to do whenever you like to check if that item's life has ended or not:
 * const isItemDeleted = v1LocalStorageCheckLifeOfItem('eLibname_something', 'eLibname_somethingDeleteTime', 1000 * 60 * 60 * 24 * 10);
 *
 * @param  {String} key                     Name of the item with limited lifetime
 * @param  {String} lastTimeClearedKey      Name of the item that holds the delete time of the target item. Its duty is storing the last time that item has been removed
 * @param  {Number} [lifeTime=86,400,000]   The life time in milliseconds. The item will be removed if the life of the item exceeds the time that is given. e.g., in order to delete the item after 10 days, this is what it means in milliseconds: 1000ml * 60s * 60m * 24h * 10d
 */
export function v1LocalStorageCheckLifeOfItem(
  key: string,
  lastTimeClearedKey: string,
  lifeTime = 1000 * 60 * 60 * 24 * 1,
) {
  // If the item is not in Local Storage, just return `false`, because there is
  // no item at all!
  if (!v1LocalStorageGet(key)) return true;

  // If we're here, it means that the item exists, so we should check if we
  // should delete it or not.
  const lastTimeCleared = v1LocalStorageGet(lastTimeClearedKey) as {
    now: number;
  };
  const now = new Date().getTime();

  // If there was no 'lastTimeCleared' item in Local Storage, set it and set its
  // value to now and just return! Because there was no time stored in Local
  // Storage for us at all, so that we can check it and based on that decide to
  // delete the desire item or not.
  if (!lastTimeCleared) {
    v1LocalStorageSet(lastTimeClearedKey, { now: now });
    return false;
  }

  // If we should delete the item, remove it along side of `lastTimeClearedKey`
  // from Local Storage. Why? Because when we remove the item, we should also
  // reset its lifetime as well, right? So that's why we remove `lastTimeClearedKey`.
  if (now - lastTimeCleared.now > lifeTime) {
    v1LocalStorageRemove(key);
    v1LocalStorageRemove(lastTimeClearedKey);
    return true;
  }

  // If we're here, it means that the delete time has not reached yet and the
  // item exists. So just return `false`.
  return false;
}
