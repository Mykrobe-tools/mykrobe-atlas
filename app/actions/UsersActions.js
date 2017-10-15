/* @flow */

import fetchJson from '../api/fetchJson';
import type { UserType } from '../types/UserTypes';
import * as NotificationCategories from '../constants/NotificationCategories';
import { showNotification } from './NotificationActions';
import { BASE_URL } from '../constants/APIConstants.js';
import * as ActionTypes from '../constants/ActionTypes';
import { push, replace } from 'react-router-redux';

export function requestAllUsers() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.REQUEST_ALL_USERS,
    });
    return fetchJson(`${BASE_URL}/users`)
      .then(data => {
        dispatch({
          type: ActionTypes.REQUEST_ALL_USERS_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: ActionTypes.REQUEST_ALL_USERS_FAIL,
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
      type: ActionTypes.REQUEST_USER,
      id,
    });
    return fetchJson(`${BASE_URL}/users/${id}`)
      .then(data => {
        dispatch({
          type: ActionTypes.REQUEST_USER_SUCCESS,
          data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: ActionTypes.REQUEST_USER_FAIL,
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
      type: ActionTypes.CREATE_USER,
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
          type: ActionTypes.CREATE_USER_SUCCESS,
          data,
        });
        // replace the new id in the url
        dispatch(replace(data.id));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: ActionTypes.CREATE_USER_FAIL,
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
      type: ActionTypes.UPDATE_USER,
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
          type: ActionTypes.UPDATE_USER_SUCCESS,
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
          type: ActionTypes.UPDATE_USER_FAIL,
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
      type: ActionTypes.DELETE_USER,
    });
    if (!user.id) {
      throw new Error('Missing user id');
    }
    return fetchJson(`${BASE_URL}/users/${user.id}`, {
      method: 'DELETE',
    })
      .then((data: UserType) => {
        dispatch({
          type: ActionTypes.DELETE_USER_SUCCESS,
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
          type: ActionTypes.DELETE_USER_FAIL,
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
      type: ActionTypes.ASSIGN_USER_ROLE,
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
          type: ActionTypes.ASSIGN_USER_ROLE_SUCCESS,
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
          type: ActionTypes.ASSIGN_USER_ROLE_FAIL,
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
      type: ActionTypes.NEW_USER,
    });
    dispatch(push('/users/new'));
    return Promise.resolve();
  };
}
