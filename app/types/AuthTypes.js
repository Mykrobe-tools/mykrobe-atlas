/* @flow */

import type { UserType } from './UserTypes';

export type AuthType = {
  isFetching: boolean,
  isAuthenticated: boolean,
  user?: UserType
}

export type AuthResetPasswordType = {
  resetPasswordToken: string,
  password: string
};

export type AuthVerificationType = {
  verificationToken: string
};
