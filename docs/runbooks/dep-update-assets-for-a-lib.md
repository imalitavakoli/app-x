[🔙](../../README.md#runbooks)

# DEP: Update assets for a lib

Some '_ui_' libs include assets (like images or icons). These assets must be present in the app that initializes the lib, and their paths should also be included in the DEP config. Why include asset paths in the DEP config? Because even though the '_ui_' lib is dumb and loads assets from a hardcoded path, the '_feature_' lib should load those paths from dynamic configuration. Here are the steps to do so:

- Put your lib's assets in `apps/{appname}/src/assets/images/libs/{libname}` folder.  
  Naming convention of the added asset file: `{libname}_{ico,img}-{assetname}.svg`.  
  e.g., `controllers_ico-home.svg`.

- Update `apps/ng-boilerplate/src/assets/{DEP_config,DEP_config.development}.json` files to add your lib's assets in `assets` property of the JSON files.  
  Naming convention of the added asset property name: `lib_{libname}_{ico,img}_{assetname}`.  
  e.g., `lib_controllers_ico_home`.

- Update `shared-map-ng-config` lib:
  - Update `config.interfaces.ts` file to update API interface (`V2Config_ApiDep`) & map interface (`V2Config_MapDep`) `assets` property.
  - Update `config.ts` file to update the mapped object's `assets` property to inject & map your lib's assets properties.  
    e.g., `...libControllersInjectAssets(data?.assets, assetsFolderName),`.
  - Create your own lib's mapping TS file beside `config.ts` file.  
    e.g., `config-lib-controllers.ts`.  
    And in that file you simply write and export your assets injector function (e.g., `libControllersInjectAssets`) that map the DEP JSON configs for your lib's assets.

- Update the corresponding '_ui_' lib to have its assets as its inputs.

- Update the corresponding '_feature_' lib to read its assets from DEP config '_data-access_' lib and set them as the '_ui_' lib's inputs.

[🔙](../../README.md#runbooks)
