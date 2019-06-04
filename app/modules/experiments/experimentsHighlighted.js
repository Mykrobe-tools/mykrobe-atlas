/* @flow */

import { createSelector } from 'reselect';
import produce from 'immer';
import _get from 'lodash.get';

import { getExperimentsTree } from './experimentsTree';
import { newickContainsNodeId } from './util/newick';

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

export const experimentsInTree = (
  experimentsTree,
  experiments,
  inTree = true
) => {
  return experiments.filter(experiment => {
    const isolateId = _get(experiment, 'metadata.sample.isolateId') || '–';
    const contains = newickContainsNodeId(experimentsTree, isolateId);
    if (contains) {
      return inTree;
    }
    return !inTree;
  });
};

export const getExperimentsHighlightedInTree = createSelector(
  getExperimentsTree,
  getExperimentsHighlighted,
  (experimentsTree, experimentsHighlighted) =>
    experimentsInTree(experimentsTree, experimentsHighlighted, true)
);

export const getExperimentsHighlightedNotInTree = createSelector(
  getExperimentsTree,
  getExperimentsHighlighted,
  (experimentsTree, experimentsHighlighted) =>
    experimentsInTree(experimentsTree, experimentsHighlighted, false)
);

// highlighted with and without geolocation available

export const experimentsWithGeolocation = (
  experiments,
  withGeolocation = true
) => {
  return experiments.filter(experiment => {
    const longitudeIsolate = _get(
      experiment,
      'metadata.sample.longitudeIsolate'
    );
    const latitudeIsolate = _get(experiment, 'metadata.sample.latitudeIsolate');
    if (longitudeIsolate && latitudeIsolate) {
      return withGeolocation;
    }
    return !withGeolocation;
  });
};

export const getExperimentsHighlightedWithGeolocation = createSelector(
  getExperimentsHighlighted,
  experimentsHighlighted =>
    experimentsWithGeolocation(experimentsHighlighted, true)
);

export const getExperimentsHighlightedWithoutGeolocation = createSelector(
  getExperimentsHighlighted,
  experimentsHighlighted =>
    experimentsWithGeolocation(experimentsHighlighted, false)
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
