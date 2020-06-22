/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import ExperimentsRoutes from './components/experiments/ExperimentsRoutes';
import UploadContainer from './components/upload/UploadContainer';
import App from './components/app/App';
import OrganisationsRoutes from './components/organisations/OrganisationsRoutes';
import UsersRoutes from './components/users/UsersRoutes';
import NotificationsPage from './components/notifications/NotificationsPage';
import NotFoundPage from './components/notFound/NotFoundPage';

import ProtectedContainer from './components/auth/ProtectedContainer';

// const AuthenticatedUploadContainer = withUserIsAuthenticatedRedirect(
//   UploadContainer,
//   '/experiments'
// );
// const AuthenticatedExperimentsRoutes = withUserIsNotAuthenticatedRedirect(
//   ExperimentsRoutes
// );
// const AuthenticatedOrganisationsRoutes = withUserIsNotAuthenticatedRedirect(
//   OrganisationsRoutes
// );
// const AuthenticatedUsersRoutes = withUserIsNotAuthenticatedRedirect(
//   UsersRoutes
// );
// const AuthenticatedNotificationsPage = withUserIsNotAuthenticatedRedirect(
//   NotificationsPage
// );

export default (
  <App>
    <Switch>
      <Route exact path="/" component={UploadContainer} />
      <ProtectedContainer>
        <Route path="/experiments" component={ExperimentsRoutes} />
        <Route path="/users" component={UsersRoutes} />
        <Route path="/organisations" component={OrganisationsRoutes} />
        <Route path="/notifications" component={NotificationsPage} />
      </ProtectedContainer>
      <Route component={NotFoundPage} />
    </Switch>
  </App>
);
