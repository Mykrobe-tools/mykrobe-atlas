/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  experiments: []
};

export default function experiments(state: Object = initialState, action: Object = {}) {
  switch (action.type) {
    case ActionTypes.REQUEST_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case ActionTypes.RECEIVE_EXPERIMENTS:
      return Object.assign({}, state, {
        isFetching: false,
        experiments: action.data
      });
    default:
      return state;
  }
}
