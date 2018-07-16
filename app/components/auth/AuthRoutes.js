/* @flow */

import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Login from './Login';
import Signup from './SignUp';
import SignupSuccess from './SignUpSuccess';
import Forgot from './Forgot';
import ForgotSuccess from './ForgotSuccess';
import AuthError from './AuthError';

import { withUserIsAuthenticatedRedirect } from 'makeandship-js-common/src/modules/auth/util';

const AuthenticatedLogin = withUserIsAuthenticatedRedirect(Login, '/');

const AuthRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}/login`} component={AuthenticatedLogin} />
    <Route path={`${match.url}/signup`} component={Signup} />
    <Route path={`${match.url}/signupsuccess`} component={SignupSuccess} />
    <Route path={`${match.url}/forgot`} component={Forgot} />
    <Route path={`${match.url}/forgotsuccess`} component={ForgotSuccess} />
    <Route path={`${match.url}/error`} component={AuthError} />
    <Redirect from={`${match.url}`} exact to={`${match.url}/login`} />
  </Switch>
);

export default AuthRoutes;
