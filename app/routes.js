/* @flow */

import React from 'react';
import { Route, Redirect, IndexRoute, IndexRedirect } from 'react-router';
import HomePage from './containers/HomePage';
import LibraryPage from './containers/LibraryPage';
import SamplePage from './containers/SamplePage';

import Analysis from './components/analysis/Analysis';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import ResistanceAll from './components/resistance/ResistanceAll';
import ResistanceDrugs from './components/resistance/ResistanceDrugs';
import ResistanceClass from './components/resistance/ResistanceClass';
import ResistanceEvidence from './components/resistance/ResistanceEvidence';
import ResistanceSpecies from './components/resistance/ResistanceSpecies';
import Summary from './components/summary/Summary';

const App = IS_ELECTRON ? require('./containers/AppElectron') : require('./containers/App');

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="library" component={LibraryPage} />
    <Redirect from="sample" to="/" />
    <Route path="sample/:id" component={SamplePage}>
      <IndexRedirect to="metadata" />
      <Route path="metadata" component={Metadata} />
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
  </Route>
);
