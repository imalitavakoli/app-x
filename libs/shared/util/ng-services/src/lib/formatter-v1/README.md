# shared-util-ng-services

v1.

## Implementation guide

It makes number formatting across our projects easier by ensuring a consistent format.

```ts
import { V1Insights_MapLocation } from '@x/shared-map-ng-insights';
import { V1FormatterService } from '@x/shared-util-ng-services';
private readonly _formatterSerivce = inject(V1FormatterService);

/* Format numbers /////////////////////////////////////////////////////////// */

const { str, num } = this._formatterSerivce.formatNumForCost(123.45);

/* Some utility funs //////////////////////////////////////////////////////// */

const currencySymbol = this._formatterSerivce.getUnitCost('USD');
```
