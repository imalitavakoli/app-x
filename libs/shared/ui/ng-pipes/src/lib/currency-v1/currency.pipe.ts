import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  v1NumberGetDigitsInfo,
  v1NumberGetFractionDigits,
} from '@x/shared-util-formatters';

@Pipe({
  name: 'currencyV1',
  standalone: true,
})
export class V1CurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencyCode = 'USD',
    locale = 'en-GB',
    truncate = false,
  ): string {
    // Format `value` by Angular function.
    // NOTE: We don't use this method, because it doesn't support some languages.
    // const digitsInfo = v1NumberGetDigitsInfo(value, 'cost');
    // return formatCurrency(
    //   value,
    //   locale,
    //   getCurrencySymbol(currencyCode, 'narrow'),
    //   currencyCode,
    //   digitsInfo,
    // );

    // Format `value` by vanilla JS function.
    const fractionDigits = v1NumberGetFractionDigits(value, 'cost');
    let formattedValue = value;

    // When `truncate` is `true`, in simple terms, we first first cut off extra
    // decimals with `Math.trunc`, and then call `toLocaleString` to format the
    // number... So after truncation, there's nothing left for `toLocaleString`
    // to round up (because if we give a number with more decimals than
    // `fractionDigits` to `toLocaleString`, it will round up the number as
    // well).
    if (truncate) {
      const factor = 10 ** fractionDigits;
      formattedValue = Math.trunc(value * factor) / factor;
    }

    return formattedValue.toLocaleString(locale, {
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }
}
