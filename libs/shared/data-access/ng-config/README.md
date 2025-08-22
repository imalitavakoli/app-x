# shared-data-access-ng-config

Holds Angular apps' config NgRx state.  
In simple terms, these are one of our app's feature states. What feature state? Config state!
App's configs are provided by DEP JSON file. We need to load that file when initializing the app, and define our app's config state according to it.

With the help of config state (NgRx related state management codes for controlling this state of the app), app's config will be set as soon as it gets initialized.
