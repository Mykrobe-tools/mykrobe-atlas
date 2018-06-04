/* @flow */

import Cookies from 'universal-cookie';
import jwtDecode from 'jwt-decode';
import { AUTH_COOKIE_NAME } from '../constants/APIConstants.js';
import type { UserType } from '../types/UserTypes';

const cookies = new Cookies();

export function loadUser(): ?UserType {
  const userJson: string = cookies.get(AUTH_COOKIE_NAME, { doNotParse: true });
  let user: UserType;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
      if (user && user.token) {
        const decode = jwtDecode(user.token);
        console.log('user.token decode:', decode);
      }
    } catch (err) {
      // invalid json, just don't authenticate
    }
  }
  return user;
}

export function deleteUser() {
  cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
}

export function saveUser(user: UserType) {
  // only save token
  const userObject = {
    token: user.token,
  };
  cookies.set(AUTH_COOKIE_NAME, JSON.stringify(userObject), { path: '/' });
}
