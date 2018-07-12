/* @flow */

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import ExperimentsContainer from './ExperimentsContainer';
import ExperimentContainer from './ExperimentContainer';

const ExperimentsRoutes = () => (
  <Switch>
    <Route path={`/experiments`} exact component={ExperimentsContainer} />
    <Route
      path={`/experiments/:experimentId`}
      component={ExperimentContainer}
    />
  </Switch>
);

export default ExperimentsRoutes;
