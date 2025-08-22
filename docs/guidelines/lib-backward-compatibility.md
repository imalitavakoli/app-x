[🔙](../../README.md#guidelines)

# Lib backward compatibility

As a rule of thumb, when you create a new version of a lib, you also need to make sure that the new version is already supporting all functionalities of the previous version(s). This is required, because we cannot always know what version of the apps (that already include a specific version of a lib), our clients are using... And we cannot expect our clients to be updated to the latest version of the app, each time a new version is released.

In simple terms, apps & libs functionalities (among their DEP config) can be updated, and delivered to clients automatically through pipelines (automation tools). But clients can still be using the old version of dynamic (DEP JSON files) configuration for their apps! So until we are not forcing our own ACs (to use the latest DEP config for the lib) and client's apps to get updated, we should make sure that our lib is still reading the old DEP config (when its new DEP config is not found).

e.g., our app's release version is 2.1.0, and in its DEP config (`apps/{app-name}/src/assets/DEP_config.json`), we have a dynamic configuration for the Chart '_feature_' lib version 1, called `CHART_1_0_0`. Then after 6 months, we release a new version of the Chart '_feature_' lib (version 2) and release a new version of the app (version 2.2.0). This new version of the lib, has `CHART_2_0_0` dynamic configurations... The app can be delivered to the client automatically through pipelines, but the dynamic configurations of the app (DEP config) is still in version 2.1.0! Which means that the DEP JSON file, doesn't have `CHART_2_0_0` node, and instead, it still has the old lib's dynamic configurations node (i.e., `CHART_1_0_0`). In such case, version 2 of the Chart lib, must still read its dynamic configurations from `CHART_1_0_0` node, when it cannot find its new node name (`CHART_2_0_0`). In this way, we are making our lib to be backward compatible.

&nbsp;

## When do you need to introduce a new version for a lib?

**You don't need to introduce a new version for the lib, if:** You are just updating some minor stuff in a lib, such as a bug fix or a small feature update.

**You do need to introduce a new version for the lib, if:** You are re-writing the whole lib from ground-up, doing major re-factoring, or adding some big features.

&nbsp;

## How do you decide about the updated lib's new DEP config name?

**You don't need to change the lib's DEP config name, if:** You decide to keep your lib's version number as it is, and you're also NOT introducing any new DEP config.

**You need to change the lib's DEP config name's MINOR/PATCH version number, if:** You decide to keep your lib's version number as it is, but you're introducing some new DEP config. e.g., your lib name is Chart and its version is 1. Your old DEP config was `CHART_1_0_0`, and the new DEP config can be `CHART_1_1_0`.

**You need to change the lib's DEP config name's MAJOR version number, if:** You decide to change your lib's version number, whether you're introducing new DEP config or not! e.g., your lib name is Chart, its old version was 1, and the new version is 2. Your old DEP config was `CHART_1_0_0`, and the new DEP config should be `CHART_2_0_0`.

&nbsp;

## How do you map the updated lib's new DEP config?

As we already know, we map the whole loaded DEP config JSON file data (which gets loaded at the app's initialization phase) in `shared-map-ng-config` lib. So as the lib's dynamic configuration is also part of the whole DEP config JSON file, then we are maping the lib's DEP config in the same 'map' lib!

So we should basically read all of the lib's related DEP config nodes, and map them one by one, from the oldest to the newest, in a way that the newer nodes can override the same properties that already exist in the older nodes.

e.g., the Chart lib has `show_info_btn: boolean` DEP config since its version 1, and now we are building its version 2. If version 2 of the lib is going to have `CHART_2_1_0` node, then it means that we probably have `CHART_2_0_0` and `CHART_1_0_0` (and maybe more) nodes. So value of this property in the first node (`CHART_1_0_0`) should overridden by the value of the same property in the next node (`CHART_2_0_0`), and eventually the newest node (`CHART_2_1_0`).
