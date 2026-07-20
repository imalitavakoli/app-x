/* eslint-disable */
/**
 * Browser globals for the Jest (jsdom) environment.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 * Some code in the workspace assumes a browser-provided global exists AT IMPORT
 * TIME. In the running app these globals are supplied by the host page (scripts,
 * polyfills, the platform). The Jest jsdom environment does not provide them, so
 * the module crashes while it is being evaluated — before any test runs — and,
 * because barrel files (`export *`) evaluate everything they re-export, the
 * crash spreads to unrelated specs that merely imported a neighbouring symbol.
 *
 * Concrete case: the vendored `@x/shared-ui-framework8` lib registers jQuery
 * plugins at module load (`$.fn[...]`), assuming `$` / `jQuery` is global — see
 * `libs/shared/ui/framework8/src/lib/v1/blocks/pluginify.js`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS DOES
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs as a Jest `setupFiles` entry (BEFORE module evaluation, unlike
 * `setupFilesAfterEnv`) and installs the browser globals the codebase expects,
 * bound to the jsdom `window`. jQuery is a real dependency (`jquery` in
 * node_modules), so this provides the genuine library rather than a stub.
 *
 * To support a newly-assumed global in the future, add it here once — every
 * project inherits it through `jest.preset.js`.
 */

const jquery = require('jquery');

// jQuery binds to the jsdom `window` that the test environment already created.
globalThis.$ = globalThis.jQuery = jquery;
