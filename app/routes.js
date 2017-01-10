/* @flow */

import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import UploadPage from './containers/UploadPage';
import AnalysingPage from './containers/AnalysingPage';

import ResultsPage from './containers/ResultsPage';

import Map from './components/map/Map';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import PhylogenyWithKey from './components/phylogeny/PhylogenyWithKey';
import ResistanceAll from './components/resistance/ResistanceAll';
import ResistanceDrugs from './components/resistance/ResistanceDrugs';
import ResistanceClass from './components/resistance/ResistanceClass';
import ResistanceEvidence from './components/resistance/ResistanceEvidence';
import ResistanceSpecies from './components/resistance/ResistanceSpecies';
import Share from './components/share/Share';
import Summary from './components/summary/Summary';

const App = IS_ELECTRON ? require('./containers/AppElectron') : require('./containers/App');

export default (
  <Route path="/" component={App}>
    <IndexRoute component={UploadPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="results" component={ResultsPage}>
      <IndexRedirect to="resistance" />
      <Route path="metadata" component={Metadata} />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceAll} />
        <Route path="drugs" component={ResistanceDrugs} />
        <Route path="class" component={ResistanceClass} />
        <Route path="evidence" component={ResistanceEvidence} />
        <Route path="species" component={ResistanceSpecies} />
      </Route>
      <Route path="phylogeny" component={PhylogenyWithKey} />
      <Route path="map" component={Map} />
      <Route path="summary" component={Summary} />
      <Route path="share" component={Share} />
    </Route>
  </Route>
);
