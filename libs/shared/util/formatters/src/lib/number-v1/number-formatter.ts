/**
 * Retruns the number format based on the provided unit.
 *
 * NOTE: For better numbers readability, we format them in our apps.
 *
 * NOTE: To format numbers in Angular, we can use `formatNumber` function:
 * `formatNumber(123.456, 'en-GB', '1.2-2');`, or `DecimalPipe` pipe in
 * the template: `{{ 123.456 | number: '1.2-2' : 'en-GB' }}`.
 *
 * NOTE: To format currency in Angular, we can use `formatCurrency` function:
 * `formatCurrency(123.456, 'en-GB', getCurrencySymbol('GBP', 'narrow'), 'GBP', '1.2-2');`.
 *
 * NOTE: For formatting energy/power values, we should first convert them into
 * their appropriate unit (e.g. kWh, MWh, GWh, etc.) and then use that newly
 * converted number in `formatNumber` function with the help of this function to
 * format them appropriately.
 *
 * @example
 * v1NumberGetDigitsInfo(123.456); // '1.0-0'
 *
 * @export
 * @param {number} value
 * @param {('energy' | 'cost')} [unit='energy']
 * @returns {string}
 */
export function v1NumberGetDigitsInfo(
  value: number,
  unit: 'energy' | 'cost' = 'energy',
): string {
  let numFormat: string;
  if (unit === 'cost') {
    if (value < 100) numFormat = '1.2-2';
    else numFormat = '1.0-0';
  } else {
    if (value < 10) numFormat = '1.2-2';
    else if (value < 100) numFormat = '1.1-1';
    else numFormat = '1.0-0';
  }
  return numFormat;
}

/**
 * Retruns the fraction digits number based on the provided unit.
 *
 * @example
 * v1NumberGetFractionDigits(123.456); // 0
 *
 * @export
 * @param {number} value
 * @param {('energy' | 'cost')} [unit='energy']
 * @returns {number}
 */
export function v1NumberGetFractionDigits(
  value: number,
  unit: 'energy' | 'cost' = 'energy',
): number {
  let num: number;
  if (unit === 'cost') {
    if (value < 100) num = 2;
    else num = 0;
  } else {
    if (value < 10) num = 2;
    else if (value < 100) num = 1;
    else num = 0;
  }
  return num;
}
