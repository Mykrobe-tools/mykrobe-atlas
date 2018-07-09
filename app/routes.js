/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LibraryContainer from './components/library/LibraryContainer';
import SamplePage from './containers/SamplePage';
import HomePage from './containers/HomePage';
import App from './containers/App';
import OrganisationPage from './containers/OrganisationPage';
import AuthRoutes from './components/auth/AuthRoutes';
import UsersRoutes from './components/users/UsersRoutes';

import {
  withUserIsNotAuthenticatedRedirect,
  // withUserIsAuthenticatedRedirect,
} from 'makeandship-js-common/src/modules/auth/util';

// const AuthenticatedHome = withUserIsAuthenticatedRedirect(HomePage, '/');
const AuthenticatedLibraryContainer = withUserIsNotAuthenticatedRedirect(
  LibraryContainer
);
const AuthenticatedSamplePage = withUserIsNotAuthenticatedRedirect(SamplePage);
const AuthenticatedOrganisationPage = withUserIsNotAuthenticatedRedirect(
  OrganisationPage
);
const AuthenticatedUsersRoutes = withUserIsNotAuthenticatedRedirect(
  UsersRoutes
);

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/library" component={AuthenticatedLibraryContainer} />
      <Route path="/auth" component={AuthRoutes} />
      <Route path="/users" component={AuthenticatedUsersRoutes} />
      <Route path="/sample/:id" component={AuthenticatedSamplePage} />
      <Route path="/organisation" component={AuthenticatedOrganisationPage} />
    </Switch>
  </App>
);
