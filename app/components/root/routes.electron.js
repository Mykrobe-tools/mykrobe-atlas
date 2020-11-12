/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import UploadContainer from '../upload/UploadContainer';
import About from '../about/About'; // eslint-disable-line
import Resistance from '../experiment/resistance/resistance/Resistance';

export default (
  <Switch>
    <Route exact path="/" component={UploadContainer} />
    <Route
      exact
      path="/results"
      component={() => <Redirect to="/results/resistance" />}
    />
    <Route path="/results/resistance" component={Resistance} />
    <Route path="/about" component={About} />
  </Switch>
);
