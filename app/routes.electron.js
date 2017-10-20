/* @flow */

import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import HomePage from './containers/HomePage';

import App from './containers/App';
import About from './components/about/About';

import Analysis from './components/analysis/Analysis';
import Resistance from './components/resistance/Resistance';
import ResistanceAll from './components/resistance/ResistanceAll';
import ResistanceDrugs from './components/resistance/ResistanceDrugs';
import ResistanceClass from './components/resistance/ResistanceClass';
import ResistanceEvidence from './components/resistance/ResistanceEvidence';
import ResistanceSpecies from './components/resistance/ResistanceSpecies';
import Summary from './components/summary/Summary';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="results">
      <IndexRedirect to="resistance" />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAll} />
        <Route path="drugs" component={ResistanceDrugs} />
        <Route path="class" component={ResistanceClass} />
        <Route path="evidence" component={ResistanceEvidence} />
        <Route path="species" component={ResistanceSpecies} />
      </Route>
      <Route path="analysis" component={Analysis} />
      <Route path="summary" component={Summary} />
    </Route>
    <Route path="about" component={About} />
  </Route>
);
