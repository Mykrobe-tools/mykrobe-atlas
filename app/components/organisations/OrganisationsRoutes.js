/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import OrganisationsContainer from './OrganisationsContainer';
import OrganisationRoutes from '../organisation/OrganisationRoutes';

const OrganisationsRoutes = props => (
  <Switch>
    <Route
      path={`${props.match.url}`}
      exact
      component={OrganisationsContainer}
    />
    <OrganisationRoutes {...props} />
  </Switch>
);

export default OrganisationsRoutes;
