import LoginPage from '../../../pages/LoginPage';
import NavigationMenu from '../../../pages/customer/NavigationMenu';
import SettingsPage from '../../../pages/customer/SettingsPage';
import { isEnabled, requiredEnv } from '../../../support/utils/env';

/**
 * Opt-in: this spec rotates a real password. Enable it with
 * CYPRESS_runPasswordChange=true, and only against a disposable user.
 *
 * The test changes the password, proves the new one works, then changes it back
 * so the next run (and every other spec) can still log in. If the application
 * forbids re-using an old password the restore step fails; use two throw-away
 * passwords in that case.
 */
const describeWhenEnabled = isEnabled('runPasswordChange') ? describe : describe.skip;

describeWhenEnabled('Customer portal > change password', () => {
  const login = new LoginPage();
  const menu = new NavigationMenu();
  const settings = new SettingsPage();

  it('changes the password, signs in with it, then restores the original', () => {
    const email = requiredEnv('customerEmail');
    const original = requiredEnv('customerPassword');
    const replacement = requiredEnv('customerNewPassword');

    login.loginAs('customer');
    menu.openSettings();
    settings.openSection('changePassword');
    settings.changePassword(original, replacement);

    login.submitCredentials(email, replacement);
    login.assertLoggedIn();

    menu.openSettings();
    settings.openSection('changePassword');
    settings.changePassword(replacement, original);
  });
});
