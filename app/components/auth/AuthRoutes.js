/* @flow */

import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Login from './Login';
import SignUp from './Signup';
import SignUpSuccess from './SignupSuccess';
import Verify from './Verify';
import VerifySuccess from './VerifySuccess';
import Forgot from './Forgot';
import ForgotSuccess from './ForgotSuccess';
import Reset from './Reset';
import ResetSuccess from './ResetSuccess';
import AuthError from './AuthError';

import { withUserIsAuthenticatedRedirect } from 'makeandship-js-common/src/modules/auth/util';

const AuthenticatedLogin = withUserIsAuthenticatedRedirect(Login, '/');

const AuthRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}/login`} component={AuthenticatedLogin} />
    <Route path={`${match.url}/signup`} component={Signup} />
    <Route path={`${match.url}/signupsuccess`} component={SignupSuccess} />
    <Route path={`${match.url}/verify/:verificationToken`} component={Verify} />
    <Route path={`${match.url}/verifysuccess`} component={VerifySuccess} />
    <Route path={`${match.url}/forgot`} component={Forgot} />
    <Route path={`${match.url}/forgotsuccess`} component={ForgotSuccess} />
    <Route path={`${match.url}/reset/:resetPasswordToken`} component={Reset} />
    <Route path={`${match.url}/resetsuccess`} component={ResetSuccess} />
    <Route path={`${match.url}/error`} component={AuthError} />
    <Redirect from={`${match.url}`} exact to={`${match.url}/login`} />
  </Switch>
);

export default AuthRoutes;
