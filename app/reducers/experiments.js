/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = [];

export default function experiments(state: Array<Object> = initialState, action: Object = {}) {
  switch (action.type) {
    case ActionTypes.REQUEST_EXPERIMENTS:
      return state;
    case ActionTypes.RECEIVE_EXPERIMENTS:
      return action.data;
    default:
      return state;
  }
}
