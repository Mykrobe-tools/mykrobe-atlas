/* @flow */

import { all, fork } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { combineReducers } from 'redux';

import experiments, { experimentsSaga } from './experiments';
import experiment, { experimentSaga } from './experiment';
import { experimentFileSaga } from './experimentFile';
import { experimentProviderSaga } from './experimentProvider';
import experimentMetadataTemplate, {
  experimentMetadataTemplateSaga,
} from './experimentMetadataTemplate';
import experimentsFilters, {
  syncExperimentsFiltersSaga,
} from './experimentsFilters';
import experimentsChoices, {
  experimentsChoicesSaga,
} from './experimentsChoices';
import experimentsTree, { experimentsTreeSaga } from './experimentsTree';
import { experimentsFiltersChoicesSaga } from './experimentsFiltersChoices';
import { experimentsNotificationSaga } from './experimentsNotification';
import experimentsHighlighted from './experimentsHighlighted';
import { reducer as experimentSettings } from './experimentSettings';

export {
  getExperiments,
  getExperimentsError,
  getIsFetchingExperiments,
  getExperimentsStatus,
  getExperimentsIsPending,
  requestExperiments,
  experimentsSaga,
  getExperimentsSearchDescription,
  getExperimentsSearchQuery,
  getExperimentsInTree,
  getExperimentsNotInTree,
  getExperimentsWithGeolocation,
  getExperimentsWithoutGeolocation,
} from './experiments';

export {
  setExperimentsFilters,
  resetExperimentsFilters,
  getExperimentsFilters,
  getExperimentsDataFilters,
  getExperimentsHasDataFilters,
  getExperimentsChoicesFilters,
  getExperimentsHasChoicesFilters,
  getExperimentsFiltersSaga,
  experimentsFiltersActionTypes,
} from './experimentsFilters';

export {
  createExperiment,
  createExperimentId,
  deleteExperiment,
  experimentSaga,
  getExperiment,
  getExperimentAndNearestNeigbours,
  getExperimentAndNearestNeigboursInTree,
  getExperimentAndNearestNeigboursNotInTree,
  getExperimentAndNearestNeigboursWithGeolocation,
  getExperimentAndNearestNeigboursWithoutGeolocation,
  getExperimentError,
  getExperimentIsAnalysing,
  getExperimentDistanceIsSearching,
  getExperimentHasNearestNeigbours,
  getExperimentIsolateId,
  getExperimentMetadata,
  getExperimentMetadataCompletion,
  getExperimentMetadataLiveCompletion,
  getExperimentNearestNeigbours,
  getExperimentOwnerIsCurrentUser,
  getExperimentTransformed,
  getIsFetchingExperiment,
  newExperiment,
  requestExperiment,
  setExperiment,
  updateExperiment,
  getExperimentInTree,
  getExperimentNotInTree,
  getExperimentCluster,
  getExperimentClusterIsSearching,
} from './experiment';

export {
  getExperimentMetadataFormCompletion,
  EXPERIMENT_METADATA_FORM_ID,
} from './experimentMetadataForm';

export {
  updateExperimentFile,
  getIsFetching as getIsFetchingExperimentFile,
  experimentFileSaga,
} from './experimentFile';

export {
  updateExperimentProvider,
  getIsFetching as getIsFetchingExperimentProvider,
  experimentProviderSaga,
} from './experimentProvider';

export {
  requestExperimentMetadataTemplate,
  getExperimentMetadataTemplate,
  getIsFetching as getIsFetchingExperimentMetadataTemplate,
  experimentMetadataTemplateSaga,
} from './experimentMetadataTemplate';

export {
  requestExperimentsChoices,
  getExperimentsChoices,
  getError as getExperimentsChoicesError,
  getIsFetching as getIsFetchingExperimentsChoices,
  experimentsChoicesSaga,
} from './experimentsChoices';

export {
  requestExperimentsTree,
  getExperimentsTree,
  getExperimentsTreeNewick,
  getError as getExperimentsTreeError,
  getIsFetching as getIsFetchingExperimentsTree,
  experimentsTreeSaga,
} from './experimentsTree';

export {
  selectors as experimentSettingsSelectors,
  actions as experimentSettingsActions,
} from './experimentSettings';

const reducer = combineReducers({
  experiments,
  experimentsFilters,
  experimentsChoices,
  experimentsTree,
  experiment,
  experimentMetadataTemplate,
  experimentsHighlighted,
  experimentSettings,
});

export {
  getExperimentsHighlighted,
  setExperimentsHighlighted,
  resetExperimentsHighlighted,
  getExperimentsHighlightedInTree,
  getExperimentsHighlightedNotInTree,
  getExperimentsHighlightedWithGeolocation,
  getExperimentsHighlightedWithoutGeolocation,
} from './experimentsHighlighted';

export default reducer;

export function* rootExperimentsSaga(): Saga {
  yield all([
    fork(experimentsSaga),
    fork(experimentsChoicesSaga),
    fork(experimentSaga),
    fork(experimentFileSaga),
    fork(experimentMetadataTemplateSaga),
    fork(experimentProviderSaga),
    fork(experimentsFiltersChoicesSaga),
    fork(syncExperimentsFiltersSaga),
    fork(experimentsTreeSaga),
    fork(experimentsNotificationSaga),
  ]);
}
