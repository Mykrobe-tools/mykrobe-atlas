/* @flow */

import { createSelector } from 'reselect';

import type { UserType } from '../../types/UserTypes';

export const typePrefix = 'metadata/template/';
export const SET_METADATA_TEMPLATE = `${typePrefix}SET_METADATA_TEMPLATE`;

// Selectors

export const getState = state => state.metadata.template;
export const getTemplate = createSelector(
  getState,
  template => template.template
);

// Reducer

const initialState = {
  template: [],
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case SET_METADATA_TEMPLATE:
      return {
        ...state,
        template: action.template,
      };
    default:
      return state;
  }
}

// Action creators

// Side effects

export function fetchTemplate(user: UserType) {
  return (dispatch: Function) => {
    // todo - integrate with API
    const testData = require('../../../test/__fixtures__/api/template.json');
    const template =
      user.organisation && user.organisation.template
        ? user.organisation.template
        : Object.keys(testData)[0];
    dispatch({
      type: SET_METADATA_TEMPLATE,
      template: testData[template],
    });
  };
}
