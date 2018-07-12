/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import AnalysisContainer from '../analysis/AnalysisContainer';
import MetadataContainer from '../metadata/MetadataContainer';
import Resistance from '../resistance/resistance/Resistance';
import SummaryContainer from '../summary/SummaryContainer';

const ExperimentRoutes = ({ match }: { match: Match }) => (
  <Switch>
    <Route
      exact
      path={match.url}
      component={() => <Redirect to={`${match.url}/metadata`} />}
    />
    <Route path={`${match.url}/metadata`} component={MetadataContainer} />
    <Route path={`${match.url}/resistance`} component={Resistance} />
    <Route path={`${match.url}/analysis`} component={AnalysisContainer} />
    <Route path={`${match.url}/summary`} component={SummaryContainer} />
  </Switch>
);

export default ExperimentRoutes;
