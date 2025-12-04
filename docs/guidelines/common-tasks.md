[🔙](../../README.md#guidelines)

# Common tasks ✅

There are always some common tasks that we need to take care of for different projects (apps or libs). Here we mention some of them, so that whenever you've been assigned to a similar task, you'd have a peace of mind, and immediately know what steps you should take one after another to complete the task.

**Note!** Description that we wrote here is useful only if you have already leveraged the workspace library types relationships, folder structures, and best-practices in your own project. Otherwise, when a similar task rises up for your project, you as the Code Owner of that project, need to come up with your own solutions to complete the task according to how you have coded your project at the first place.

**Tip!** For building different type of libs, you can simply get inspired from one of our sample libs for that specific type in the workspace. Most of the parts of '_map_' & '_data-access_' libs are copy-paste (in most cases), And for building '_ui_', '_feature_', and '_page_' typed libs, you can use our Base classes in `shared-util-ng-bases` lib to extend your own components' classes.

&nbsp;

[🔝](#common-tasks-✅)

## Generate & build a whole new functionality

- Generate & build a '_map_' lib (if that feature needs to deal with API).
- Generate & build a '_data-access_' lib (if that feature needs to deal with API).
- Generate & build a '_ui_' lib.
- Generate & build a '_feature_' lib.

**Important!** After building/updating a functionality, it's important to keep all of the updated libs' `README.md` files up-to-date. The Definition of Done (DoD) for a lib is to have a working ready-to-use copy-paste documentation! We basically need to be able to copy the lib's sample codes in its `README.md` file, paste them in our test page, and be able to see the final results without any errors.

Here are good examples of `README.md` files:

- for a '_map_' lib: `libs/shared/map/ng-x-credit/src/lib/v1/README.md`.
- for a '_data-access_' lib: `libs/shared/data-access/ng-x-credit/src/lib/v1/README.md`.
- for a '_ui_' lib: `libs/shared/ui/ng-x-profile-info/src/lib/v1/README.md`.
- for a '_feature_' lib: `libs/shared/feature/ng-x-profile-info/src/lib/v1/README.md`.

**Note!** In order to build '_ui_', '_feature_', or '_page_' libs easier, feel free to extend your lib's component class from the base classes that are available in `shared-util-ng-bases` lib.

&nbsp;

[🔝](#common-tasks-✅)

## Consider an API error as an exception

Whenever we receive an error from the server, we log it by `console.error` in '_map_' lib, emit the error as an output in '_feature_' lib, and show the error in '_page_' lib. But according to our logic, sometimes we may like to consider some errors as exceptions and let the app to just ignore them. Here are the steps to do so:

- Update the corresponding '_map_' lib to not log that specific error.  
  **Tip!** You can get inspired from `getDetail` function of `V1XCredit` class (`shared-map-ng-x-credit` lib).
- Update the corresponding '_feature_' lib to not emit that specific error.  
  **Tip!** You can get inspired from `_xFacadesAddErrorListeners` function of `V1XProfileInfoFeaComponent` class (`shared-feature-ng-x-profile-info` lib).

&nbsp;

[🔝](#common-tasks-✅)

## API response schema changes

Whenever back-end developers change their API's JSON response structure, then our app won't be able to map the response properly as it was doing it before. In such case, we need to update our corresponding proxy layer ('_map_' lib). Here are the steps to do so:

- Update the corresponding '_map_' lib + its interfaces.  
  **Tip!** If in the API docs, backend developers mention that a property is nullable, it's the best to consider 2 scenarios for this: (1) The property itself may not exist at all, (2) It will exist whatsoever, but its value can be `null`. So we can define our own interfaces (mapped & original API interfaces) based on these 2 probable scenarios. e.g., `param_name` property is nullable in the API docs, so our API interface define this property like this: `param_name?: 'sth' | null;`, and our map interface defines it lie this: `paramName?: 'sth';`.

&nbsp;

[🔝](#common-tasks-✅)

## A property is added/removed in API response schema

Whenever back-end developers add/remove a property in their API's JSON response structure, then our app may need to know about that property to show more info in the UI. Here are the steps to do so:

- Update the corresponding '_map_' lib + its interfaces.
- Update the corresponding '_data-access_' lib.
- In '_NX Console_' extension: Focus on the newly modified '_data-access_' lib in NX Graph, to see what '_feature_'/'_page_' libs are dependant to it.
- Update the dependant '_feature_'/'_page_' libs (+ probable dependant '_ui_'/'_util_' libs).

&nbsp;

[🔝](#common-tasks-✅)

## UI/UX changes

- Update the corresponding '_ui_' lib (probable dependant '_feature_'/'_page_'/'_util_' libs).

**Tip!** Some global CSS styles effect all of the libs & apps. Such CSS styles are resting in `shared-ui-base` & `shared-ui-tailwindcss` libs. So if you needed to update these libs, please also make sure to update '**Getting Started > 3**' ('Designers related') section & '**Getting Started > 2 > c**' ('Useful shared libs') section of docs (if required).

&nbsp;

[🔝](#common-tasks-✅)

## Add new image/icon asset for a lib

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

&nbsp;

[🔝](#common-tasks-✅)

## Add new DEP config for a lib

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

&nbsp;

[🔝](#common-tasks-✅)

## Add new communication interface for a lib

Some '_ui_', '_feature_', or '_page_' libs prefer to have indirect communication via the Communication Service (a service in `shared-util-ng-services` lib), which is a lib that emits events for building communication between different components. The Communication Service can emit `any` type events (or store `any` type data), but it's always the best to specify the event/data interface when you wanna use it! So if your lib is going to initialize the Communication Service to whether emit an event (e.g., `this.cs.emitChange(payload);`), subscribe to an event (e.g., `this.cs.changeEmitted$.subscribe({value} => {});`), or store some small data (e.g., `this.cs.storedData = {...this.cs.storedData, extra};`), it should also create its own interface. Here are the steps to do so:

- Update `shared-util-ng-bases` lib:
  - Create your own lib's interface file beside `communication.interfaces.ts` file.  
    e.g., `communication-lib-auth.interfaces.ts`.  
    **Tip!** To name your lib's communication interface name, use `V{x}Communication_{Event,Data}_{YourLibType}_V{yourlibversionnum}_{YourLibName}` schema. For example, `V1Communication_Event_Page_V1_Auth`.
  - Update `communication.interfaces.ts` file to update the Event interface `value` property, or the Data interface `extra` property, according to your lib's newly added interface.

&nbsp;

[🔝](#common-tasks-✅)

## Generate & build a web-component

As we already know, '_feature_' libs are the last piece of the puzzle for building a whole new functionality. So after having them in place, we may like to deliver them as web-component as well. In order to do that, we need to generate a new '_feature_' typed lib (named Core lib) under our Web-Component generator app (it's one of the apps in our workspace) domain to wrap in the original '_feature_' lib. This newly generated Core lib will eventually become a web-component by our Web-Component generator app. Here are the steps to do so:

- Run `nx g @nx/angular:lib {appname}-feature-{corename} --directory=libs/{appname}/feature/{corename} --tags=type:feature,domain:{appname}` command to generate a new '_feature_' lib under Web-Component generator app domain.  
  **Tip!** Of course after generating the lib, we should make sure that the components' versioning folder structure, component's class name, and component's selector name are according to our standards (similar to other Core libs).

- Update our Web-Component generator app:
  - Update `app.interfaces.ts` file to (1) add the component's name in `ComType` (e.g., `initializer-v1`); (2) add component's interface (e.g., `ApiInputsInitializerV1`).  
    **Tip!** All of this interface's optional/required properties must basically be in `string` types. Because this interface is actually showing what URL Query Params our Web-component generator app can accept as the component's inputs.
  - Update `app.component.ts` file to (1) lazy-load the component in `ngAfterViewInit`; (2) setup the component's loading & updating functions (`loadComInitializer` & `setComInitializer`).
  - Update `main.webcom-v{x}.ts` file to create the component's custom element (web-component).
  - Update `index.iframe-v{x}.html` file to document the usage of the lib (component) as iframe.
  - Update `index.webcom-v{x}.html` file to document the usage of the lib (component) as web-component.

- Start coding the newly generated Core '_feature_' lib.

It’s also worth mentioning that, over time, most of our '_feature_' libraries will be upgraded to version +1. At that point, we may decide to release a new version of their web-components and update our Web-Component generator app to compile only the latest versions. In that case, we would first take the following steps before proceeding with the previously mentioned ones:

- Update our Web-Component generator app:
  - Update `project.json` file to add a new build configuration. e.g., `targets.build.configurations.webcom-v2`.
  - Add a new `main` TS file. e.g., `main.webcom-v2.ts`.
  - Add a new `tsconfig` file. e.g., `apps/ng-webcom/tsconfig.webcom-v2.json`.
  - Add new `index` HTML files. e.g., `index.iframe-v2.html` & `index.webcom-v2.html`.

&nbsp;

[🔝](#common-tasks-✅)

## Update a web-component

Some of the '_feature_' libs are already wrapped in another '_feature_' lib (named Core libs) under our Web-Component generator app's (it's one of the apps in our workspace) domain. So whenever that lib's inputs/outputs get updated, the Core lib (which wraps the original lib) should also get updated to support all of the newly updated inputs/outputs. Here are the steps to do so:

- Update our Web-Component generator app:
  - Update `app.interfaces.ts` file to mention the newly updated inputs in the lib's related interface.
    e.g., `ApiInputsInitializerV1` interface.
  - Update `app.component.ts` file to mention the newly updated inputs in the lib's related input setup function.
    e.g., `setComInitializer` function.
  - Update `index.iframe-v{x}.html` file to document the usage of the lib (component) as iframe.
  - Update `index.webcom-v{x}.html` file to document the usage of the lib (component) as web-component.

- Update the corresponding Core '_feature_' lib to update its inputs/outputs.

&nbsp;

[🔝](#common-tasks-✅)

## Update the workspace

**Important!** This task should be done by the Workspace Specialist most of the times.

To update the whole workspace, Here are the steps to do so:

- Follow '**Guidelines > 3 > a**' ('Updating the whole workspace') section of docs.
- Update '**Getting Started > 1 > a**' ('Installing global dependencies') section of docs.

[🔙](../../README.md#guidelines)
