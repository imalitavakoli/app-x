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

/**
 * Make a string like `/dashboard` compatible with GA4 (Google Analytics 4)
 * naming convention. We basically do the following:
 * - Remove the last trailing slash.
 * - Replace the first trailing slash with 'navTo_'.
 * - Replace any other slashes with '_'.
 * - Replace '-' with CamelCase. e.g., `my-dashboard` becomes `myDashboard`.
 * - Remove '?' (if it exists) and everything that comes after it.
 * - If character length is more than 40, then truncate it to 40 characters.
 *
 * So as an example `/my-dashboard` becomes `navTo_myDashboard`,
 * `/my-dashboard/` becomes `navTo_myDashboard`, `/my-dashboard/overview`
 * becomes `navTo_myDashboard_overview`, and
 * `/my-dashboard/overview/very-long-name-is-here` becomes
 * `navTo_myDashboard_overview_veryLongNameI`.
 *
 * @export
 * @param {string} input
 * @returns {string}
 */
export function v1MiscMakeGA4ForPageNav(input: string) {
  let output = input.trim();
  if (output.endsWith('/')) output = output.slice(0, -1);
  if (output.startsWith('/')) output = 'navTo_' + output.slice(1);
  output = output.replace(/\//g, '_');
  output = output.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  if (output.includes('?')) output = output.split('?')[0];
  if (output.length > 40) output = output.slice(0, 40);
  return output;
}
