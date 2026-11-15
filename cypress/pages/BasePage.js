/**
 * Shared behaviour for every page object.
 *
 * Locators can be XPath (starting with "/" or "(") or CSS; `get()` picks the
 * right Cypress command, so page objects keep one flat locator map and tests
 * never care which flavour is used.
 */
const isXPath = (locator) => /^\s*[/(]/.test(locator);
const withTimeout = (timeout) => (timeout ? { timeout } : {});

// Ant Design loading states: page/table spinners, in-flight uploads, progress bars.
const BUSY_INDICATORS = '.ant-spin-spinning, .ant-upload-list-item-uploading, .ant-progress-active';

export default class BasePage {
  get(locator, { timeout } = {}) {
    const options = withTimeout(timeout);
    return isXPath(locator) ? cy.xpath(locator, options) : cy.get(locator, options);
  }

  click(locator, { timeout, force } = {}) {
    return this.get(locator, { timeout }).click(force ? { force } : {});
  }

  /** Pass `sensitive: true` to keep the value out of the Cypress command log. */
  type(locator, text, { timeout, sensitive = false } = {}) {
    return this.get(locator, { timeout }).type(text, { log: !sensitive });
  }

  hover(locator) {
    return this.get(locator).trigger('mouseover');
  }

  assertVisible(locator, { timeout } = {}) {
    return this.get(locator, { timeout }).should('be.visible');
  }

  assertNotExist(locator, { timeout } = {}) {
    return this.get(locator, { timeout }).should('not.exist');
  }

  assertValue(locator, expected) {
    return this.get(locator).should('have.value', expected);
  }

  /**
   * Replacement for blind `cy.wait(ms)` after an action that triggers
   * background work: waits until no Ant Design loading indicator is on screen.
   */
  waitForBusyIndicators({ timeout = 30000 } = {}) {
    return cy.get(BUSY_INDICATORS, { timeout }).should('not.exist');
  }
}
