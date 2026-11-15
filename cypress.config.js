const fs = require('fs');
const path = require('path');
const { defineConfig } = require('cypress');

/**
 * Environment selection
 *   CYPRESS_ENV=qa npx cypress run      -> loads cypress/config/qa.json (default)
 *
 * Precedence for `Cypress.env()` values (highest first):
 *   1. CYPRESS_* environment variables / --env flags   (CI secrets live here)
 *   2. cypress.env.json                                 (local, git-ignored credentials)
 *   3. cypress/config/<env>.json                        (non-secret URLs and flags)
 */
const targetEnv = process.env.CYPRESS_ENV || 'qa';
const resultsDir = path.join(__dirname, 'cypress', 'results');

function loadEnvironmentFile(name) {
  const file = path.join(__dirname, 'cypress', 'config', `${name}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Unknown CYPRESS_ENV "${name}": expected ${file} to exist.`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',

    viewportWidth: 1440,
    viewportHeight: 900,

    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 30000,

    // Retries only in `cypress run` so a flaky failure is visible while developing.
    retries: { runMode: 2, openMode: 0 },

    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    // Keeping every test snapshot in memory slows long CI runs down.
    numTestsKeptInMemory: process.env.CI ? 0 : 50,

    reporter: 'cypress-multi-reporters',
    reporterOptions: { configFile: 'reporter-config.json' },

    setupNodeEvents(on, config) {
      const environment = loadEnvironmentFile(targetEnv);

      config.env = { environment: targetEnv, ...environment.env, ...config.env };
      if (environment.baseUrl) config.baseUrl = environment.baseUrl;

      // Start every `cypress run` with an empty results folder so the merged
      // HTML report only contains this run.
      on('before:run', () => {
        fs.rmSync(resultsDir, { recursive: true, force: true });
      });

      on('task', {
        /** Remove files left in the downloads folder by earlier runs. */
        clearDownloads() {
          fs.rmSync(config.downloadsFolder, { recursive: true, force: true });
          fs.mkdirSync(config.downloadsFolder, { recursive: true });
          return null;
        },
      });

      return config;
    },
  },
});
