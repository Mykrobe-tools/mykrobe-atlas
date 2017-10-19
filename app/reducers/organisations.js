/* @flow */

import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isFetching: false,
  isSaving: false,
  data: {},
};

function shapeState(state) {
  const data = normalizeData(state.data);
  const shapedState = {
    ...state,
    data,
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
    allOrganisationsById,
  };
}

function normalizeDataById(data: Array<{ id: string }>): Object {
  let dataById = {};
  data.map(item => {
    dataById[item.id] = item;
  });
  return dataById;
}

export default function organisations(
  state: any = initialState,
  action: Object = {}
) {
  const rawState = organisationsRawState(state, action);
  const newState = shapeState(rawState);
  return newState;
}

function organisationsRawState(state, action: Object) {
  switch (action.type) {
    case ActionTypes.REQUEST_ALL_ORGANISATIONS:
      return {
        ...state,
        isFetching: true,
      };
    case ActionTypes.REQUEST_ALL_ORGANISATIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          allOrganisations: action.data,
        },
      };
    case ActionTypes.REQUEST_ORGANISATION:
      return {
        ...state,
        isFetching: true,
        data: {
          ...state.data,
          organisation: undefined,
        },
      };
    case ActionTypes.REQUEST_ORGANISATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    case ActionTypes.CREATE_ORGANISATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    case ActionTypes.UPDATE_ORGANISATION_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          organisation: action.data,
        },
      };
    //
    //
    //
    case ActionTypes.NEW_ORGANISATION:
      return {
        ...state,
        data: {
          ...state.data,
          organisation: {},
        },
      };
    case ActionTypes.CREATE_ORGANISATION:
      return {
        ...state,
        isSaving: true,
      };
    case ActionTypes.UPDATE_ORGANISATION:
      return {
        ...state,
        isSaving: true,
      };
    case ActionTypes.ORGANISATION_UPDATE_FAILURE_REASON:
      return {
        ...state,
        failureReason: action.failureReason,
      };
    case ActionTypes.ORGANISATION_DELETE_FAILURE_REASON:
      return {
        ...state,
        failureReason: undefined,
      };
    default:
      return state;
  }
}
