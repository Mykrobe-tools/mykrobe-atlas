/* @flow */

import { createEntityModule } from 'makeandship-js-common/src/modules/generic';

import { FETCH_JSON } from '../api';
import { API_URL } from '../../constants/APIConstants.js';

export const typePrefix = 'experiments/experiments/';

const module = createEntityModule('experiments', {
  typePrefix,
  initialData: [],
  getState: state => state.experiments.experiments,
  create: {
    // TODO: refactor into separate 'experiment' module
    operationId: 'experimentsCreate',
  },
  request: {
    operationId: 'experimentsList',
  },
});

const {
  reducer,
  actionType,
  actions: { createEntity, requestEntity },
  selectors: { getEntity, getError, getIsFetching },
  sagas: { entitySaga },
} = module;

export {
  createEntity as createExperiment,
  requestEntity as requestExperiments,
  getEntity as getExperiments,
  getError,
  getIsFetching,
  entitySaga as experimentsSaga,
  actionType as experimentsActionType,
};

// TODO: refactor into separate 'experiment' module with swagger id

export const UPLOAD_EXPERIMENT_FILE = `${typePrefix}UPLOAD_EXPERIMENT_FILE`;
export const UPLOAD_EXPERIMENT_FILE_SUCCESS = `${typePrefix}UPLOAD_EXPERIMENT_FILE_SUCCESS`;
export const UPLOAD_EXPERIMENT_FILE_FAILURE = `${typePrefix}UPLOAD_EXPERIMENT_FILE_FAILURE`;

export function uploadExperimentFile(id: string, file: Object) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${API_URL}/experiments/${id}/file`,
        options: {
          method: 'PUT',
          body: JSON.stringify(file),
        },
        types: [
          UPLOAD_EXPERIMENT_FILE,
          UPLOAD_EXPERIMENT_FILE_SUCCESS,
          UPLOAD_EXPERIMENT_FILE_FAILURE,
        ],
      },
    });
    return payload;
  };
}

export default reducer;
