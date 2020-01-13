/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import { NEW_ENTITY_KEY } from 'makeandship-js-common/src/modules/generic';

import OrganisationsContainer from './OrganisationsContainer';
import OrganisationProfileContainer from '../organisation/profile/OrganisationProfileContainer';
import EditOrganisationContainer from '../organisation/edit/EditOrganisationContainer';

const OrganisationsRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}`} exact component={OrganisationsContainer} />
    <Route
      path={`${match.url}/:organisationId/edit`}
      component={EditOrganisationContainer}
    />
    <Redirect
      from={`${match.url}/${NEW_ENTITY_KEY}`}
      to={`${match.url}/${NEW_ENTITY_KEY}/edit`}
    />
    <Route
      path={`${match.url}/:organisationId`}
      component={OrganisationProfileContainer}
    />
  </Switch>
);

export default OrganisationsRoutes;
