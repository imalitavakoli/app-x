[🔙](../../README.md#runbooks)

# Web-component: Update

Some of the '_feature_' libs are already wrapped in another '_feature_' lib (named Core libs) under our Web-Component generator app's (it's one of the apps in our workspace) domain. So whenever that lib's inputs/outputs get updated, the Core lib (which wraps the original lib) should also get updated to support all of the newly updated inputs/outputs. Here are the steps to do so:

- Update our Web-Component generator app:
  - Update `app.interfaces.ts` file to mention the newly updated inputs in the lib's related interface.
    e.g., `ApiInputsInitializerV1` interface.
  - Update `app.component.ts` file to mention the newly updated inputs in the lib's related input setup function.
    e.g., `setComInitializer` function.
  - Update `index.iframe-v{x}.html` file to document the usage of the lib (component) as iframe.
  - Update `index.webcom-v{x}.html` file to document the usage of the lib (component) as web-component.

- Update the corresponding Core '_feature_' lib to update its inputs/outputs.

[🔙](../../README.md#runbooks)
