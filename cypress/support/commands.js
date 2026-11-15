// Project-wide custom commands. Page-specific behaviour belongs in cypress/pages.

const OPEN_DROPDOWN = '.ant-select-dropdown:not(.ant-select-dropdown-hidden)';
const DROPDOWN_OPTION = `${OPEN_DROPDOWN} .ant-select-item-option`;

/**
 * Select by `data-testid`. Prefer this over positional selectors once the
 * application exposes test ids.
 */
Cypress.Commands.add('getByTestId', (testId, options) =>
  cy.get(`[data-testid="${testId}"]`, options),
);

/**
 * Choose an option in the Ant Design dropdown that is currently open.
 * With no argument the first option is chosen (used for address suggestions).
 * Retries until the options have rendered, replacing fixed-length sleeps.
 */
Cypress.Commands.add('pickAntOption', (optionText, options = {}) => {
  const timeout = options.timeout ?? 15000;
  if (optionText) {
    return cy.contains(DROPDOWN_OPTION, optionText, { timeout }).click();
  }
  return cy.get(DROPDOWN_OPTION, { timeout }).first().click();
});

/**
 * Assert that a file has been downloaded into the Cypress downloads folder
 * and is not empty. `cy.readFile` retries until the file appears.
 */
Cypress.Commands.add('verifyDownload', (fileName, options = {}) => {
  const timeout = options.timeout ?? 20000;
  const filePath = `${Cypress.config('downloadsFolder')}/${fileName}`;
  cy.readFile(filePath, null, { timeout }).its('length').should('be.gt', 0);
});
