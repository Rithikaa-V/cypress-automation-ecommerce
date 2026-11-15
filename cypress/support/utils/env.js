/**
 * Central place for reading configuration so a missing secret produces one
 * clear error instead of a confusing failure halfway through a test.
 */

const APPS = {
  admin: { urlKey: 'adminUrl', emailKey: 'adminEmail', passwordKey: 'adminPassword' },
  phase2Admin: {
    urlKey: 'phase2AdminUrl',
    emailKey: 'phase2AdminEmail',
    passwordKey: 'phase2AdminPassword',
  },
  customer: { urlKey: 'customerUrl', emailKey: 'customerEmail', passwordKey: 'customerPassword' },
};

export function requiredEnv(key) {
  const value = Cypress.env(key);
  if (value === undefined || value === null || value === '') {
    throw new Error(
      `Missing Cypress env value "${key}". Copy cypress.env.example.json to cypress.env.json ` +
        `(local) or set CYPRESS_${key} (CI).`,
    );
  }
  return value;
}

/** Resolve URL and credentials for one of: 'admin' | 'phase2Admin' | 'customer'. */
export function getApp(name) {
  const app = APPS[name];
  if (!app) {
    throw new Error(`Unknown app "${name}". Expected one of: ${Object.keys(APPS).join(', ')}`);
  }
  return {
    name,
    url: requiredEnv(app.urlKey),
    email: requiredEnv(app.emailKey),
    password: requiredEnv(app.passwordKey),
  };
}

/** Env flags can arrive as booleans (json) or strings (CYPRESS_* variables). */
export function isEnabled(key) {
  const value = Cypress.env(key);
  return value === true || value === 'true' || value === 1 || value === '1';
}
