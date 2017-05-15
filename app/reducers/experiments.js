/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  filterValues: [],
  samples: [],
  total: 0
};

export default function experiments(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case ActionTypes.REQUEST_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: true,
        samples: [],
        total: null
      });
    case ActionTypes.RECEIVE_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: false,
        samples: action.data.results,
        total: action.data.summary.hits
      });
    case ActionTypes.REQUEST_FILTER_VALUES:
      return Object.assign({}, state, {
        filterValues: []
      });
    case ActionTypes.RECEIVE_FILTER_VALUES:
      return Object.assign({}, state, {
        filterValues: action.data
      });
    default:
      return state;
  }
}
