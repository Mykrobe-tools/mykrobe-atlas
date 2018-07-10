/* @flow */

import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { createSelector } from 'reselect';

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

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_EXPERIMENT_METADATA_TEMPLATE:
      return {
        ...state,
        isFetching: true,
        data: initialState.data,
      };
    case REQUEST_EXPERIMENT_METADATA_TEMPLATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload,
      };
    default:
      return state;
  }
}

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

export function* experimentMetadataTemplateSaga(): Generator<*, *, *> {
  yield all([fork(requestMetadataTemplateWatcher)]);
}
