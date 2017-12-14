/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import HomePage from './containers/HomePage';

import App from './containers/App';
import About from './components/about/About';

import AnalysisContainer from './components/analysis/AnalysisContainer';
import Resistance from './components/resistance/resistance/Resistance';
import SummaryContainer from './components/summary/SummaryContainer';

export default (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route
        exact
        path="/results"
        component={() => <Redirect to="/results/resistance" />}
      />
      <Route path="/results/resistance" component={Resistance} />
      <Route path="/analysis" component={AnalysisContainer} />
      <Route path="/summary" component={SummaryContainer} />
      <Route path="/about" component={About} />
    </Switch>
  </App>
);
