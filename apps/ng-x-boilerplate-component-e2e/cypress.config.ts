import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { unlinkSync } from 'fs';

// Capture the Nx Cypress preset
// NOTE: We do it, so we can invoke its own setupNodeEvents inside ours, keeping
// Nx's behavior (dev-server start/stop) fully in place.
const nxPreset = nxE2EPreset(__dirname);

export default defineConfig({
  e2e: {
    ...nxPreset,
    // Please ensure you use `cy.origin()` when navigating between domains and remove this option.
    // See https://docs.cypress.io/app/references/migration-guide#Changes-to-cyorigin
    injectDocumentDomain: true,

    /* Video recording ////////////////////////////////////////////////////// */

    video: false, // record a video per spec file
    videoCompression: 32, // Accepted values: true/false/integer. true = CRF 32; int 0–51 (lower = better quality, bigger file); false = off

    /* setupNodeEvents hooks //////////////////////////////////////////////// */

    async setupNodeEvents(on, config) {
      // Delete the recorded video for every spec that had no failures.
      // NOTE: Cypress keeps only ONE listener per lifecycle event (only `task`
      // merges). We register ours FIRST, then run Nx's preset LAST, so if a future
      // Nx version also registers `after:run`, Nx's listener wins and is never
      // clobbered by ours.
      on('after:run', (results) => {
        if (!results || !('runs' in results)) return;
        for (const run of results.runs) {
          if (run.video && run.stats.failures === 0) {
            unlinkSync(run.video);
            console.log(
              `  (Deleted Video)\n  -  Spec passed with no failures, video removed: ${run.video}`,
            );
          }
        }
      });

      // Run Nx's preset behavior (dev-server start/stop).
      await nxPreset.setupNodeEvents?.(on, config);

      return config;
    },
  },
});
