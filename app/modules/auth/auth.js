/* @flow */

// TODO: separate account creation and admin
// from sign in / out and authentication

import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { fetchJson } from '../api';
import * as CredentialsHelpers from '../../helpers/CredentialsHelpers';
import { showNotification, NotificationCategories } from '../notifications';
import { BASE_URL } from '../../constants/APIConstants.js';
import type {
  AuthResetPasswordType,
  AuthVerificationType,
} from '../../types/AuthTypes';
import type { UserType } from '../../types/UserTypes';

export const typePrefix = 'auth/auth/';

export const AUTH_INITIALISE = `${typePrefix}AUTH_INITIALISE`;
export const AUTH_INITIALISE_SUCCESS = `${typePrefix}AUTH_INITIALISE_SUCCESS`;

export const AUTH_SIGNUP = `${typePrefix}AUTH_SIGNUP`;
export const AUTH_SIGNUP_SUCCESS = `${typePrefix}AUTH_SIGNUP_SUCCESS`;
export const AUTH_SIGNUP_FAIL = `${typePrefix}AUTH_SIGNUP_FAIL`;

export const AUTH_SIGNIN = `${typePrefix}AUTH_SIGNIN`;
export const AUTH_SIGNIN_SUCCESS = `${typePrefix}AUTH_SIGNIN_SUCCESS`;
export const AUTH_SIGNIN_FAIL = `${typePrefix}AUTH_SIGNIN_FAIL`;

export const AUTH_FORGOT_PASSWORD = `${typePrefix}AUTH_FORGOT_PASSWORD`;
export const AUTH_FORGOT_PASSWORD_SUCCESS = `${typePrefix}AUTH_FORGOT_PASSWORD_SUCCESS`;
export const AUTH_FORGOT_PASSWORD_FAIL = `${typePrefix}AUTH_FORGOT_PASSWORD_FAIL`;

export const AUTH_RESET_PASSWORD = `${typePrefix}AUTH_RESET_PASSWORD`;
export const AUTH_RESET_PASSWORD_SUCCESS = `${typePrefix}AUTH_RESET_PASSWORD_SUCCESS`;
export const AUTH_RESET_PASSWORD_FAIL = `${typePrefix}AUTH_RESET_PASSWORD_FAIL`;

export const AUTH_SIGNOUT = `${typePrefix}AUTH_SIGNOUT`;
export const AUTH_SIGNOUT_SUCCESS = `${typePrefix}AUTH_SIGNOUT_SUCCESS`;

export const AUTH_REQUEST_USER = `${typePrefix}AUTH_REQUEST_USER`;
export const AUTH_REQUEST_USER_SUCCESS = `${typePrefix}AUTH_REQUEST_USER_SUCCESS`;
export const AUTH_REQUEST_USER_FAIL = `${typePrefix}AUTH_REQUEST_USER_FAIL`;

export const AUTH_UPDATE_USER = `${typePrefix}AUTH_UPDATE_USER`;
export const AUTH_UPDATE_USER_SUCCESS = `${typePrefix}AUTH_UPDATE_USER_SUCCESS`;
export const AUTH_UPDATE_USER_FAIL = `${typePrefix}AUTH_UPDATE_USER_FAIL`;

export const AUTH_DELETE_USER = `${typePrefix}AUTH_DELETE_USER`;
export const AUTH_DELETE_USER_SUCCESS = `${typePrefix}AUTH_DELETE_USER_SUCCESS`;
export const AUTH_DELETE_USER_FAIL = `${typePrefix}AUTH_DELETE_USER_FAIL`;

export const AUTH_UPDATE_FAILURE_REASON = `${typePrefix}AUTH_UPDATE_FAILURE_REASON`;
export const AUTH_DELETE_FAILURE_REASON = `${typePrefix}AUTH_DELETE_FAILURE_REASON`;

export const AUTH_VERIFY = `${typePrefix}AUTH_VERIFY`;
export const AUTH_VERIFY_SUCCESS = `${typePrefix}AUTH_VERIFY_SUCCESS`;
export const AUTH_VERIFY_FAIL = `${typePrefix}AUTH_VERIFY_FAIL`;

// Selectors

export const getState = state => (state.auth ? state.auth.auth : undefined);

export const getIsLoading = createSelector(getState, auth => auth.isLoading);
export const getIsFetching = createSelector(getState, auth => auth.isFetching);
export const getIsAuthenticated = createSelector(
  getState,
  auth => !!(auth && auth.user && auth.user.token)
);
export const getFailureReason = createSelector(
  getState,
  auth => auth.failureReason
);
export const getUser = createSelector(getState, auth => auth.user);
export const getAuthToken = createSelector(getState, auth => {
  return auth && auth.user ? auth.user.token : undefined;
});

console.error(
  'TODO: replace access to auth values with selectors, especially isAuthenticated'
);

// Reducer

const initialState: AuthType = {
  isLoading: true,
  isFetching: false,
};

