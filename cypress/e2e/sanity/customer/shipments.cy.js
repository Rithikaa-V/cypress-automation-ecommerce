import LoginPage from '../../../pages/LoginPage';
import NavigationMenu from '../../../pages/customer/NavigationMenu';
import QuotePage from '../../../pages/customer/QuotePage';
import ShipmentPage, { SHIPMENT_ID_ALIAS } from '../../../pages/customer/ShipmentPage';
import ShipmentHistoryPage from '../../../pages/customer/ShipmentHistoryPage';
import BulkShipmentPage from '../../../pages/customer/BulkShipmentPage';
import data from '../../../fixtures/customer/shipment.json';

describe('Customer portal > shipments', () => {
  const login = new LoginPage();
  const menu = new NavigationMenu();
  const quote = new QuotePage();
  const shipment = new ShipmentPage();
  const history = new ShipmentHistoryPage();
  const bulk = new BulkShipmentPage();

  beforeEach(() => {
    login.loginAs('customer');
  });

  /** Confirm the success dialog, print the label, and find the shipment in history. */
  const assertShipmentIsTrackable = () => {
    shipment.assertCreated();
    shipment.printLabel();
    shipment.trackOrder();

    cy.get(`@${SHIPMENT_ID_ALIAS}`).then((shipmentId) => {
      history.searchFor(shipmentId);
      history.assertListed(shipmentId);
    });
  };

  it('creates a shipment from a rate quote and finds it in shipment history', () => {
    quote.getQuote(data.quote);
    shipment.selectQuote();
    shipment.fillShippingDetails(data.shipFrom, data.shipTo);
    shipment.fillPackageDetailsWithoutInsurance({
      references: data.references,
      description: data.packageDescription,
    });
    shipment.createShipmentFromQuote();

    assertShipmentIsTrackable();
  });

  it('creates a direct single shipment with insurance and finds it in shipment history', () => {
    menu.openSingleShipment();
    shipment.fillShippingDetails(data.shipFrom, data.shipTo);
    shipment.fillPackageDetailsWithInsurance({
      references: data.references,
      description: data.packageDescription,
      insuranceAmount: data.insuranceAmount,
      dimensions: data.directPackage,
    });
    shipment.selectQuote();
    shipment.createShipmentDirect();

    assertShipmentIsTrackable();
  });

  it('bulk upload: downloads the template, reports invalid rows and ships the valid ones', () => {
    cy.task('clearDownloads');

    menu.openBulkShipment();
    bulk.downloadTemplate();
    bulk.uploadWorkbook(data.bulkWorkbook);
    bulk.chooseShipmentType();
    bulk.continue();
    bulk.downloadErrorReportAndContinue();

    bulk.selectValidRow();
    bulk.createShipments();
    bulk.reviewAndConfirm();
    bulk.assertCreated();
    bulk.trackOrders();
  });
});
