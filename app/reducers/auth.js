/* @flow */

import * as types from '../constants/ActionTypes';
import type { AuthType } from '../types/AuthTypes';

// isLoading = loading from keychain
// isFetching = fetching from API

const initialState: AuthType = {
  isLoading: true,
  isFetching: false,
  isAuthenticated: false,
};

function shapeState(state: AuthType): AuthType {
  const isAuthenticated: boolean = !!(state.user && state.user.token);
  const shapedState: AuthType = {
    ...state,
    isAuthenticated,
  };
  return shapedState;
}

/**
 * Create the raw state and then shape
 * @param  {AuthType=initialState} state
 * @param  {Object={}} action
 */

export default function auth(
  state: AuthType = initialState,
  action: Object = {}
) {
  const rawState = authRawState(state, action);
  const newState = shapeState(rawState);
  return newState;
}

function authRawState(state: AuthType, action: Object) {
  switch (action.type) {
    case types.AUTH_INITIALISE:
      return {
        ...state,
        isLoading: true,
      };
    case types.AUTH_INITIALISE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.user,
      };
    case types.AUTH_SIGNIN:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case types.AUTH_SIGNIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        user: action.user,
      };
    case types.AUTH_SIGNIN_FAIL:
      return {
        ...state,
        isFetching: false,
        user: undefined,
        failureReason: action.statusText,
      };
    case types.AUTH_FORGOT_PASSWORD:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case types.AUTH_FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case types.AUTH_FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    case types.AUTH_RESET_PASSWORD:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case types.AUTH_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };
    case types.AUTH_RESET_PASSWORD_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    case types.AUTH_SIGNOUT:
      return {
        ...state,
      };
    case types.AUTH_SIGNOUT_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
      };
    case types.AUTH_UPDATE_FAILURE_REASON:
      return {
        ...state,
        failureReason: action.failureReason,
      };
    case types.AUTH_DELETE_FAILURE_REASON:
      return {
        ...state,
        failureReason: undefined,
      };
    case types.AUTH_REQUEST_USER:
      return {
        ...state,
        isFetching: true,
        failureReason: undefined,
      };
    case types.AUTH_REQUEST_USER_SUCCESS:
      const user = {
        ...state.user,
        ...action.user,
      };
      return {
        ...state,
        user,
        isFetching: false,
      };
    case types.AUTH_REQUEST_USER_FAIL:
      return {
        ...state,
        isFetching: false,
        failureReason: action.statusText,
      };
    default:
      return state;
  }
}
