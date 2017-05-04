/* @flow */

import fetchJson from '../api/fetchJson';
import * as ActionTypes from '../constants/ActionTypes';
import { USER_COOKIE_NAME, BASE_URL } from '../constants/APIConstants.js';
import cookie from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';

import * as NotificationCategories from '../constants/NotificationCategories';
import {showNotification} from './NotificationActions';
import type { AuthResetPasswordType } from '../types/AuthTypes';
import type { UserType } from '../types/UserTypes';

//
// Auth token
//

export function loadAuth() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_INITIALISE
    });
    const user: UserType = cookie.load(USER_COOKIE_NAME);
    if (user && user.token) {
      const decode = jwtDecode(user.token);
      console.log('user.token decode:', decode);
    }
    dispatch({
      type: ActionTypes.AUTH_INITIALISE_SUCCESS,
      user
    });
    return Promise.resolve(user);
  };
}

//
// Sign out
//

export function signOut() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_SIGNOUT
    });
    cookie.remove(USER_COOKIE_NAME);
    dispatch({
      type: ActionTypes.AUTH_SIGNOUT_SUCCESS
    });
    dispatch(showNotification({
      category: NotificationCategories.SUCCESS,
      content: 'You are now logged out'
    }));
    dispatch(push('/'));
  };
}

//
// Sign in
//

export function signIn(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_SIGNIN
    });
    return fetchJson(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((data: UserType) => {
      cookie.save(USER_COOKIE_NAME, data);
      dispatch({
        type: ActionTypes.AUTH_SIGNIN_SUCCESS,
        user: data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'You are now logged in'
      }));
      dispatch(push('/'));
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_SIGNIN_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
    });
  };
}

//
// Sign up
//

export function signUp(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_SIGNUP
    });
    return fetchJson(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((data) => {
      dispatch({
        type: ActionTypes.AUTH_SIGNUP_SUCCESS,
        user: data
      });
      dispatch(push('/auth/success'));
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_SIGNUP_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
    });
  };
}

//
// Forgot
//

export function forgotPassword(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_FORGOT_PASSWORD
    });
    return fetchJson(`${BASE_URL}/auth/forgot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((data) => {
      dispatch({
        type: ActionTypes.AUTH_FORGOT_PASSWORD_SUCCESS
      });
      dispatch(push('/auth/forgotsuccess'));
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_FORGOT_PASSWORD_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
    });
  };
}

//
// reset password
//

export function resetPassword(reset: AuthResetPasswordType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_RESET_PASSWORD
    });
    return fetchJson(`${BASE_URL}/auth/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reset)
    })
    .then((data) => {
      dispatch({
        type: ActionTypes.AUTH_RESET_PASSWORD_SUCCESS
      });
      dispatch(push('/auth/resetsuccess'));
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_RESET_PASSWORD_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
    });
  };
}

//
// Failure reason
//

export function updateFailureReason(failureReason: string) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_UPDATE_FAILURE_REASON,
      failureReason
    });
  };
}

export function deleteFailureReason() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_DELETE_FAILURE_REASON
    });
  };
}

//
// current user
//

export function fetchCurrentUser() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_REQUEST_USER
    });
    return fetchJson(`${BASE_URL}/user`)
      .then((data) => {
        dispatch({
          type: ActionTypes.AUTH_REQUEST_USER_SUCCESS,
          user: data
        });
        return Promise.resolve(data);
      })
      .catch((error) => {
        const {statusText} = error;
        dispatch({
          type: ActionTypes.AUTH_REQUEST_USER_FAIL,
          statusText
        });
        dispatch(showNotification({
          category: NotificationCategories.ERROR,
          content: statusText
        }));
        return Promise.reject(error);
      });
  };
}

export function updateCurrentUser(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_UPDATE_USER
    });
    return fetchJson(`${BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then((data: UserType) => {
      dispatch({
        type: ActionTypes.AUTH_UPDATE_USER_SUCCESS,
        user: data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'Profile updated'
      }));
      return Promise.resolve(data);
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_UPDATE_USER_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}

export function deleteCurrentUser() {
  return (dispatch: Function) => {
    dispatch({
      type: ActionTypes.AUTH_DELETE_USER
    });
    return fetchJson(`${BASE_URL}/user`, {
      method: 'DELETE'
    })
    .then((data: UserType) => {
      dispatch({
        type: ActionTypes.AUTH_DELETE_USER_SUCCESS,
        user: data
      });
      dispatch(showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'User deleted'
      }));
      dispatch(signOut());
    })
    .catch((error) => {
      const {statusText} = error;
      dispatch({
        type: ActionTypes.AUTH_DELETE_USER_FAIL,
        statusText
      });
      dispatch(showNotification({
        category: NotificationCategories.ERROR,
        content: statusText
      }));
      return Promise.reject(error);
    });
  };
}
