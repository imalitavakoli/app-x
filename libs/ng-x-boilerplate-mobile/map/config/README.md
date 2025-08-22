# ng-x-boilerplate-mobile-map-config

Holds apps' config proxifyier function.  
**NOTE:** So where the config file itself loads at the first place, before we proxify it here? Well, that's what `shared-map-ng-config` lib take care of.

Here we proxify some parts of the DEP config json file that is specifically related to this app, modify it (if needed), and return the proxified object.

## Implementation guide

- We pass it through the load function of `shared-map-ng-config` lib... So when the config file gets loaded in there, it then calls the proxify function of this lib to proxify the rest of the config object... I mean the parts that are specifically related to this app.

## Important requirements

- shared-map-ng-config (The DEP config file loads via this lib first, and then the loaded data will be handed to this lib, so that we can proxify the app specific configs here)

## Running unit tests

Run `nx test ng-x-boilerplate-mobile-map-config` to execute the unit tests.
