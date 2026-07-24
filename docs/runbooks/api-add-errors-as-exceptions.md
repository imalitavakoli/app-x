[🔙](../../README.md#runbooks)

# API: Add errors as exceptions

Whenever we receive an error from the server, we log it by `console.error` in '_map_' lib, emit the error as an output in '_feature_' lib, and show the error in '_page_' lib. But according to our logic, sometimes we may like to consider some errors as exceptions and let the app to just ignore them. Here are the steps to do so:

- Update the corresponding '_map_' lib to not log that specific error.  
  **Tip!** You can get inspired from `getDetail` function of `V1XCredit` class (`shared-map-ng-x-credit` lib).
- Update the corresponding '_feature_' lib to not emit that specific error.  
  **Tip!** You can get inspired from `_xFacadesAddErrorListeners` function of `V1XProfileInfoFeaComponent` class (`shared-feature-ng-x-profile-info` lib).

[🔙](../../README.md#runbooks)
