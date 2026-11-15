import BasePage from '../BasePage';
import { cssModule } from '../../support/utils/selectors';

const LOCATORS = {
  creditLimit: cssModule('creditLimitContainer'),
};

export default class InvoicesPage extends BasePage {
  assertCreditLimitVisible() {
    this.assertVisible(LOCATORS.creditLimit);
  }
}
