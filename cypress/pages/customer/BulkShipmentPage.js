import BasePage from '../BasePage';
import { cssModule } from '../../support/utils/selectors';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const FORM = '/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/form[1]';
const RESULTS = '/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]';
const LOCATORS = {
  downloadTemplateButton: `${FORM}/div[1]/div[1]/button[1]/span[1]`,
  downloadTemplateToast: '/html/body/div[2]/div',
  uploadInput: '/html/body/div/div/div/div/div[2]/div/div/form/div/span/div[1]/span/input',
  shipmentTypeRadio: `${FORM}/div[1]/div[2]/div[1]/div[1]/div[1]/label[1]/span[1]/input[1]`,
  continueButton: `${FORM}/div[1]/div[1]/button[2]/span[1]`,

  downloadErrorsButton: `${cssModule('DownloadErrorsButtonContainer')} > .ant-btn > :nth-child(2)`,
  errorsDialogConfirm: '.ant-modal-footer > .ant-btn-round',

  validRowCheckbox: `${RESULTS}/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/table[1]/tbody[1]/tr[3]/td[1]/label[1]/span[1]/input[1]`,
  createShipmentsButton: `${RESULTS}/div[2]/button[2]/span[1]`,
  reviewAndConfirmButton: `${RESULTS}/div[1]/div[2]/button[2]/span[1]`,
  successTitle: '/html/body/div[3]/div/div[2]/div/div[2]/div/div/div[1]/p',
  trackOrdersButton: `${cssModule('buttonsContainer')} > .ant-btn`,
};

// Parsing the workbook and creating the shipments is processed by the backend.
const SLOW_BACKEND_TIMEOUT = 30000;

// Names the application gives to the files it generates.
export const TEMPLATE_FILE = 'Template.xlsx';
export const ERROR_REPORT_FILE = 'data.xlsx';

export default class BulkShipmentPage extends BasePage {
  downloadTemplate() {
    this.click(LOCATORS.downloadTemplateButton);
    this.assertVisible(LOCATORS.downloadTemplateToast);
    cy.verifyDownload(TEMPLATE_FILE);
  }

  /** @param {string} fixturePath path relative to cypress/fixtures */
  uploadWorkbook(fixturePath) {
    // The input is hidden by the upload widget, hence force.
    this.get(LOCATORS.uploadInput).selectFile(`cypress/fixtures/${fixturePath}`, { force: true });
    this.waitForBusyIndicators();
  }

  chooseShipmentType() {
    this.click(LOCATORS.shipmentTypeRadio, { timeout: SLOW_BACKEND_TIMEOUT });
    this.get(LOCATORS.shipmentTypeRadio).should('be.checked');
  }

  continue() {
    this._clickWhenEnabled(LOCATORS.continueButton);
  }

  /**
   * The workbook intentionally contains invalid rows. The app offers an error
   * report, which must be downloadable, before the valid rows can continue.
   */
  downloadErrorReportAndContinue() {
    this.click(LOCATORS.downloadErrorsButton, { timeout: SLOW_BACKEND_TIMEOUT });
    cy.verifyDownload(ERROR_REPORT_FILE);
    this.click(LOCATORS.errorsDialogConfirm);
  }

  selectValidRow() {
    this.click(LOCATORS.validRowCheckbox, { timeout: SLOW_BACKEND_TIMEOUT });
  }

  createShipments() {
    this._clickWhenEnabled(LOCATORS.createShipmentsButton);
  }

  reviewAndConfirm() {
    this._clickWhenEnabled(LOCATORS.reviewAndConfirmButton, { timeout: SLOW_BACKEND_TIMEOUT });
  }

  assertCreated() {
    this.assertVisible(LOCATORS.successTitle, { timeout: SLOW_BACKEND_TIMEOUT });
  }

  trackOrders() {
    this.click(LOCATORS.trackOrdersButton);
  }

  /** These locators point at the <span> inside a button; check the button itself is enabled. */
  _clickWhenEnabled(spanLocator, { timeout } = {}) {
    this.get(`${spanLocator}/..`, { timeout }).should('be.enabled');
    this.click(spanLocator);
  }
}
