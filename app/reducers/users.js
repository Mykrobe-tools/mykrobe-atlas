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
  if (!data.allUsers) {
    return data;
  }
  let allUsersById = normalizeDataById(data.allUsers);
  return {
    ...data,
    allUsersById
  };
}

function normalizeDataById(data: Array<{id: string}>): Object {
  let dataById = {};
  data.map((item) => {
    dataById[item.id] = item;
  });
  return dataById;
}

export default function users(state: any = initialState, action: Object = {}) {
  const rawState = usersRawState(state, action);
  const newState = shapeState(rawState);
  return newState;
}

function usersRawState(state, action: Object) {
  switch (action.type) {
    case ActionTypes.REQUEST_ALL_USERS:
      return {
        ...state,
        isFetching: true
      };
    case ActionTypes.REQUEST_ALL_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          allUsers: action.data
        }
      };
    case ActionTypes.REQUEST_USER:
      return {
        ...state,
        isFetching: true,
        data: {
          ...state.data,
          user: undefined
        }
      };
    case ActionTypes.REQUEST_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          user: action.data
        }
      };
    case ActionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          user: action.data
        }
      };
    case ActionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          user: action.data
        }
      };
    //
    //
    //
    case ActionTypes.NEW_USER:
      return {
        ...state,
        data: {
          ...state.data,
          user: {}
        }
      };
    case ActionTypes.CREATE_USER:
      return {
        ...state,
        isSaving: true
      };
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        isSaving: true
      };
    default:
      return state;
  }
}
