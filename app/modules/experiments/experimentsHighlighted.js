/* @flow */

import { createSelector } from 'reselect';
import produce from 'immer';

export const typePrefix = 'experiments/experimentsHighlighted/';
export const SET_EXPERIMENTS_HIGHLIGHTED = `${typePrefix}SET_EXPERIMENTS_HIGHLIGHTED`;
export const RESET_EXPERIMENTS_HIGHLIGHTED = `${typePrefix}RESET_EXPERIMENTS_HIGHLIGHTED`;

// Selectors

export const getState = (state: any) =>
  state.experiments.experimentsHighlighted;

export const getExperimentsHighlighted = createSelector(
  getState,
  experimentsHighlighted => experimentsHighlighted
);

// Action creators

export function setExperimentsHighlighted(payload: array) {
  return {
    type: SET_EXPERIMENTS_HIGHLIGHTED,
    payload,
  };
}

export function resetExperimentsHighlighted() {
  return {
    type: RESET_EXPERIMENTS_HIGHLIGHTED,
  };
}

// Reducer

const initialState = [];

const reducer = (state?: State = initialState, action?: Object = {}): State =>
  produce(state, () => {
    switch (action.type) {
      case SET_EXPERIMENTS_HIGHLIGHTED:
        return action.payload;
      case RESET_EXPERIMENTS_HIGHLIGHTED:
        return initialState;
      default:
        return;
    }
  });

export default reducer;

// Side effects
