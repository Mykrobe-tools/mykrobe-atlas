/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';
import { getExperimentsFiltersSaga } from './experimentsFilters';

const module = createEntityModule('experimentsMetadataChoices', {
  typePrefix: 'experiments/experimentsMetadataChoices/',
  getState: state => state.experiments.experimentsMetadataChoices,
  request: {
    operationId: 'experimentsMetadataChoices',
    parameters: getExperimentsFiltersSaga,
  },
});

const {
  reducer,
  actions: { requestEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  requestEntity as requestExperimentsMetadataChoices,
  getEntity as getExperimentsMetadataChoices,
  getError,
  getIsFetching,
  entitySaga as experimentsMetadataChoicesSaga,
};

export default reducer;
