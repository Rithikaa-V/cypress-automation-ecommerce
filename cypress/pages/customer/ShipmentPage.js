import BasePage from '../BasePage';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const FORM = '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div/form';
const ABSOLUTE_FORM =
  '/html[1]/body[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/form[1]';
const SUCCESS_MODAL = '/html/body/div[2]/div/div[2]/div/div[2]/div/div';

const LOCATORS = {
  quoteRowButton: (row) => `:nth-child(${row}) > .ant-table-cell-fix-right > .ant-btn`,

  shipFrom: {
    name: `${FORM}/div[2]/div/div/div[1]/div/div[2]/div[1]/div/div/input`,
    address: `${ABSOLUTE_FORM}/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/span[1]/input[1]`,
    phone: `${FORM}/div[2]/div/div/div[1]/div/div[2]/div[4]/div/div/input`,
    email: `${FORM}/div[2]/div/div/div[1]/div/div[2]/div[5]/div/div/input`,
  },
  shipTo: {
    name: `${FORM}/div[2]/div/div/div[2]/div/div[2]/div[1]/div/div/input`,
    address: `${ABSOLUTE_FORM}/div[2]/div[1]/div[1]/div[2]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/span[1]/input[1]`,
    phone: `${FORM}/div[2]/div/div/div[2]/div/div[2]/div[4]/div/div/input`,
    email: `${FORM}/div[2]/div/div/div[2]/div/div[2]/div[5]/div/div/input`,
  },

  // The same button advances both the "shipping details" and "package details" steps.
  continueButton: `${FORM}/div[3]/div/button`,

  insuranceDropdown: `${FORM}/div[2]/div/div/div[1]/div/div[5]/div/div/div`,
  insuranceNone: "//div[contains(text(),'None')]",
  insuranceAmount: `${FORM}/div[2]/div/div/div[2]/div/div[1]/div/div/input`,
  reference1: `${FORM}/div[2]/div/div/div[2]/div/div[2]/div/div/input`,
  reference2: `${FORM}/div[2]/div/div/div[2]/div/div[3]/div/div/input`,
  description: `${FORM}/div[2]/div/div/div[2]/div/div[4]/div/div/input`,
  // Direct flow only. Order matches the quote form: length, width, height, weight.
  dimension: (position) =>
    `${ABSOLUTE_FORM}/div[2]/div[1]/div[1]/div[4]/div[1]/div[${position}]/div[1]/input[1]`,

  createFromQuoteButton: `${FORM}/div[1]/div/div[3]/button[2]`,
  createDirectButton: `${ABSOLUTE_FORM}/div[1]/div[1]/div[2]/button[2]`,

  successTitle: `${SUCCESS_MODAL}/div[1]/p`,
  shipmentId: `${SUCCESS_MODAL}/div[2]/div[1]/p/span`,
  printLabelButton: `${SUCCESS_MODAL}/div[3]/div/button`,
  printLabelToast: '/html/body/div[3]/div',
  trackOrderButton: `${SUCCESS_MODAL}/div[3]/button`,
};

// Carrier rate lookups and shipment creation call external services.
const SLOW_BACKEND_TIMEOUT = 30000;

export const SHIPMENT_ID_ALIAS = 'shipmentId';

export default class ShipmentPage extends BasePage {
  /** Pick one of the carrier quotes in the results table (default: second row). */
  selectQuote(row = 2) {
    this.click(LOCATORS.quoteRowButton(row), { timeout: SLOW_BACKEND_TIMEOUT });
  }

  fillShippingDetails(shipFrom, shipTo) {
    this._fillParty(LOCATORS.shipFrom, shipFrom);
    this._fillParty(LOCATORS.shipTo, shipTo);
    this._continue();
  }

  /** Package step of the "from a quote" flow: no insurance. */
  fillPackageDetailsWithoutInsurance({ references, description }) {
    this.click(LOCATORS.insuranceDropdown);
    this.click(LOCATORS.insuranceNone);
    this.type(LOCATORS.reference1, references.first);
    this.type(LOCATORS.reference2, references.second);
    this.type(LOCATORS.description, description);
    this._continue();
  }

  /** Package step of the direct flow: insurance amount plus package dimensions. */
  fillPackageDetailsWithInsurance({ references, description, insuranceAmount, dimensions }) {
    this.type(LOCATORS.reference1, references.first);
    this.type(LOCATORS.reference2, references.second);
    this.type(LOCATORS.description, description);
    this.type(LOCATORS.insuranceAmount, insuranceAmount);
    [dimensions.length, dimensions.width, dimensions.height, dimensions.weight].forEach(
      (value, index) => this.type(LOCATORS.dimension(index + 1), value),
    );
    this._continue();
  }

  createShipmentFromQuote() {
    this.click(LOCATORS.createFromQuoteButton);
  }

  createShipmentDirect() {
    this.click(LOCATORS.createDirectButton);
  }

  /** Assert the success dialog is shown and store the new shipment id as an alias. */
  assertCreated() {
    this.assertVisible(LOCATORS.successTitle, { timeout: SLOW_BACKEND_TIMEOUT });
    this.get(LOCATORS.shipmentId)
      .should(($id) => expect($id.text().trim(), 'shipment id').to.not.be.empty)
      .invoke('text')
      .then((text) => text.trim())
      .as(SHIPMENT_ID_ALIAS);
  }

  printLabel() {
    this.click(LOCATORS.printLabelButton);
    this.assertVisible(LOCATORS.printLabelToast);
  }

  trackOrder() {
    this.click(LOCATORS.trackOrderButton);
  }

  /** The "ship from" form is pre-filled from the default address-book entry. */
  assertShipFromPrefilled({ name, street, phone, email }) {
    this.assertValue(LOCATORS.shipFrom.name, name);
    this.assertValue(LOCATORS.shipFrom.address, street);
    this.assertValue(LOCATORS.shipFrom.phone, phone);
    this.assertValue(LOCATORS.shipFrom.email, email);
  }

  _fillParty(locators, party) {
    this.type(locators.name, party.name);
    this.type(locators.address, party.address);
    // Address suggestions come from an external lookup; choose the first one.
    cy.pickAntOption();
    this.type(locators.phone, party.phone);
    this.type(locators.email, party.email);
  }

  _continue() {
    this.get(LOCATORS.continueButton).should('be.enabled').click();
  }
}
