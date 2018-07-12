/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Organisations from './Organisations';
import EditOrganisation from './EditOrganisation';

const OrganisationsRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}`} exact component={Organisations} />
    <Route path={`${match.url}/:organisationId`} component={EditOrganisation} />
  </Switch>
);

export default OrganisationsRoutes;
