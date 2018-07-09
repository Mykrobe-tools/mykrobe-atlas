/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import Profile from './profile/Profile';

const UsersRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}/profile`} component={Profile} />
  </Switch>
);

//    <Route path={`${match.url}`} exact component={Users} />
//    <Route path={`${match.url}/:userId`} component={EditUser} />

export default UsersRoutes;
