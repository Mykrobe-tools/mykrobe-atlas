/* @flow */

import cookie from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { USER_COOKIE_NAME } from '../constants/APIConstants.js';
import type { UserType } from '../types/UserTypes';

export function loadUser(): ?UserType {
  const userJson: string = cookie.load(USER_COOKIE_NAME, { path: '/' });
  let user: UserType;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
      if (user && user.token) {
        const decode = jwtDecode(user.token);
        console.log('user.token decode:', decode);
      }
    }
    catch (err) {
      // invalid json, just don't authenticate
    }
  }
  return user;
}

export function deleteUser() {
  cookie.remove(USER_COOKIE_NAME, { path: '/' });
}

export function saveUser(user: UserType) {
  // only save token
  const userObject = {
    token: user.token
  };
  cookie.save(USER_COOKIE_NAME, JSON.stringify(userObject), { path: '/' });
}
