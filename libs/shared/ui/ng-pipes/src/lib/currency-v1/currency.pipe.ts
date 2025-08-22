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
  transform(value: number, currencyCode = 'USD', locale = 'en-GB'): string {
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
    return value.toLocaleString(locale, {
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  }
}
