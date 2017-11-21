/* @flow */

import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import HomePage from './containers/HomePage';

import App from './containers/App';
import About from './components/about/About';

import Analysis from './components/analysis/Analysis';
import Resistance from './components/resistance/resistance/Resistance';
import ResistanceAll from './components/resistance/all/ResistanceAll';
import ResistanceDrugsContainer from './components/resistance/drugs/ResistanceDrugsContainer';
import ResistanceClass from './components/resistance/class/ResistanceClass';
import ResistanceEvidenceContainer from './components/resistance/evidence/ResistanceEvidenceContainer';
import ResistanceSpeciesContainer from './components/resistance/species/ResistanceSpeciesContainer';
import Summary from './components/summary/Summary';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="results">
      <IndexRedirect to="resistance" />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAll} />
        <Route path="drugs" component={ResistanceDrugsContainer} />
        <Route path="class" component={ResistanceClass} />
        <Route path="evidence" component={ResistanceEvidenceContainer} />
        <Route path="species" component={ResistanceSpeciesContainer} />
      </Route>
      <Route path="analysis" component={Analysis} />
      <Route path="summary" component={Summary} />
    </Route>
    <Route path="about" component={About} />
  </Route>
);
