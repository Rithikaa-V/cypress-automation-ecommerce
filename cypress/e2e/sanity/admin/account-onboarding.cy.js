import LoginPage from '../../../pages/LoginPage';
import AccountsPage from '../../../pages/admin/AccountsPage';
import newAccount from '../../../fixtures/admin/new-account.json';
import { isEnabled, requiredEnv } from '../../../support/utils/env';

/**
 * Creates the customer account that the customer-portal specs log in with.
 *
 * Opt-in (CYPRESS_runAccountOnboarding=true): the onboarding workbook carries a
 * fixed account code, so the application rejects a second run until that code
 * is changed in cypress/fixtures/files/account-onboard-template.xlsx. Treat it
 * as environment provisioning, not as part of the regression run.
 */
const describeWhenEnabled = isEnabled('runAccountOnboarding') ? describe : describe.skip;

describeWhenEnabled('Admin portal > account onboarding', () => {
  const login = new LoginPage();
  const accounts = new AccountsPage();

  it('creates a customer-portal account from the onboarding workbook', () => {
    login.loginAs('admin');

    accounts.openAddCustomerPortalAccount();
    accounts.fillDetails({ ...newAccount, email: requiredEnv('customerEmail') });
    accounts.uploadOnboardingWorkbook(newAccount.onboardingWorkbook);
    accounts.save();

    accounts.assertCreated();
  });
});