export default function reducer(state: AuthType, action: Object) {
  switch (action.type) {
    case AUTH_INITIALISE:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_INITIALISE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.user,
      };
    case AUTH_SIGNIN:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case AUTH_SIGNIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.user,
      };
    case AUTH_SIGNIN_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    case AUTH_FORGOT_PASSWORD:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case AUTH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case AUTH_FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    case AUTH_RESET_PASSWORD:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case AUTH_RESET_PASSWORD_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    case AUTH_SIGNOUT:
      return {
        ...state,
      };
    case AUTH_SIGNOUT_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_UPDATE_FAILURE_REASON:
      return {
        ...state,
        failureReason: action.failureReason,
      };
    case AUTH_DELETE_FAILURE_REASON:
      return {
        ...state,
        failureReason: undefined,
      };
    case AUTH_REQUEST_USER:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case AUTH_REQUEST_USER_SUCCESS: {
      const user = {
        ...state.user,
        ...action.user,
      };
      return {
        ...state,
        user,
        isFetching: false,
      };
    }
    case AUTH_REQUEST_USER_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    default:
      return state;
  }
}

// Side effects

//
// Auth token
//

export function loadAuth() {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_INITIALISE,
    });
    const user = CredentialsHelpers.loadUser();
    dispatch({
      type: AUTH_INITIALISE_SUCCESS,
      user,
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
      type: AUTH_SIGNOUT,
    });
    CredentialsHelpers.deleteUser();
    dispatch({
      type: AUTH_SIGNOUT_SUCCESS,
    });
    dispatch(
      showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'You are now logged out',
      })
    );
    return Promise.resolve();
  };
}

//
// Sign in
//

export function signIn(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_SIGNIN,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    )
      .then((data: UserType) => {
        CredentialsHelpers.saveUser(data);
        dispatch({
          type: AUTH_SIGNIN_SUCCESS,
          user: data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'You are now logged in',
          })
        );
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_SIGNIN_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: 'Sorry, your email/password was incorrect',
          })
        );
        return Promise.reject(error);
      });
  };
}

//
// Sign up
//

export function signUp(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_SIGNUP,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    )
      .then(data => {
        dispatch({
          type: AUTH_SIGNUP_SUCCESS,
          user: data,
        });
        dispatch(push('/auth/success'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_SIGNUP_FAIL,
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
// Forgot
//

export function forgotPassword(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_FORGOT_PASSWORD,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/auth/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    )
      .then(data => {
        dispatch({
          type: AUTH_FORGOT_PASSWORD_SUCCESS,
        });
        dispatch(push('/auth/forgotsuccess'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_FORGOT_PASSWORD_FAIL,
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
// reset password
//

export function resetPassword(reset: AuthResetPasswordType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_RESET_PASSWORD,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/auth/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reset),
      })
    )
      .then(data => {
        dispatch({
          type: AUTH_RESET_PASSWORD_SUCCESS,
        });
        dispatch(push('/auth/resetsuccess'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_RESET_PASSWORD_FAIL,
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
// Failure reason
//

export function updateFailureReason(failureReason: string) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_UPDATE_FAILURE_REASON,
      failureReason,
    });
  };
}

export function deleteFailureReason() {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_DELETE_FAILURE_REASON,
    });
  };
}

//
// current user
//

export function fetchCurrentUser() {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_REQUEST_USER,
    });
    return dispatch(fetchJson(`${BASE_URL}/user`))
      .then(data => {
        dispatch({
          type: AUTH_REQUEST_USER_SUCCESS,
          user: data,
        });
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_REQUEST_USER_FAIL,
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

export function updateCurrentUser(user: UserType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_UPDATE_USER,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    )
      .then((data: UserType) => {
        dispatch({
          type: AUTH_UPDATE_USER_SUCCESS,
          user: data,
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
          type: AUTH_UPDATE_USER_FAIL,
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

export function deleteCurrentUser() {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_DELETE_USER,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/user`, {
        method: 'DELETE',
      })
    )
      .then((data: UserType) => {
        dispatch({
          type: AUTH_DELETE_USER_SUCCESS,
          user: data,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.SUCCESS,
            content: 'User deleted',
          })
        );
        dispatch(signOut());
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_DELETE_USER_FAIL,
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
// Verify
//

export function verify(verify: AuthVerificationType) {
  return (dispatch: Function) => {
    dispatch({
      type: AUTH_VERIFY,
    });
    return dispatch(
      fetchJson(`${BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verify),
      })
    )
      .then(data => {
        dispatch({
          type: AUTH_VERIFY_SUCCESS,
          user: data,
        });
        dispatch(push('/auth/verifysuccess'));
        return Promise.resolve(data);
      })
      .catch(error => {
        const { statusText } = error;
        dispatch({
          type: AUTH_VERIFY_FAIL,
          statusText,
        });
        dispatch(
          showNotification({
            category: NotificationCategories.ERROR,
            content: statusText,
          })
        );
        dispatch(push('/auth/verifyfailure'));
        return Promise.reject(error);
      });
  };
}
