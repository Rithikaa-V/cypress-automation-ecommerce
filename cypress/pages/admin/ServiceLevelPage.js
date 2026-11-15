import BasePage from '../BasePage';

const TABLE_HEADER =
  '//*[@id="root"]/div/div/div/div[2]/div/div[2]/div/div[1]/div/div/div/div/div/div/div/div/div[1]/table/thead/tr';

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const MODAL = '/html/body/div[2]/div/div[2]/div/div[2]/div[1]/div/div[2]';
const LOCATORS = {
  addButton: '//*[@id="root"]/div/div/div/div[2]/div/div[1]/div[2]/div/div/div[2]/div/button',
  tableRows: '.ant-table-tbody tr',
  sortUp: '.ant-table-column-sorter-up',
  sortDown: '.ant-table-column-sorter-down',

  idInput: `${MODAL}/div[1]/div/div/input`,
  nameInput: `${MODAL}/div[2]/div/div/input`,
  descriptionInput: `${MODAL}/div[3]/div/div/div/textarea`,
  daysGroup: `${MODAL}/div[6]/div/div/div`,
  saveButton: '/html/body/div[2]/div/div[2]/div/div[2]/div[2]/button[2]',
};

/** Sortable columns, mapped to their 1-based position in the table header. */
export const SORTABLE_COLUMNS = {
  'Service level ID': 1,
  'Service level name': 2,
  Description: 3,
  'Start / end time': 4,
  'Days of operation': 5,
};

export default class ServiceLevelPage extends BasePage {
  headerCell(position) {
    return `${TABLE_HEADER}/th[${position}]`;
  }

  /**
   * Click a column header through its three sort states:
   * ascending -> descending -> unsorted.
   */
  verifySortCycle(position) {
    const header = this.headerCell(position);
    const arrow = (selector) => this.get(header).find(selector);

    this.click(header);
    arrow(LOCATORS.sortUp).should('have.class', 'active');
    arrow(LOCATORS.sortDown).should('not.have.class', 'active');

    this.click(header);
    arrow(LOCATORS.sortDown).should('have.class', 'active');
    arrow(LOCATORS.sortUp).should('not.have.class', 'active');

    this.click(header);
    arrow(LOCATORS.sortUp).should('not.have.class', 'active');
    arrow(LOCATORS.sortDown).should('not.have.class', 'active');
  }

  openCreateForm() {
    // The modal locators are anchored on /html/body/div[2]. Toasts and dropdown
    // portals shift that index, so start from a clean DOM.
    cy.reload();
    this.click(LOCATORS.addButton);
  }

  /** Locator for the checkbox of one weekday inside the days group. */
  dayCheckbox(day) {
    return `${LOCATORS.daysGroup}//label[.//span[normalize-space(text())="${day}"]]//input[@type="checkbox"]`;
  }

  fillForm({ name, description, days }) {
    this.type(LOCATORS.nameInput, name);
    this.type(LOCATORS.descriptionInput, description);
    days.forEach((day) => this.get(this.dayCheckbox(day)).check({ force: true }));
  }

  /** Resolves with the ID the form generated (empty string if it is blank). */
  readGeneratedId() {
    return this.get(LOCATORS.idInput).invoke('val');
  }

  save() {
    this.click(LOCATORS.saveButton);
  }

  /** The new service level is in the table; when `id` is given, its row shows that id too. */
  assertListed(name, { id, timeout = 20000 } = {}) {
    const row = cy.contains(LOCATORS.tableRows, name, { timeout }).should('be.visible');
    if (id) {
      row.should('contain.text', id);
    }
  }
}
