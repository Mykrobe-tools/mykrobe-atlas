import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './containers/App';
import DragAndDropPage from './containers/DragAndDropPage';
import AnalysingPage from './containers/AnalysingPage';

import ResultsPage from './containers/ResultsPage';

import Map from './components/map/Map';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import ResistanceScreenAll from './components/resistance/all/ResistanceScreenAll';
import ResistanceScreenClass from './components/resistance/ResistanceScreenClass';
import ResistanceScreenVirulence from './components/resistance/ResistanceScreenVirulence';
import ResistanceScreenEvidence from './components/resistance/ResistanceScreenEvidence';
import ResistanceScreenSpecies from './components/resistance/ResistanceScreenSpecies';
import Share from './components/share/Share';
import Summary from './components/summary/Summary';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DragAndDropPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="results" component={ResultsPage} >
      <IndexRedirect to="resistance" />
      <Route path="metadata" component={Metadata} />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="all" />
        <Route path="all" component={ResistanceScreenAll} />
        <Route path="class" component={ResistanceScreenClass} />
        <Route path="virulence" component={ResistanceScreenVirulence} />
        <Route path="evidence" component={ResistanceScreenEvidence} />
        <Route path="species" component={ResistanceScreenSpecies} />
      </Route>
      <Route path="map" component={Map} />
      <Route path="summary" component={Summary} />
      <Route path="share" component={Share} />
    </Route>
  </Route>
);
