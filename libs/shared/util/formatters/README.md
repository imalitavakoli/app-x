# shared-util-formatters

Vanilla JavaScript formatter functions for energy and etc.  
Here we have our standard formatter functions to format energy units, and etc.

## Implementation guide

I guess using some simple JavaScript functions are straight forward 😁

## More usage

Well, this lib also offers the following codes:

- `formatDateAndTime` function: Format date & time based on the given format and locale.
- `formatLocalDateToISO` function: Convert date & time based on local time zone to string in ISO format.

&nbsp;

- `getLanguageCode` function: It returns the language code (e.g., 'en') from a culture code (e.g., 'en-GB').
- `getLanguageName` function: Returns the language name (e.g. 'English') from a culture code (e.g. 'en-GB').

&nbsp;

- `addAlreadyMappedProps` function: Add any properties that the `data` object might have, in the `map` object, ONLY IF `map` doesn't have that property already in itself!
- `fixPath` function: It removes trailing slashes and spaces in a string.

&nbsp;

- `getDigitsInfo` function: Retruns the number format based on the provided unit.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-util-formatters` to execute the unit tests via [Jest](https://jestjs.io).
