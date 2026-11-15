import LoginPage from '../../../pages/LoginPage';
import NavigationMenu from '../../../pages/customer/NavigationMenu';
import InvoicesPage from '../../../pages/customer/InvoicesPage';
import SettingsPage from '../../../pages/customer/SettingsPage';
import ShipmentPage from '../../../pages/customer/ShipmentPage';
import account from '../../../fixtures/admin/new-account.json';
import settingsData from '../../../fixtures/customer/settings.json';
import { requiredEnv } from '../../../support/utils/env';
import { uniqueEmail } from '../../../support/utils/data';

/**
 * Relies on the account created by the admin "account onboarding" spec (or an
 * account with the same details), because it asserts the stored profile.
 */
describe('Customer portal > invoices and account settings', () => {
  const login = new LoginPage();
  const menu = new NavigationMenu();
  const invoices = new InvoicesPage();
  const settings = new SettingsPage();
  const shipment = new ShipmentPage();

  beforeEach(() => {
    login.loginAs('customer');
  });

  it('shows the credit limit on the invoices page', () => {
    menu.openInvoices();

    invoices.assertCreditLimitVisible();
  });

  it('shows the onboarded account details in settings', () => {
    menu.openSettings();

    settings.assertAccountDetails({
      name: account.defaultAdminFirstName,
      phone: account.phone,
      email: requiredEnv('customerEmail'),
      address1: account.address1,
      address2: account.address2,
      postalCode: account.postalCode,
    });
  });

  it('adds a new user to the account', () => {
    menu.openSettings();
    settings.openSection('users');

    settings.addUser({ ...settingsData.newUser, email: uniqueEmail('qa.user') });
  });

  it('adds a default address that pre-fills the ship-from details', () => {
    const address = settingsData.newAddress;

    menu.openSettings();
    settings.openSection('addressBook');
    settings.addDefaultAddress(address);

    menu.openSingleShipmentFromSettings();
    shipment.assertShipFromPrefilled(address);
  });
});
