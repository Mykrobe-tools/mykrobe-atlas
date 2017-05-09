/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  isSaving: false,
  data: {
  }
};

function shapeState(state) {
  const data = normalizeData(state.data);
  const shapedState = {
    ...state,
    data
  };
  return shapedState;
}

function normalizeData(data) {
  if (!data.allOrganisations) {
    return data;
  }
  let allOrganisationsById = normalizeDataById(data.allOrganisations);
  return {
    ...data,
    allOrganisationsById
  };
}

function normalizeDataById(data: Array<{id: string}>): Object {
  let dataById = {};
  data.map((item) => {
    dataById[item.id] = item;
  });
  return dataById;
}

export default function organisations(state: any = initialState, action: Object = {}) {
  const rawState = organisationsRawState(state, action);
  const newState = shapeState(rawState);
  return newState;
}

function organisationsRawState(state, action: Object) {
  switch (action.type) {
    case ActionTypes.REQUEST_ALL_ORGANISATIONS:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.REQUEST_ALL_ORGANISATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          allOrganisations: action.data
        }
      };
    default:
      return state;
  }
}
