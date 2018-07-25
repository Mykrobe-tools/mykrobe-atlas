/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getExperimentsDataFiltersSaga } from './experimentsFilters';

const module = createEntityModule('experimentsChoices', {
  typePrefix: 'experiments/experimentsChoices/',
  getState: state => state.experiments.experimentsChoices,
  request: {
    operationId: 'experimentsChoices',
    parameters: getExperimentsDataFiltersSaga,
  },
});

const {
  reducer,
  actions: { requestEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  requestEntity as requestExperimentsChoices,
  getEntity as getExperimentsChoices,
  getError,
  getIsFetching,
  entitySaga as experimentsChoicesSaga,
};

export default reducer;
