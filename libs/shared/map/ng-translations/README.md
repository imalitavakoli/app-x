# shared-map-ng-translations

Holds Angular apps' translations http loader.

Here we fetch the latest translations JSON file (of our desired language) from server.
It contains the translation text of different sections (modules) across variety of apps.
We receive a JSON response, modify it (if needed), and return an Observable which holds the results.

## Implementation guide

- We use it in the effects of 'shared-data-access-ng-translations' lib.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-map-ng-translations` to execute the unit tests.
