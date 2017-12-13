/* @flow */

import * as React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router-dom';

import HomePage from './containers/HomePage';

import App from './containers/App';
import About from './components/about/About';

import Analysis from './components/analysis/Analysis';
import Resistance from './components/resistance/resistance/Resistance';
import ResistanceAllContainer from './components/resistance/all/ResistanceAllContainer';
import ResistanceDrugsContainer from './components/resistance/drugs/ResistanceDrugsContainer';
import ResistanceClassContainer from './components/resistance/class/ResistanceClassContainer';
import ResistanceEvidenceContainer from './components/resistance/evidence/ResistanceEvidenceContainer';
import ResistanceSpeciesContainer from './components/resistance/species/ResistanceSpeciesContainer';
import SummaryContainer from './components/summary/SummaryContainer';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="results">
      <IndexRedirect to="resistance" />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAllContainer} />
        <Route path="drugs" component={ResistanceDrugsContainer} />
        <Route path="class" component={ResistanceClassContainer} />
        <Route path="evidence" component={ResistanceEvidenceContainer} />
        <Route path="species" component={ResistanceSpeciesContainer} />
      </Route>
      <Route path="analysis" component={Analysis} />
      <Route path="summary" component={SummaryContainer} />
    </Route>
    <Route path="about" component={About} />
  </Route>
);
