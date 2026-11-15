import BasePage from '../BasePage';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const FORM = '//*[@id="root"]/div/div/div[2]/div[2]/div/div/div/form/div';
const LOCATORS = {
  fromPostalCode: `${FORM}/div[1]/div[1]/div[1]/div/div[1]/div/input`,
  toPostalCode: `${FORM}/div[1]/div[1]/div[3]/div/div[1]/div/input`,
  length: `${FORM}/div[3]/div/div/div[1]/div/input`,
  width: `${FORM}/div[3]/div/div/div[2]/div/input`,
  height: `${FORM}/div[3]/div/div/div[3]/div/input`,
  weight: `${FORM}/div[3]/div/div/div[4]/div/input`,
  additionalServices: `${FORM}/div[1]/div[1]/div[9]/div/div/div`,
  signatureRequired: "//input[@value='Signature Required']",
  getQuoteButton: `${FORM}/div[1]/div[2]/button`,
};

export default class QuotePage extends BasePage {
  /**
   * @param {{fromPostalCode, toPostalCode, length, width, height, weight, signatureRequired?: boolean}} quote
   */
  getQuote(quote) {
    this.type(LOCATORS.fromPostalCode, quote.fromPostalCode);
    this.type(LOCATORS.toPostalCode, quote.toPostalCode);
    this.type(LOCATORS.length, quote.length);
    this.type(LOCATORS.width, quote.width);
    this.type(LOCATORS.height, quote.height);
    this.type(LOCATORS.weight, quote.weight);

    if (quote.signatureRequired) {
      this.click(LOCATORS.additionalServices);
      this.get(LOCATORS.signatureRequired).check({ force: true });
    }

    this.get(LOCATORS.getQuoteButton).should('be.enabled').click();
  }
}
