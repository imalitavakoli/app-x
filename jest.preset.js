const { join } = require('path');

const nxPreset = require('@nx/jest/preset').default;

/**
 * Absolute path to the generic native-module stub. We resolve it from THIS
 * file's directory (the workspace root) rather than with `<rootDir>`, because
 * every project sets its own `<rootDir>`, and `moduleNameMapper` must point at
 * the same file for all of them.
 */
const nativeModuleStub = join(__dirname, 'tools/jest/native-modules.mock.js');

/**
 * Runs BEFORE module evaluation (unlike `setupFilesAfterEnv`) so that browser
 * globals the codebase assumes at import time (e.g. jQuery's `$`) exist before
 * any module — or barrel — is loaded. See the file for the full rationale.
 *
 * This installs a real global (the genuine jQuery library), not a stub, so
 * there is nothing to override per-spec — it completes the test environment
 * rather than substituting behaviour.
 */
const browserGlobalsSetup = join(__dirname, 'tools/jest/browser-globals.setup.js');

/**
 * Native-platform modules that cannot be evaluated in the jsdom/Node test
 * environment — they touch `fetch`, native bridges, or other browser/native
 * globals at import time and crash the whole suite before any test runs.
 *
 * Matching by SCOPE (not by individual package) is what makes this
 * future-proof: any new package added under these scopes is stubbed
 * automatically, and the Proxy stub answers to any export the packages expose.
 *
 * See `tools/jest/native-modules.mock.js` for the full rationale, and note that
 * `@capacitor/core` is intentionally NOT stubbed — it is web-safe by design and
 * is required by `@ionic/angular`.
 *
 * OVERRIDING PER-SPEC: This generic stub only guarantees that imports don't
 * crash and that unconfigured calls are harmless no-ops. A spec that needs to
 * assert a project's actual interaction with a native-backed dependency can
 * mock the CONSUMING barrel/service itself, so the real module — and its whole
 * native import chain — is never evaluated for that spec. Provide controllable
 * test doubles in the factory, and hoist the mock ABOVE the imports that touch
 * the chain. A spec-level mock like this takes precedence over this mapping
 * (verified). For example:
 *
 *   jest.mock('@x/shared-util-ng-capacitor', () => ({
 *     V1CapacitorFirebaseAuthenticationService: class {
 *       signInWithGoogle = jest.fn();
 *     },
 *   }));
 */
const nativeModuleNameMapper = {
  '^@capacitor/(?!core($|/)).+$': nativeModuleStub,
  '^@capacitor-community/.+$': nativeModuleStub,
  '^@capacitor-firebase/.+$': nativeModuleStub,
  '^@capawesome/.+$': nativeModuleStub,
  '^capacitor-plugin-.+$': nativeModuleStub,
  '^cordova-plugin-.+$': nativeModuleStub,
  '^firebase$': nativeModuleStub,
  '^firebase/.+$': nativeModuleStub,
  '^@firebase/.+$': nativeModuleStub,
};

/**
 * `@ionic/angular/standalone` and `@ionic/core` ship native ES modules that
 * Jest cannot evaluate as-is (`SyntaxError: Unexpected token 'export'`). By
 * default Jest ignores everything in `node_modules`; these patterns carve out
 * Ionic / Stencil / ionicons (and `.mjs` files) so they ARE transpiled by
 * `jest-preset-angular`.
 *
 * NOTE: A project that declares its own `transformIgnorePatterns` OVERRIDES
 * this (Jest replaces arrays, it does not merge them). That is fine — the few
 * projects that set their own already whitelist Ionic; this default covers all
 * the projects that don't.
 */
const transformIgnorePatterns = [
  '<rootDir>/node_modules/(?!(@ionic/core|@ionic/angular|ionicons|@stencil/core|.*.mjs$))',
  '<rootDir>/node_modules/.pnpm/(?!(@ionic[+/]angular|@ionic[+/]core|ionicons|@stencil[+/]core|@angular[+/].*)@)',
];

module.exports = {
  ...nxPreset,
  setupFiles: [...(nxPreset.setupFiles || []), browserGlobalsSetup],
  transformIgnorePatterns,
  moduleNameMapper: {
    ...nxPreset.moduleNameMapper,
    ...nativeModuleNameMapper,
  },
};
