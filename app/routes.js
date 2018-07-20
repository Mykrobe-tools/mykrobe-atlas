/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import ExperimentsRoutes from './components/experiments/ExperimentsRoutes';
import HomePage from './containers/HomePage';
import App from './containers/App';
import OrganisationsRoutes from './components/organisations/OrganisationsRoutes';
import AuthRoutes from './components/auth/AuthRoutes';
import UsersRoutes from './components/users/UsersRoutes';
import NotificationsPage from './components/notifications/NotificationsPage';

import {
  withUserIsNotAuthenticatedRedirect,
  // withUserIsAuthenticatedRedirect,
} from 'makeandship-js-common/src/modules/auth/util';

// const AuthenticatedHome = withUserIsAuthenticatedRedirect(HomePage, '/');
const AuthenticatedExperimentsRoutes = withUserIsNotAuthenticatedRedirect(
  ExperimentsRoutes
);
const AuthenticatedOrganisationsRoutes = withUserIsNotAuthenticatedRedirect(
  OrganisationsRoutes
);
const AuthenticatedUsersRoutes = withUserIsNotAuthenticatedRedirect(
  UsersRoutes
);
const AuthenticatedNotificationsPage = withUserIsNotAuthenticatedRedirect(
  NotificationsPage
);

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/experiments" component={AuthenticatedExperimentsRoutes} />
      <Route path="/auth" component={AuthRoutes} />
      <Route path="/users" component={AuthenticatedUsersRoutes} />
      <Route
        path="/organisations"
        component={AuthenticatedOrganisationsRoutes}
      />
      <Route path="/notifications" component={AuthenticatedNotificationsPage} />
    </Switch>
  </App>
);
