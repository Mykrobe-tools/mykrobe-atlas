/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import EditOrganisationContainer from './edit/EditOrganisationContainer';

const OrganisationRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route
      path={`${match.url}/:organisationId`}
      component={EditOrganisationContainer}
    />
  </Switch>
);

export default OrganisationRoutes;
