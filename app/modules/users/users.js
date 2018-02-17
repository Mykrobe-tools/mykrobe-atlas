/* @flow */

// TODO: split and separate all users vs single
// users
// user

import { createSelector } from 'reselect';
import { push, replace } from 'react-router-redux';

import fetchJson from '../../api/fetchJson';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import type { UserType } from '../../types/UserTypes';

export const typePrefix = 'users/users/';
export const REQUEST_ALL_USERS = `${typePrefix}REQUEST_ALL_USERS`;
export const REQUEST_ALL_USERS_SUCCESS = `${typePrefix}REQUEST_ALL_USERS_SUCCESS`;
export const REQUEST_ALL_USERS_FAIL = `${typePrefix}REQUEST_ALL_USERS_FAIL`;

export const NEW_USER = `${typePrefix}NEW_USER`;

export const CREATE_USER = `${typePrefix}CREATE_USER`;
export const CREATE_USER_SUCCESS = `${typePrefix}CREATE_USER_SUCCESS`;
export const CREATE_USER_FAIL = `${typePrefix}CREATE_USER_FAIL`;

export const REQUEST_USER = `${typePrefix}REQUEST_USER`;
export const REQUEST_USER_SUCCESS = `${typePrefix}REQUEST_USER_SUCCESS`;
export const REQUEST_USER_FAIL = `${typePrefix}REQUEST_USER_FAIL`;

export const UPDATE_USER = `${typePrefix}UPDATE_USER`;
export const UPDATE_USER_SUCCESS = `${typePrefix}UPDATE_USER_SUCCESS`;
export const UPDATE_USER_FAIL = `${typePrefix}UPDATE_USER_FAIL`;

export const DELETE_USER = `${typePrefix}DELETE_USER`;
export const DELETE_USER_SUCCESS = `${typePrefix}DELETE_USER_SUCCESS`;
export const DELETE_USER_FAIL = `${typePrefix}DELETE_USER_FAIL`;

export const ASSIGN_USER_ROLE = `${typePrefix}ASSIGN_USER_ROLE`;
export const ASSIGN_USER_ROLE_SUCCESS = `${typePrefix}ASSIGN_USER_ROLE_SUCCESS`;
export const ASSIGN_USER_ROLE_FAIL = `${typePrefix}ASSIGN_USER_ROLE_FAIL`;

// Selectors

export const getState = state => state.users.users;
export const getIsFetching = createSelector(
  getState,
  users => users.isFetching
);
export const getIsSaving = createSelector(getState, users => users.isSaving);
export const getData = createSelector(getState, users => users.data);
export const getDataById = createSelector(getData, data => {
  let dataById = {};
  data.map(item => {
    dataById[item.id] = item;
  });
  return dataById;
});

// Reducer

const initialState = {
  isFetching: false,
  isSaving: false,
  data: {},
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
  switch (action.type) {
    case REQUEST_ALL_USERS:
      return {
        ...state,
        isFetching: true,
      };
    case REQUEST_ALL_USERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          allUsers: action.data,
        },
      };
    case REQUEST_USER:
      return {
        ...state,
        isFetching: true,
        data: {
          ...state.data,
          user: undefined,
        },
      };
    case REQUEST_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          user: action.data,
        },
      };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          user: action.data,
        },
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isSaving: false,
        data: {
          ...state.data,
          user: action.data,
        },
      };
    //
    //
    //
    case NEW_USER:
      return {
        ...state,
        data: {
          ...state.data,
          user: {},
        },
      };
    case CREATE_USER:
      return {
        ...state,
        isSaving: true,
      };
    case UPDATE_USER:
      return {
        ...state,
        isSaving: true,
      };
    default:
      return state;
  }
}

// Action creators

// Side effects

export function requestAllUsers() {
  return (dispatch: Function) => {
    dispatch({
      type: REQUEST_ALL_USERS,
    });
    return fetchJson(`${BASE_URL}/users`)
      .then(data => {
        dispatch({
          type: REQUEST_ALL_USERS_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: REQUEST_ALL_USERS_FAIL,
          error,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function requestUser(id: string) {
  return (dispatch: Function) => {
    dispatch({
      type: REQUEST_USER,
      id,
    });
    return fetchJson(`${BASE_URL}/users/${id}`)
      .then(data => {
        dispatch({
          type: REQUEST_USER_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: REQUEST_USER_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function createOrUpdateUser(user: UserType) {
  return user.id ? updateUser(user) : createUser(user);
}

export function createUser(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: CREATE_USER,
    });
    return fetchJson(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(data => {
        dispatch({
          type: CREATE_USER_SUCCESS,
          data,
        });
        // replace the new id in the url
        dispatch(replace(data.id));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: CREATE_USER_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function updateUser(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: UPDATE_USER,
    });
    if (!user.id) {
      throw new Error('Missing user id');
    }
    return fetchJson(`${BASE_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((data: UserType) => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Profile updated',
          })
        );
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: UPDATE_USER_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function deleteUser(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: DELETE_USER,
    });
    if (!user.id) {
      throw new Error('Missing user id');
    }
    return fetchJson(`${BASE_URL}/users/${user.id}`, {
      method: 'DELETE',
    })
      .then((data: UserType) => {
        dispatch({
          type: DELETE_USER_SUCCESS,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'User deleted',
          })
        );
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: DELETE_USER_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

export function assignUserRole(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: ASSIGN_USER_ROLE,
    });
    if (!user.id) {
      throw new Error('Missing user id');
    }
    return fetchJson(`${BASE_URL}/users/${user.id}/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data: UserType) => {
        dispatch({
          type: ASSIGN_USER_ROLE_SUCCESS,
          data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'Role updated',
          })
        );
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: ASSIGN_USER_ROLE_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        return Promise.reject(error);
      });
  };
}

//
// new
//

export function newUser() {
  return (dispatch: Function) => {
    dispatch({
      type: NEW_USER,
    });
    dispatch(push('/users/new'));
    return Promise.resolve();
  };
}
