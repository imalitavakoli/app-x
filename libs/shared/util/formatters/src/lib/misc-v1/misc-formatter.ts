/**
 * Add any properties that the `data` object might have, in the `map` object,
 * ONLY IF `map` doesn't have that property already in itself!
 *
 * @export
 * @param {any} data
 * @param {any} map
 * @returns {any}
 */
export function v1MiscAddAlreadyMappedProps(data: any, map: any): any {
  for (const key in data) {
    if (!map[key]) {
      map[key] = data[key];
    }
  }

  return map;
}

/**
 * Remove trailing slashes and spaces in a string.
 *
 * @export
 * @param {string} input
 * @returns {string}
 */
export function v1MiscFixPath(input: string) {
  return input.replace(/(?:\/|\s)+$/, '');
}
