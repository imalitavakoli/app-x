/**
 * utils - Some helper functions
 * @copyright 2022 MyThemeIsReady. All Rights Reserved.
 *
 * Utility functions designed to reduce duplication.
 *
 *
 * Requirements:
 * - jQuery version 1.9.1 or higher
 */

/**
 * Convert any variable type to boolean! Supported types: Boolean, Number, and
 * String. If the veriable's type is something else rather than the mentioned
 * ones, function returns false, or returns value of the variable itself if
 * `returnVarIfNotSupported` argument is false.
 *
 * NOTE: If checkString parameter is false, a String variable will be true no
 * matter what, otherwise its value will be checked and only if it's similar to
 * the following values, it will be true: true, on, yes, 1.
 *
 * NOTE: A Number variable is true when it's above 1, otherwise it will be false.
 *
 * @param  {*}       param                            Variable that is going to be converted to Boolean
 * @param  {Boolean} [checkString=false]              Define weather to check the value of String variables or not
 * @param  {Boolean} [returnVarIfNotSupported=false]  Define weather to return false if param is not Boolean/Number/String or return the value of the param itself
 * @return {Boolean|*}
 */
export function toBoolean(param, checkString = false, returnVarIfNotSupported = false) {
  if (typeof param == 'boolean') return param;

  if (typeof param == 'number' && param > 0) return true;

  if (typeof param == 'string') {
    if (checkString) {
      if (param.toUpperCase() === 'TRUE' || param.toUpperCase() === 'ON' || param.toUpperCase() === 'YES' || param === '1') return true;
      else return false;
    } else {
      return true;
    }
  }

  if (returnVarIfNotSupported) return param;
  else return false;
}

/**
 * Get the value of an inline css style. If function returns undefined, it means
 * that the mentioned css property (param) does not exist as an inline element
 * style.
 *
 * @param  {jQuery element} $element     The element that we like to check its inline css style
 * @param  {String}         param        Inline css property that we like to check its existance
 * @return {String}                      The value of param
 */
export function inlineStyleValue($element, param) {
  let styles = $element.attr('style'),
  value;

  if (styles !== undefined) {
    styles.split(';').forEach((e) => {
      let style = e.split(':');

      if ($.trim(style[0]) === param) {
        value = style[1];
        value = value.replace(/\s/g, ''); // remove any possible spaces in the value
      }
    });
  }

  return value;
}

/**
 * Removes the mentioned inline css properties (params) from the element.
 *
 * @param  {jQuery element} $element     The element that we like to remove its inline styles
 * @param  {String} params               Inline css properties that we like to remove
 * @return {String}
 */
export function removeInlineStyles($element, ...params) {
  if ($element.attr('style') !== undefined) {
    $element.attr('style', function(j, style)
    {
      let regex = new RegExp('(' + params.join('|') + ')\s?:\s?[^;]+;?', 'g');
      return style.replace(regex, '');
      // return style.replace(/(display|height)\s?:\s?[^;]+;?/g, '');
    });
  }
}

/**
 * Remove an item from Local Storage if the life of the item has already
 * exceeded the given time, by the time that user calls this function.
 *
 * @param  {String} itemName                 Name of the item that we like to remove from Local Storage
 * @param  {String} dateItemName             Name of the 'delete item' that will be saved in Local Storage. Its duty is storing the last time that item has been removed
 * @param  {Number} [lifeTime=86,400,000]    The life time in milliseconds. The item will be removed if the life of the item exceeds the time that is given. e.g., in order to delete the item after 10 days, this is what it means in milliseconds: 1000ml * 60s * 60m * 24h * 10d
 */
export function deleteItemFromLocalStorageAfterAWhile(itemName, dateItemName, lifeTime = 1000 * 60 * 60 * 24 * 1) {
  let lastTimeCleared = localStorage.getItem(dateItemName);
  let now = new Date().getTime();

  // If there was no 'lastTimeCleared' item in Local Storage, set it and set its
  // value to now and just return! Because there was no time stored in Local
  // Storage for us at all, so that we can check it and based on that decide to
  // delete the desire item or not.
  if (!lastTimeCleared) {
    localStorage.setItem(dateItemName, now);
    return;
  }

  // If we should delete the item, remove it from Local Storage and also
  // update the 'delete item' value to now, so that we can check against
  // it later again, if user adds the item in Local Storage at any time later,
  // and calls this function to let JavaScript remove the item again if it
  // exceeds the given time.
  if (now - lastTimeCleared > lifeTime) {
    localStorage.removeItem(itemName);
    localStorage.setItem(dateItemName, now);
  }
}
