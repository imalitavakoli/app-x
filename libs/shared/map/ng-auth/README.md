# shared-map-ng-auth

Holds Angular apps' Magic Link Service (API) authentication http loader.

Here we connect to the Magic Link Service (API) in order to authorize the user in the app.
We receive a JSON response, modify it (if needed), and return an Observable which holds the results.
