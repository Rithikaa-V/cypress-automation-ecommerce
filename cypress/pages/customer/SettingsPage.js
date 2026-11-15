import BasePage from '../BasePage';
import { cssModule } from '../../support/utils/selectors';

const INPUT = cssModule('inputContainer');
const FIELD = cssModule('fieldContainer');
const PERSONAL = cssModule('PersonalFieldContainer');

// Locators are copied from the original suite and are positional (see README ->
// "Locator policy"). Ask the frontend team for data-testid attributes and replace.
const SIDEBAR_ITEM = (position) =>
  `/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/section[1]/aside[1]/div[1]/ul[1]/li[${position}]/span[1]`;

const SECTION_POSITION = { users: 3, addressBook: 4, changePassword: 5 };

const LOCATORS = {
  editProfile: `${cssModule('EditImageContainer')} > img`,
  // Profile fields are nested one level deeper than the address fields.
  profileField: (position) =>
    `:nth-child(1) > ${PERSONAL} > :nth-child(${position}) > ${INPUT} > ${FIELD} > .ant-input`,
  field: (position) => `:nth-child(${position}) > ${INPUT} > ${FIELD} > .ant-input`,
  closeProfile: '.ant-btn-round',

  createButton: `${cssModule('CreateAddressButtonContainer')} > .ant-btn`,
  userRoleSelect: `${FIELD} > .ant-select > .ant-select-selector`,
  addressSearch: '#rc_select_4',
  defaultAddressCheckbox: ':nth-child(2) > div > .ant-checkbox-wrapper > :nth-child(2)',
  modalSubmit: '.ant-modal-footer > .ant-btn-round',
  modalBody: '.ant-modal-body',
  modalClose: '.ant-modal-close-x',

  passwordField: (position) =>
    `:nth-child(${position}) > ${INPUT} > :nth-child(2) > div > .ant-input-affix-wrapper > .ant-input`,
  passwordSubmit: '.ant-btn',
  goToLogin: `${cssModule('LoginButtonContainer')} > .ant-btn`,
};

// Positions of the fields in the profile / user / address forms.
const PROFILE = { name: 1, phone: 2, email: 3, address1: 4, address2: 5, postalCode: 9 };
const USER_FORM = { firstName: 1, lastName: 2, phone: 3, email: 4 };
const ADDRESS_FORM = { name: 1, phone: 8, email: 9 };
const PASSWORD_FORM = { current: 2, next: 3, confirm: 4 };

export default class SettingsPage extends BasePage {
  openSection(section) {
    this.click(SIDEBAR_ITEM(SECTION_POSITION[section]));
  }

  /** Open the profile editor and compare every field with the expected account. */
  assertAccountDetails({ name, phone, email, address1, address2, postalCode }) {
    this.click(LOCATORS.editProfile);
    this.assertValue(LOCATORS.profileField(PROFILE.name), name);
    this.assertValue(LOCATORS.profileField(PROFILE.phone), phone);
    this.assertValue(LOCATORS.profileField(PROFILE.email), email);
    this.assertValue(LOCATORS.field(PROFILE.address1), address1);
    this.assertValue(LOCATORS.field(PROFILE.address2), address2);
    this.assertValue(LOCATORS.field(PROFILE.postalCode), postalCode);
    this.click(LOCATORS.closeProfile);
  }

  addUser({ firstName, lastName, phone, email }) {
    this.click(LOCATORS.createButton);
    this.type(LOCATORS.field(USER_FORM.firstName), firstName);
    this.type(LOCATORS.field(USER_FORM.lastName), lastName);
    this.type(LOCATORS.field(USER_FORM.phone), phone);
    this.type(LOCATORS.field(USER_FORM.email), email);
    this.click(LOCATORS.userRoleSelect);
    cy.pickAntOption();
    this._submitModalAndDismissConfirmation();
  }

  /** Create the default address-book entry. */
  addDefaultAddress({ name, street, phone, email }) {
    this.click(LOCATORS.createButton);
    this.click(LOCATORS.defaultAddressCheckbox);
    this.type(LOCATORS.field(ADDRESS_FORM.name), name);
    this.type(LOCATORS.addressSearch, street);
    // Address suggestions come from an external lookup; choose the first one.
    cy.pickAntOption();
    this.type(LOCATORS.field(ADDRESS_FORM.phone), phone);
    this.type(LOCATORS.field(ADDRESS_FORM.email), email);
    this._submitModalAndDismissConfirmation();
  }

  changePassword(currentPassword, newPassword) {
    this.type(LOCATORS.passwordField(PASSWORD_FORM.current), currentPassword, { sensitive: true });
    this.type(LOCATORS.passwordField(PASSWORD_FORM.next), newPassword, { sensitive: true });
    this.type(LOCATORS.passwordField(PASSWORD_FORM.confirm), newPassword, { sensitive: true });
    this.click(LOCATORS.passwordSubmit);
    // The app signs the user out and offers a button back to the login form.
    this.click(LOCATORS.goToLogin);
  }

  _submitModalAndDismissConfirmation() {
    this.click(LOCATORS.modalSubmit);
    this.assertVisible(LOCATORS.modalBody);
    this.click(LOCATORS.modalClose);
  }
}
