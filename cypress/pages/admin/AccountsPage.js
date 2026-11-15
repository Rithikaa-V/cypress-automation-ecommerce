import BasePage from '../BasePage';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const LOCATORS = {
  settingsMenu: '//*[@id="root"]/div/div/div/div[1]/div/div[1]/div[2]/div/div[3]',
  accountsMenuItem: '/html/body/div[2]/div/div/div/div[2]/div/div[2]',
  addAccountButton:
    '//*[@id="root"]/div/div/div/div[1]/div/div[2]/div/div/div[2]/div/div[2]/button',
  customerPortalRadio:
    '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[1]/div[1]/div/div/div/label/span[1]/input',
  nameInput: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[1]/div/div/input',
  phoneInput: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[2]/div/div/input',
  emailInput: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[3]/div/div/input',
  address1Input: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[4]/div/div/input',
  address2Input: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[5]/div/div/input',
  cityInput: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[6]/div/div/input',
  countryDropdown:
    '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[7]/div/div/div[1]/div',
  provinceDropdown:
    '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[8]/div/div/div[1]/div',
  postalCodeInput:
    '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[2]/div[9]/div/div/input',
  uploadInput:
    '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[4]/div/span/div[1]/span/input',
  saveButton: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/form/div[5]/div/div[2]/button',
  successMessage: '/html/body/div[2]/div/div[2]/div/div[2]/div/div/div/div/p',
};

// Creating an account processes the whole onboarding workbook on the server.
const ONBOARDING_TIMEOUT = 180000;

export default class AccountsPage extends BasePage {
  openAddCustomerPortalAccount() {
    this.click(LOCATORS.settingsMenu);
    this.click(LOCATORS.accountsMenuItem);
    this.click(LOCATORS.addAccountButton);
    this.get(LOCATORS.customerPortalRadio).check();
  }

  /** @param {{name, phone, email, address1, address2, city, province, postalCode}} account */
  fillDetails(account) {
    this.type(LOCATORS.nameInput, account.name);
    this.type(LOCATORS.phoneInput, account.phone);
    this.type(LOCATORS.emailInput, account.email);
    this.type(LOCATORS.address1Input, account.address1);
    this.type(LOCATORS.address2Input, account.address2);
    this.type(LOCATORS.cityInput, account.city);

    this.click(LOCATORS.countryDropdown);
    cy.pickAntOption(); // the portal currently lists a single country
    this.click(LOCATORS.provinceDropdown);
    cy.pickAntOption(account.province);

    this.type(LOCATORS.postalCodeInput, account.postalCode);
  }

  /** @param {string} fixturePath path relative to cypress/fixtures */
  uploadOnboardingWorkbook(fixturePath) {
    // The input is hidden by the upload widget, hence force.
    this.get(LOCATORS.uploadInput).selectFile(`cypress/fixtures/${fixturePath}`, { force: true });
  }

  save() {
    this.click(LOCATORS.saveButton);
  }

  assertCreated() {
    this.assertVisible(LOCATORS.successMessage, { timeout: ONBOARDING_TIMEOUT }).and(
      'contain',
      'Success',
    );
  }
}
