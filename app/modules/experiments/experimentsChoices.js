/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getExperimentsDataFiltersSaga } from './experimentsFilters';
import qs from 'qs';
import { call } from 'redux-saga/effects';

// FIXME: here we are constructing an explicit query URL to bypass swagger-client
// this is so we can query foo.bar[min]=&foo.bar[max]=
// which are currently otherwise omitted as they cannot be expressed by Swagger 2 spec.

const module = createEntityModule('experimentsChoices', {
  typePrefix: 'experiments/experimentsChoices/',
  getState: (state) => state.experiments.experimentsChoices,
  request: {
    // operationId: 'experimentsChoices',
    // parameters: getExperimentsDataFiltersSaga,
    url: function* () {
      const filters = yield call(getExperimentsDataFiltersSaga);
      const query = qs.stringify(filters);
      const url = `/experiments/choices?${query}`;
      return yield url;
    },
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
