/* @flow */

// TODO: separate account creation and admin
// from sign in / out and authentication

import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { fetchJson, FETCH_JSON } from '../api';
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
export const AUTH_SIGNUP_FAILURE = `${typePrefix}AUTH_SIGNUP_FAILURE`;

export const AUTH_SIGNIN = `${typePrefix}AUTH_SIGNIN`;
export const AUTH_SIGNIN_SUCCESS = `${typePrefix}AUTH_SIGNIN_SUCCESS`;
export const AUTH_SIGNIN_FAILURE = `${typePrefix}AUTH_SIGNIN_FAILURE`;

export const AUTH_FORGOT_PASSWORD = `${typePrefix}AUTH_FORGOT_PASSWORD`;
export const AUTH_FORGOT_PASSWORD_SUCCESS = `${typePrefix}AUTH_FORGOT_PASSWORD_SUCCESS`;
export const AUTH_FORGOT_PASSWORD_FAILURE = `${typePrefix}AUTH_FORGOT_PASSWORD_FAILURE`;

export const AUTH_RESET_PASSWORD = `${typePrefix}AUTH_RESET_PASSWORD`;
export const AUTH_RESET_PASSWORD_SUCCESS = `${typePrefix}AUTH_RESET_PASSWORD_SUCCESS`;
export const AUTH_RESET_PASSWORD_FAILURE = `${typePrefix}AUTH_RESET_PASSWORD_FAILURE`;

export const AUTH_SIGNOUT = `${typePrefix}AUTH_SIGNOUT`;
export const AUTH_SIGNOUT_SUCCESS = `${typePrefix}AUTH_SIGNOUT_SUCCESS`;

export const AUTH_REQUEST_USER = `${typePrefix}AUTH_REQUEST_USER`;
export const AUTH_REQUEST_USER_SUCCESS = `${typePrefix}AUTH_REQUEST_USER_SUCCESS`;
export const AUTH_REQUEST_USER_FAILURE = `${typePrefix}AUTH_REQUEST_USER_FAILURE`;

export const AUTH_UPDATE_USER = `${typePrefix}AUTH_UPDATE_USER`;
export const AUTH_UPDATE_USER_SUCCESS = `${typePrefix}AUTH_UPDATE_USER_SUCCESS`;
export const AUTH_UPDATE_USER_FAILURE = `${typePrefix}AUTH_UPDATE_USER_FAILURE`;

export const AUTH_DELETE_USER = `${typePrefix}AUTH_DELETE_USER`;
export const AUTH_DELETE_USER_SUCCESS = `${typePrefix}AUTH_DELETE_USER_SUCCESS`;
export const AUTH_DELETE_USER_FAILURE = `${typePrefix}AUTH_DELETE_USER_FAILURE`;

export const AUTH_UPDATE_FAILURE_REASON = `${typePrefix}AUTH_UPDATE_FAILURE_REASON`;
export const AUTH_DELETE_FAILURE_REASON = `${typePrefix}AUTH_DELETE_FAILURE_REASON`;

export const AUTH_VERIFY = `${typePrefix}AUTH_VERIFY`;
export const AUTH_VERIFY_SUCCESS = `${typePrefix}AUTH_VERIFY_SUCCESS`;
export const AUTH_VERIFY_FAILURE = `${typePrefix}AUTH_VERIFY_FAILURE`;

// Selectors

export const getState = state => (state.auth ? state.auth.auth : undefined);

export const getAuth = createSelector(getState, auth => auth);
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

// Reducer

const initialState: AuthType = {
  isLoading: true,
  isFetching: false,
};

export default function reducer(
  state: Object = initialState,
  action: Object = {}
) {
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
        user: action.payload,
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
        user: action.payload,
      };
    case AUTH_SIGNIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        failureReason: action.payload.statusText,
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
    case AUTH_FORGOT_PASSWORD_FAILURE:
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
    case AUTH_RESET_PASSWORD_FAILURE:
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
    case AUTH_UPDATE_USER:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case AUTH_REQUEST_USER_SUCCESS:
    case AUTH_UPDATE_USER_SUCCESS: {
      const user = {
        ...state.user,
        ...action.payload,
      };
      return {
        ...state,
        user,
        isFetching: false,
      };
    }
    case AUTH_REQUEST_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        failureReason: action.payload.statusText,
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
  return async (dispatch: Function) => {
    dispatch({
      type: AUTH_INITIALISE,
    });
    const user = CredentialsHelpers.loadUser();
    dispatch({
      type: AUTH_INITIALISE_SUCCESS,
      payload: user,
    });
    return user;
  };
}

//
// Sign out
//

export function signOut() {
  return async (dispatch: Function) => {
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
  };
}

//
// Sign in
//

export function signIn(user: UserType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/auth/login`,
        options: {
          method: 'POST',
          body: JSON.stringify(user),
        },
        types: [AUTH_SIGNIN, AUTH_SIGNIN_SUCCESS, AUTH_SIGNIN_FAILURE],
      },
    });
    CredentialsHelpers.saveUser(payload);
    dispatch(
      showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'You are now logged in',
      })
    );
    return payload;
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
          type: AUTH_SIGNUP_FAILURE,
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
          type: AUTH_FORGOT_PASSWORD_FAILURE,
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
          type: AUTH_RESET_PASSWORD_FAILURE,
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
    return dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/user`,
        types: [
          AUTH_REQUEST_USER,
          AUTH_REQUEST_USER_SUCCESS,
          AUTH_REQUEST_USER_FAILURE,
        ],
      },
    });
  };
}

export function updateCurrentUser(user: UserType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/user`,
        options: {
          method: 'PUT',
          body: JSON.stringify(user),
        },
        types: [
          AUTH_UPDATE_USER,
          AUTH_UPDATE_USER_SUCCESS,
          AUTH_UPDATE_USER_FAILURE,
        ],
      },
    });
    dispatch(
      showNotification({
        category: NotificationCategories.SUCCESS,
        content: 'Profile updated',
      })
    );
    return payload;
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
          type: AUTH_DELETE_USER_FAILURE,
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
          type: AUTH_VERIFY_FAILURE,
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
