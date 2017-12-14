/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch } from 'react-router-dom';

import SignUp from '../components/auth/SignUp';
import SignUpSuccess from '../components/auth/SignUpSuccess';
import Login from '../components/auth/Login';
import Forgot from '../components/auth/Forgot';
import ForgotSuccess from '../components/auth/ForgotSuccess';
import Profile from '../components/auth/Profile';
import Reset from '../components/auth/Reset';
import ResetSuccess from '../components/auth/ResetSuccess';
import Verify from '../components/auth/Verify';
import VerifySuccess from '../components/auth/VerifySuccess';
import VerifyFailure from '../components/auth/VerifyFailure';

import { userIsNotAuthenticated } from '../routes';

class AuthPage extends React.Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route
          path={`${match.url}/login`}
          component={userIsNotAuthenticated(Login)}
        />
        <Route path={`${match.url}/signup`} component={SignUp} />
        <Route path={`${match.url}/success`} component={SignUpSuccess} />
        <Route path={`${match.url}/forgot`} component={Forgot} />
        <Route path={`${match.url}/forgotsuccess`} component={ForgotSuccess} />
        <Route path={`${match.url}/profile`} component={Profile} />
        <Route
          path={`${match.url}/reset/:resetPasswordToken`}
          component={Reset}
        />
        <Route path={`${match.url}/resetsuccess`} component={ResetSuccess} />
        <Route
          path={`${match.url}/verify/:verificationToken`}
          component={Verify}
        />
        <Route path={`${match.url}/verifysuccess`} component={VerifySuccess} />
        <Route path={`${match.url}/verifyfailure`} component={VerifyFailure} />
      </Switch>
    );
  }
}

AuthPage.propTypes = {
  match: PropTypes.object,
  children: PropTypes.node,
};

export default withRouter(AuthPage);
