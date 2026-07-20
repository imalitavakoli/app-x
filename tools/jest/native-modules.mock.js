/* eslint-disable */
/**
 * Generic auto-mock for native-platform modules under Jest.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * Native-platform packages (Capacitor plugins, the Firebase JS SDK, Cordova
 * plugins, etc.) execute browser/native-only code AT IMPORT TIME. For example,
 * `@capacitor-firebase/authentication` eagerly loads the `firebase/auth` Node
 * build, which references the global `fetch` while the module is being
 * evaluated. The Jest environment is jsdom (Node), which has no `fetch`, so the
 * whole test suite dies with `ReferenceError: fetch is not defined` BEFORE a
 * single test runs.
 *
 * This happens regardless of whether the lib under test uses these packages
 * directly or pulls them in transitively through a barrel file (`export *`).
 * Because barrels evaluate every module they re-export, importing one innocent
 * symbol can drag the entire native stack into a plain unit test.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS DOES
 * ─────────────────────────────────────────────────────────────────────────────
 * `jest.preset.js` maps every native-module scope to this file via
 * `moduleNameMapper`. This module is a single self-referential Proxy that
 * answers to ANY access pattern with a harmless no-op:
 *   - any named export            → the stub
 *   - default export              → the stub
 *   - calling it: `stub()`        → the stub
 *   - constructing: `new stub()`  → the stub
 *   - property chains, listeners  → the stub
 *
 * Because it responds to any property name, adding / renaming / removing a
 * native service in the future needs ZERO changes here or in any spec.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * OVERRIDING PER-SPEC
 * ─────────────────────────────────────────────────────────────────────────────
 * This stub only guarantees that imports don't crash and that unconfigured
 * calls are safe no-ops. A spec that needs specific behaviour from a native
 * module can still call `jest.mock('@capacitor-firebase/authentication', () => ...)`
 * (or `jest.requireActual`) — that takes precedence over this default mapping.
 */

const stub = new Proxy(function () {}, {
  get(target, prop) {
    // Preserve ES-module interop so `import x from '...'` works.
    if (prop === '__esModule') return true;
    // `await stub` must resolve to the stub itself, not hang: a non-function
    // `then` tells the microtask machinery this is not a thenable.
    if (prop === 'then') return undefined;
    // Keep any real own-properties of the underlying function (e.g. Symbols
    // that tooling probes) rather than shadowing them with the proxy.
    if (prop in target) return target[prop];
    return stub;
  },
  apply() {
    return stub;
  },
  construct() {
    return stub;
  },
});

module.exports = stub;
