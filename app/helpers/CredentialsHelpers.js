/* @flow */

// TODO: rewrite services to use redux-saga so we don't have to access store directly here

import store from '../store/store';
import { getAccessToken } from 'makeandship-js-common/src/modules/auth';

export function accessToken(): ?string {
  console('store', store);
  debugger;
  const state = store.getState();
  const accessToken = getAccessToken(state);
  debugger;
  return accessToken;
}
