# shared-util-ng-bases-model

In this lib we ONLY hold the shared useful base interfaces or mock files that can be used in different libs. e.g., the base interface for pages.  
i.e., this lib is not functional independently.

**Note!** Why we didn't put these base models right inside of '_shared-util-ng-bases_' lib? Because if we were going to do that, we could face circular dependency TypeScript errors in some libs! Currently we can easily, import an interface (from this lib) in a '_feature_' or '_ui_' lib, without worrying about the level of the lib that is importing something from here...

## Running unit tests

Run `nx test shared-util-ng-bases-model` to execute the unit tests.
