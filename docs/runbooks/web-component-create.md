[🔙](../../README.md#runbooks)

# Web-component: Create

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

[🔙](../../README.md#runbooks)
