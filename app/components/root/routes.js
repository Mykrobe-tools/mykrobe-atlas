/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import ExperimentsRoutes from '../experiments/ExperimentsRoutes';
import UploadContainer from '../upload/UploadContainer';
import OrganisationsRoutes from '../organisations/OrganisationsRoutes';
import UsersRoutes from '../users/UsersRoutes';
import NotificationsPage from '../notifications/NotificationsPage';
import NotFoundPage from '../notFound/NotFoundPage';

import ProtectedContainer from '../auth/ProtectedContainer';

export default (
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
);
