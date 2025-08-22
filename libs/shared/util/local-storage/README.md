# shared-util-local-storage

Vanilla JavaScript LocalStorage facade and other low-level codes that interact with LocalStorage.

This LocalStorage facade stores objects and returns objects.  
e.g., instead of storing a simple string typed variable (`str`), you should wrap it up in an object and store it (`{ token: str }`).

## Implementation guide

I guess using LocalStorage is straight forward 😁

## More usage

Well, this lib also offers the following codes:

- `LocalPrefGet` function: Tries to get one of the user's saved local preferences. If it was already in LocalStorage, it returns that value, otherwise it returns `null`.

- `LocalPrefSet` function: Tries to get one of the user's saved local preferences. If it was already in LocalStorage, it modifies its value, otherwise it sets it with a value for the first time.
  **Note!** It saves all of the preferences in LocalStorage as a stringified json under the `pref` key.

- `LocalWebcomGet` function: Gets one of the event's payload of an already loaded web-component in the client's site/app.

- `LocalWebcomSet` function: Sets one of the event's payload of an already loaded web-component in the client's site/app.

- `LocalWebcomGetAllErrors` function: Gets all of the errors of an already loaded web-component in the client's site/app.

- `LocalWebcomSetOneError` function: Sets a new error to the list of errors of the `webcom` LocalStorage item.

## Important requirements

_None._

## Running unit tests

Run `nx test shared-util-local-storage` to execute the unit tests via [Jest](https://jestjs.io).
