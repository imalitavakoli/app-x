[🔙](../../README.md#runbooks)

# DEP: Update config for a lib

Some '_feature_' libs have dynamic configuration (DEP config). Such config should already exist and be accessible through the facade of the DEP config '_data-access_' lib (shared-data-access-ng-config). So basically the DEP config '_map_' lib (`shared-map-ng-config`) should have the lib's configuration properties in its mapped object. Here are the steps to do so:

- Update `apps/ng-boilerplate/src/assets/{DEP_config,DEP_config.development}.json` files to add your lib's config in `libs` property of the JSON files.  
  Naming convention of the added config property name: `{libname}_{version}`.  
  e.g., `CONTROLLERS_1_0_0`.

- Update `shared-map-ng-config` lib:
  - Create your own lib's mapping TS file beside `config.ts` file.  
    e.g., `config-lib-controllers.ts`.  
    And in that file you simply write and export your DEP config injector function (e.g., `libControllersInjectV1Inputs`) that map the DEP JSON configs for your lib's config.
  - Update `config.interfaces.ts` file to update API interface (`V2Config_ApiDep`) & map interface (`V2Config_MapDep`) `libs` property.
  - Update `config.ts` file to update the mapped object's `libs` property to inject & map your lib's config properties.  
    e.g., `controllersV1: libControllersInjectV1Inputs(data.libs),`.

- Update the corresponding '_ui_' lib to have its dynamic config as its inputs.

- Update the corresponding '_feature_' lib to read its dynamic config from DEP config '_data-access_' lib and set them as the '_ui_' lib's inputs.

[🔙](../../README.md#runbooks)
