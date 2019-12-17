/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import OrganisationsContainer from './OrganisationsContainer';
import EditOrganisationContainer from './edit/EditOrganisationContainer';

const OrganisationsRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}`} exact component={OrganisationsContainer} />
    <Route
      path={`${match.url}/:organisationId`}
      component={EditOrganisationContainer}
    />
  </Switch>
);

export default OrganisationsRoutes;
