/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import ExperimentsContainer from './ExperimentsContainer';
import ExperimentContainer from './ExperimentContainer';

const ExperimentsRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route path={`${match.url}`} exact component={ExperimentsContainer} />
    <Route
      path={`${match.url}/:experimentId`}
      component={ExperimentContainer}
    />
  </Switch>
);

export default ExperimentsRoutes;
