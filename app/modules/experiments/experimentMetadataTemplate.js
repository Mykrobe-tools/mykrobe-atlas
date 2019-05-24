/* @flow */

import { all, fork, put, takeEvery } from 'redux-saga/effects';
import type { Saga } from 'redux-saga';
import { createSelector } from 'reselect';
import produce from 'immer';

export const typePrefix = 'experiments/experimentMetadataTemplate/';
export const REQUEST_EXPERIMENT_METADATA_TEMPLATE = `${typePrefix}REQUEST_EXPERIMENT_METADATA_TEMPLATE`;
export const REQUEST_EXPERIMENT_METADATA_TEMPLATE_SUCCESS = `${typePrefix}REQUEST_EXPERIMENT_METADATA_TEMPLATE_SUCCESS`;

// Selectors

export const getState = state => state.experiments.experimentMetadataTemplate;
export const getExperimentMetadataTemplate = createSelector(
  getState,
  state => state.data
);
export const getIsFetching = createSelector(
  getState,
  state => state.isFetching
);

// Reducer

const initialState = {
  isFetching: false,
  data: [],
};

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, draft => {
    switch (action.type) {
      case REQUEST_EXPERIMENT_METADATA_TEMPLATE:
        Object.assign(draft, {
          isFetching: true,
          data: initialState.data,
        });
        return;
      case REQUEST_EXPERIMENT_METADATA_TEMPLATE_SUCCESS:
        Object.assign(draft, {
          isFetching: false,
          data: action.payload,
        });
        return;
      default:
        return;
    }
  });

export default reducer;

// Action creators

export const requestExperimentMetadataTemplate = () => ({
  type: REQUEST_EXPERIMENT_METADATA_TEMPLATE,
});

// Side effects

function* requestMetadataTemplateWatcher() {
  yield takeEvery(REQUEST_EXPERIMENT_METADATA_TEMPLATE, function*() {
    const testData = require('./__fixtures__/template.json');
    const template = testData['MODS'];
    // const template =
    //   user.organisation && user.organisation.template
    //     ? user.organisation.template
    //     : Object.keys(testData)[0];
    // dispatch({
    //   type: SET_METADATA_TEMPLATE,
    //   template: testData[template],
    // });
    yield put({
      type: REQUEST_EXPERIMENT_METADATA_TEMPLATE_SUCCESS,
      payload: template,
    });
  });
}

export function* experimentMetadataTemplateSaga(): Saga {
  yield all([fork(requestMetadataTemplateWatcher)]);
}
