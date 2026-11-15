import BasePage from '../BasePage';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const LOCATORS = {
  searchInput:
    '//*[@id="root"]/div/div/div/div[1]/div/div[2]/div/div/div[1]/div[2]/div[1]/div[1]/input',
  tableRows: '.ant-table-tbody tr',
};

export default class ShipmentHistoryPage extends BasePage {
  searchFor(shipmentId) {
    this.type(LOCATORS.searchInput, shipmentId);
  }

  /** The searched shipment is listed in the history table. */
  assertListed(shipmentId, { timeout = 20000 } = {}) {
    cy.contains(LOCATORS.tableRows, shipmentId, { timeout }).should('be.visible');
  }
}
