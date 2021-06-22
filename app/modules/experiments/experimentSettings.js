/* @flow */

import { createSelector } from 'reselect';
import { createAction, createReducer } from '@reduxjs/toolkit';

export const typePrefix = 'experiment/experimentSettings/';

export const actions = {
  setDistanceThreshold: createAction(`${typePrefix}SET_DISTANCE_THRESHOLD`),
};

// Selectors

const getState = (state: any) => state?.experimentSettings;

const getDistanceThreshold = createSelector(
  getState,
  (experimentSettings) => experimentSettings.distanceThreshold
);

export const selectors = {
  getDistanceThreshold,
};

// Reducer

type State = {
  distanceThreshold: number,
};

const initialState: State = {
  distanceThreshold: 10,
};

export const reducer = createReducer(initialState, {
  [actions.setDistanceThreshold]: (state, action) => {
    state.distanceThreshold = action.payload;
  },
});
