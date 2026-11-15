import BasePage from '../BasePage';
import { cssModule } from '../../support/utils/selectors';

const MENU = cssModule('MenuItemsContainer');

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const LOCATORS = {
  invoices: `${MENU} > :nth-child(3)`,
  settings: `${MENU} > :nth-child(4)`,
  shipmentsMenu:
    '/html[1]/body[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]',
  // The header renders differently on the settings screens.
  shipmentsMenuInSettings: ':nth-child(2) > :nth-child(2) > .ant-space > [style=""]',
  singleShipment: '/html[1]/body[1]/div[2]/div[1]/div[1]/ul[1]/li[1]/span[1]/div[1]',
  bulkShipment: '/html[1]/body[1]/div[2]/div[1]/div[1]/ul[1]/li[2]/span[1]/div[1]',
};

export default class NavigationMenu extends BasePage {
  openInvoices() {
    this.click(LOCATORS.invoices);
  }

  openSettings() {
    this.click(LOCATORS.settings);
  }

  openSingleShipment() {
    this.hover(LOCATORS.shipmentsMenu);
    this.click(LOCATORS.singleShipment);
  }

  openSingleShipmentFromSettings() {
    this.hover(LOCATORS.shipmentsMenuInSettings);
    this.click(LOCATORS.singleShipment);
  }

  openBulkShipment() {
    this.hover(LOCATORS.shipmentsMenu);
    this.click(LOCATORS.bulkShipment);
  }
}
