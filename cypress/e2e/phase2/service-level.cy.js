import LoginPage from '../../pages/LoginPage';
import ServiceLevelPage, { SORTABLE_COLUMNS } from '../../pages/admin/ServiceLevelPage';
import { uniqueName } from '../../support/utils/data';

const DAYS_OF_OPERATION = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

describe('Admin portal (phase 2) > service levels', () => {
  const login = new LoginPage();
  const serviceLevels = new ServiceLevelPage();

  beforeEach(() => {
    login.loginAs('phase2Admin');
  });

  context('sorting', () => {
    Object.entries(SORTABLE_COLUMNS).forEach(([column, position]) => {
      it(`"${column}" cycles ascending, descending, unsorted`, () => {
        serviceLevels.verifySortCycle(position);
      });
    });
  });

  context('creation', () => {
    it('creates a service level that is listed in the table', () => {
      const name = uniqueName('Service level');

      serviceLevels.openCreateForm();
      serviceLevels.readGeneratedId().then((id) => {
        serviceLevels.fillForm({
          name,
          description: 'Ensures on-time delivery despite environmental hurdles',
          days: DAYS_OF_OPERATION,
        });
        serviceLevels.save();

        serviceLevels.assertListed(name, { id });
      });
    });
  });
});
