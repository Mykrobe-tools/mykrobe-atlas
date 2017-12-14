/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';

import LibraryPage from './containers/LibraryPage';
import SamplePage from './containers/SamplePage';
import HomePage from './containers/HomePage';
import App from './containers/App';
import AuthPage from './containers/AuthPage';
import OrganisationPage from './containers/OrganisationPage';

export const userIsAuthenticated = connectedRouterRedirect({
  // The url to redirect user to if they fail
  redirectPath: '/auth/login',
  // If selector is true, wrapper will not redirect
  authenticatedSelector: state => state.auth.isAuthenticated,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsAuthenticated',
});

const locationHelper = locationHelperBuilder({});

export const userIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  authenticatedSelector: state => !state.auth.isAuthenticated,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated',
});

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/library" component={userIsAuthenticated(LibraryPage)} />
      <Route path="/sample/:id" component={userIsAuthenticated(SamplePage)} />
      <Route path="/auth" component={AuthPage} />
      <Route
        path="/organisation"
        component={userIsAuthenticated(OrganisationPage)}
      />
    </Switch>
  </App>
);
