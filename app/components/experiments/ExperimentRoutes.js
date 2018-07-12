/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import AnalysisContainer from '../analysis/AnalysisContainer';
import MetadataContainer from '../metadata/MetadataContainer';
import Resistance from '../resistance/resistance/Resistance';
import SummaryContainer from '../summary/SummaryContainer';

const ExperimentRoutes = () => (
  <Switch>
    <Route
      exact
      path={`/experiments/:experimentId`}
      component={({ match }) => <Redirect to={`${match.url}/metadata`} />}
    />
    <Route
      path={`/experiments/:experimentId/metadata`}
      component={MetadataContainer}
    />
    <Route
      path={`/experiments/:experimentId/resistance`}
      component={Resistance}
    />
    <Route
      path={`/experiments/:experimentId/analysis`}
      component={AnalysisContainer}
    />
    <Route
      path={`/experiments/:experimentId/summary`}
      component={SummaryContainer}
    />
  </Switch>
);

export default ExperimentRoutes;
