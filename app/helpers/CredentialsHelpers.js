/* @flow */

// TODO: rewrite services to use redux-saga so we don't have to access store directly here

import store from '../store';
import { getAccessToken } from 'makeandship-js-common/src/modules/auth';

export function accessToken(): ?string {
  if (!store.getState) {
    console.log('No store . getState');
    return;
  }
  const state = store.getState();
  const accessToken = getAccessToken(state);
  debugger;
  return accessToken;
}
