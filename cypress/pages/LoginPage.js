import BasePage from './BasePage';
import { getApp, isEnabled } from '../support/utils/env';

// All three portals share the same login form.
const LOCATORS = {
  appRoot: '#root > *',
  email: '//*[@id="root"]/div/div/div/div[2]/div/div/form/div/div[1]/div/input',
  password: '//*[@id="root"]/div/div/div/div[2]/div/div/form/div/div[2]/div/span/input',
  submit: '//*[@id="root"]/div/div/div/div[2]/div/div/form/div/div[4]/button',
};

export default class LoginPage extends BasePage {
  /**
   * Log in to 'admin' | 'phase2Admin' | 'customer' using URLs and credentials
   * from the Cypress env (see cypress.env.example.json).
   *
   * With `useSessionCache` enabled the login is performed once per user and
   * restored with cy.session() for later tests.
   */
  loginAs(appName) {
    const { url, email, password } = getApp(appName);

    const performLogin = () => {
      cy.visit(url);
      this.submitCredentials(email, password);
      this.assertLoggedIn();
    };

    if (isEnabled('useSessionCache')) {
      cy.session([appName, email], performLogin, {
        validate: () => {
          cy.visit(url);
          this.assertLoggedIn();
        },
        cacheAcrossSpecs: true,
      });
      cy.visit(url);
    } else {
      performLogin();
    }
  }

  submitCredentials(email, password) {
    this.type(LOCATORS.email, email);
    this.type(LOCATORS.password, password, { sensitive: true });
    this.click(LOCATORS.submit);
  }

  /** The app has rendered and the login form is gone. */
  assertLoggedIn() {
    this.get(LOCATORS.appRoot).should('exist');
    this.assertNotExist(LOCATORS.email, { timeout: 20000 });
  }
}
