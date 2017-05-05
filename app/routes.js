/* @flow */

import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import HomePage from './containers/HomePage';
import LibraryPage from './containers/LibraryPage';
import SamplePage from './containers/SamplePage';

import store from './store/store';

import Analysis from './components/analysis/Analysis';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import ResistanceAll from './components/resistance/ResistanceAll';
import ResistanceDrugs from './components/resistance/ResistanceDrugs';
import ResistanceClass from './components/resistance/ResistanceClass';
import ResistanceEvidence from './components/resistance/ResistanceEvidence';
import ResistanceSpecies from './components/resistance/ResistanceSpecies';
import Summary from './components/summary/Summary';

import AuthPage from './containers/AuthPage';
import SignUp from './components/auth/SignUp';
import SignUpSuccess from './components/auth/SignUpSuccess';
import Login from './components/auth/Login';
import Forgot from './components/auth/Forgot';
import ForgotSuccess from './components/auth/ForgotSuccess';
import Profile from './components/auth/Profile';
import Reset from './components/auth/Reset';
import ResetSuccess from './components/auth/ResetSuccess';
import Verify from './components/auth/Verify';

const requireAuth = (nextState, replace) => {
  const state = store.getState();
  const { auth } = state;
  const { isLoading, isAuthenticated } = auth;
  if (!isLoading && !isAuthenticated) {
    console.log('Authentication required, redirecting');
    return replace('/auth/login');
  }
};

const App = IS_ELECTRON ? require('./containers/AppElectron') : require('./containers/App');

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="library" onEnter={requireAuth} component={LibraryPage} />
    <Redirect from="sample" to="/" />
    <Route path="sample/:id" onEnter={requireAuth} component={SamplePage}>
      <IndexRedirect to="metadata" />
      <Route path="metadata" component={Metadata} />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAll} />
        <Route path="drugs" component={ResistanceDrugs} />
        <Route path="class" component={ResistanceClass} />
        <Route path="evidence" component={ResistanceEvidence} />
        <Route path="species" component={ResistanceSpecies} />
      </Route>
      <Route path="analysis" component={Analysis} />
      <Route path="summary" component={Summary} />
    </Route>
    <Route path="auth" component={AuthPage}>
      <IndexRedirect to="login" />
      <Route path="login" component={Login} />
      <Route path="signup" component={SignUp} />
      <Route path="success" component={SignUpSuccess} />
      <Route path="forgot" component={Forgot} />
      <Route path="forgotsuccess" component={ForgotSuccess} />
      <Route path="profile" onEnter={requireAuth} component={Profile} />
      <Route path="reset/:resetPasswordToken" component={Reset} />
      <Route path="resetsuccess" component={ResetSuccess} />
      <Route path="verify/:verificationToken" component={Verify} />
    </Route>
  </Route>
);
