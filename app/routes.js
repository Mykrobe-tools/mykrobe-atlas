import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './containers/App';
import DragAndDropPage from './containers/DragAndDropPage';
import AnalysingPage from './containers/AnalysingPage';

import ResultsPage from './containers/ResultsPage';

import Map from './components/map/Map';
import Metadata from './components/metadata/Metadata';
import Resistance from './components/resistance/Resistance';
import ResistanceScreenA from './components/resistance/ResistanceScreenA';
import ResistanceScreenB from './components/resistance/ResistanceScreenB';
import Share from './components/share/Share';
import Summary from './components/summary/Summary';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DragAndDropPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="results" component={ResultsPage} >
      <IndexRedirect to="metadata" />
      <Route path="metadata" component={Metadata} />
      <Route path="resistance" component={Resistance}>
        <IndexRedirect to="a" />
        <Route path="a" component={ResistanceScreenA} />
        <Route path="b" component={ResistanceScreenB} />
      </Route>
      <Route path="map" component={Map} />
      <Route path="summary" component={Summary} />
      <Route path="share" component={Share} />
    </Route>
  </Route>
);
