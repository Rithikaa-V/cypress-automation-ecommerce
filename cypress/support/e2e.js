// Loaded automatically before every spec file.
import 'cypress-xpath';
import './commands';

// Ant Design components occasionally trigger this harmless browser notification.
// Ignoring only this message keeps real application errors failing the test.
const IGNORED_ERRORS = [
  /ResizeObserver loop limit exceeded/,
  /ResizeObserver loop completed with undelivered notifications/,
];

Cypress.on('uncaught:exception', (error) => {
  if (IGNORED_ERRORS.some((pattern) => pattern.test(error.message))) {
    return false;
  }
  return undefined;
});
