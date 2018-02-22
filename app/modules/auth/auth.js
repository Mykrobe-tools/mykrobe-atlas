/* @flow */

// TODO: separate account creation and admin
// from sign in / out and authentication

import { createSelector } from 'reselect';
import { push } from 'react-router-redux';

import { FETCH_JSON } from '../api';
import * as CredentialsHelpers from '../../helpers/CredentialsHelpers';
import { showNotification } from '../notifications';
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

export const AUTH_VERIFY = `${typePrefix}AUTH_VERIFY`;
export const AUTH_VERIFY_SUCCESS = `${typePrefix}AUTH_VERIFY_SUCCESS`;
export const AUTH_VERIFY_FAILURE = `${typePrefix}AUTH_VERIFY_FAILURE`;

export const DELETE_ERROR = `${typePrefix}RESET_ERROR`;

// Selectors

export const getState = state => (state.auth ? state.auth.auth : undefined);

export const getAuth = createSelector(getState, auth => auth);
export const getIsLoading = createSelector(getState, auth => auth.isLoading);
export const getIsFetching = createSelector(getState, auth => auth.isFetching);
export const getIsAuthenticated = createSelector(
  getState,
  auth => !!(auth && auth.user && auth.user.token)
);
export const getError = createSelector(getState, auth => auth.error);
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
    case AUTH_SIGNUP:
    case AUTH_SIGNIN:
    case AUTH_FORGOT_PASSWORD: {
      // preserve transient user details
      return {
        ...state,
        user: action.meta,
        isFetching: true,
        error: undefined,
      };
    }
    case AUTH_SIGNOUT:
    case AUTH_REQUEST_USER:
    case AUTH_UPDATE_USER:
    case AUTH_RESET_PASSWORD:
    case AUTH_VERIFY:
      return {
        ...state,
        isFetching: true,
        error: undefined,
      };
    case AUTH_SIGNIN_SUCCESS:
    case AUTH_REQUEST_USER_SUCCESS:
    case AUTH_UPDATE_USER_SUCCESS:
    case AUTH_VERIFY_SUCCESS: {
      // TODO: this preserves the auth token which is currently stored inside the user object
      // refactor to store the token separately from the user profile
      const user = {
        ...state.user,
        ...action.payload,
      };
      return {
        ...state,
        isFetching: false,
        user,
      };
    }
    case AUTH_SIGNUP_FAILURE:
    case AUTH_SIGNIN_FAILURE:
    case AUTH_REQUEST_USER_FAILURE:
    case AUTH_UPDATE_USER_FAILURE:
    case AUTH_RESET_PASSWORD_FAILURE:
    case AUTH_FORGOT_PASSWORD_FAILURE:
    case AUTH_VERIFY_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case AUTH_SIGNUP_SUCCESS:
    case AUTH_FORGOT_PASSWORD_SUCCESS:
    case AUTH_RESET_PASSWORD_SUCCESS:
      // clear transient user details
      return {
        ...state,
        isFetching: false,
        user: undefined,
      };
    case AUTH_SIGNOUT_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
      };
    case DELETE_ERROR:
      return {
        ...state,
        error: undefined,
      };
    default:
      return state;
  }
}

// Side effects

export function deleteError() {
  return (dispatch: Function) => {
    dispatch({
      type: DELETE_ERROR,
    });
  };
}

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
    dispatch(push('/'));
    dispatch(showNotification('You are now logged out'));
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
        types: [
          { type: AUTH_SIGNIN, meta: user },
          AUTH_SIGNIN_SUCCESS,
          AUTH_SIGNIN_FAILURE,
        ],
      },
    });
    CredentialsHelpers.saveUser(payload);
    dispatch(showNotification('You are now logged in'));
    return payload;
  };
}

//
// Sign up
//

export function signUp(user: UserType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/users`,
        options: {
          method: 'POST',
          body: JSON.stringify(user),
        },
        types: [
          { type: AUTH_SIGNUP, meta: user },
          AUTH_SIGNUP_SUCCESS,
          AUTH_SIGNUP_FAILURE,
        ],
      },
    });
    dispatch(push('/auth/success'));
    return payload;
  };
}

//
// Forgot
//

export function forgotPassword(user: UserType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/auth/forgot`,
        options: {
          method: 'POST',
          body: JSON.stringify(user),
        },
        types: [
          { type: AUTH_FORGOT_PASSWORD, meta: user },
          AUTH_FORGOT_PASSWORD_SUCCESS,
          AUTH_FORGOT_PASSWORD_FAILURE,
        ],
      },
    });
    dispatch(push('/auth/forgotsuccess'));
    return payload;
  };
}

//
// reset password
//

export function resetPassword(reset: AuthResetPasswordType) {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/auth/reset`,
        options: {
          method: 'POST',
          body: JSON.stringify(reset),
        },
        types: [
          AUTH_RESET_PASSWORD,
          AUTH_RESET_PASSWORD_SUCCESS,
          AUTH_RESET_PASSWORD_FAILURE,
        ],
      },
    });
    dispatch(push('/auth/resetsuccess'));
    return payload;
  };
}

//
// current user
//

export function requestCurrentUser() {
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
    dispatch(showNotification('Profile updated'));
    return payload;
  };
}

export function deleteCurrentUser() {
  return async (dispatch: Function) => {
    const payload = await dispatch({
      [FETCH_JSON]: {
        url: `${BASE_URL}/user`,
        options: {
          method: 'DELETE',
        },
        types: [
          AUTH_DELETE_USER,
          AUTH_DELETE_USER_SUCCESS,
          AUTH_DELETE_USER_FAILURE,
        ],
      },
    });
    dispatch(showNotification('User deleted'));
    dispatch(signOut());
    return payload;
  };
}

//
// Verify
//

export function verify(verify: AuthVerificationType) {
  return async (dispatch: Function) => {
    try {
      const payload = await dispatch({
        [FETCH_JSON]: {
          url: `${BASE_URL}/auth/verify`,
          options: {
            method: 'POST',
            body: JSON.stringify(verify),
          },
          debug: true,
          types: [AUTH_VERIFY, AUTH_VERIFY_SUCCESS, AUTH_VERIFY_FAILURE],
        },
      });
      dispatch(push('/auth/verifysuccess'));
      return payload;
    } catch (error) {
      dispatch(push('/auth/verifyfailure'));
      throw error;
    }
  };
}
