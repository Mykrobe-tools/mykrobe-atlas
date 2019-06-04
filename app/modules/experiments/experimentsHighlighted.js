/* @flow */

import { createSelector } from 'reselect';
import produce from 'immer';

import { getExperimentsTreeNewick } from './experimentsTree';
import {
  experimentsInTree,
  experimentsWithGeolocation,
} from './util/experiments';

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

// highlighted with and without tree node

export const getExperimentsHighlightedInTree = createSelector(
  getExperimentsTreeNewick,
  getExperimentsHighlighted,
  (newick, experiments) => experimentsInTree(newick, experiments, true)
);

export const getExperimentsHighlightedNotInTree = createSelector(
  getExperimentsTreeNewick,
  getExperimentsHighlighted,
  (newick, experiments) => experimentsInTree(newick, experiments, false)
);

// highlighted with and without geolocation available

export const getExperimentsHighlightedWithGeolocation = createSelector(
  getExperimentsHighlighted,
  experiments => experimentsWithGeolocation(experiments, true)
);

export const getExperimentsHighlightedWithoutGeolocation = createSelector(
  getExperimentsHighlighted,
  experiments => experimentsWithGeolocation(experiments, false)
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
