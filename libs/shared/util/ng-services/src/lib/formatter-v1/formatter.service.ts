import {
  formatCurrency,
  formatNumber,
  getCurrencySymbol,
} from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';

import { V2Config_MapDep } from '@x/shared-map-ng-config';
import { V2ConfigFacade } from '@x/shared-api-data-access-ng-config';
import {
  v1NumberGetDigitsInfo,
  v1NumberGetFractionDigits,
} from '@x/shared-util-formatters';

@Injectable({
  providedIn: 'root',
})
export class V1FormatterService {
  private readonly _configFacade = inject(V2ConfigFacade);
  private _configDep?: V2Config_MapDep;

  /* //////////////////////////////////////////////////////////////////////// */
  /* Constructor                                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  constructor() {
    // Get the DEP config data.
    // NOTE: Rxjs take(1) and first() operators are synchronous, so we can
    // immediatly use the extracted data from the subscription right after it.
    this._configFacade.dataConfigDep$.pipe(take(1)).subscribe((data) => {
      this._configDep = data;
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Number formatters (Generic)                                              */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Basic number formatter based on the provided locale: Let's format ONLY the
   * numbers fraction digits for the elec/gas (related number) unit.
   *
   * @example
   * formatNumFractionDigits(123.456789); // 123.456
   *
   * @param {number} value
   * @param {string} [locale='en-GB']
   * @returns {string}
   */
  formatNumFractionDigits(value: number, locale = 'en-GB') {
    // Format `value` by vanilla JS function.
    const fractionDigits = v1NumberGetFractionDigits(value, 'energy');
    return value.toLocaleString(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Number formatters                                                        */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Formats the provided number based on the provided unit cost.
   *
   * For cost unit, we just simply format the numbers... Because there's no need
   * to convert them into another unit, like what we do for energy!
   *
   * @example
   * formatNumForCost(123.456); // {str: '£123', num: 123.456}
   *
   * @param {number} value
   * @param {string} [locale='en-GB']
   * @param {string} [currencyCode='GBP']
   * @returns {{ str: any; num: number; }}
   */
  formatNumForCost(value: number, locale = 'en-GB', currencyCode = 'GBP') {
    // Format `value` by Angular function.
    // NOTE: We don't use this method, because it doesn't support some languages.
    // const digitsInfo = v1NumberGetDigitsInfo(value, 'cost');
    // const fin = formatCurrency(
    //   value,
    //   locale,
    //   getCurrencySymbol(currencyCode, 'narrow'),
    //   currencyCode,
    //   digitsInfo,
    // );

    // Format `value` by vanilla JS function.
    const fractionDigits = v1NumberGetFractionDigits(value, 'cost');
    const fin = value.toLocaleString(locale, {
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

    return { str: fin, num: value };
  }

  /* //////////////////////////////////////////////////////////////////////// */
  /* Unit getters                                                             */
  /* //////////////////////////////////////////////////////////////////////// */

  /**
   * Returns the unit cost symbol based on the provided currency code.
   *
   * @example
   * getUnitCost('USD'); // '$'
   *
   * @param {string} [currencyCode='GBP']
   * @returns {*}
   */
  getUnitCost(currencyCode = 'GBP') {
    // Format by Angular function.
    // NOTE: We don't use this method, because it's deprecated.
    // return getCurrencySymbol(currencyCode, 'narrow');

    // Format by vanilla JS function.
    const currencyPart = Intl.NumberFormat('en', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts()
      .find((part) => part.type === 'currency');
    return currencyPart ? currencyPart.value : '';
  }
}
