import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './containers/App';
import DragAndDropPage from './containers/DragAndDropPage';
import AnalysingPage from './containers/AnalysingPage';

import ResultsPage from './containers/ResultsPage';

import Map from './components/map/Map';
import Metadata from './components/metadata/Metadata';
import Resistence from './components/resistence/Resistence';
import ResistenceScreenA from './components/resistence/ResistenceScreenA';
import ResistenceScreenB from './components/resistence/ResistenceScreenB';
import Share from './components/share/Share';
import Summary from './components/summary/Summary';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DragAndDropPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="results" component={ResultsPage} >
      <IndexRedirect to="resistence" />
      <Route path="map" component={Map} />
      <Route path="metadata" component={Metadata} />
      <Route path="resistence" component={Resistence}>
        <IndexRedirect to="a" />
        <Route path="a" component={ResistenceScreenA} />
        <Route path="b" component={ResistenceScreenB} />
      </Route>
      <Route path="share" component={Share} />
      <Route path="summary" component={Summary} />
    </Route>
  </Route>
);
