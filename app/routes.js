import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import App from './containers/App';
import DragAndDropPage from './containers/DragAndDropPage';
import AnalysingPage from './containers/AnalysingPage';
import ResultsPage from './containers/ResultsPage';
import PredictorPage from './containers/PredictorPage';
import PredictorScreenA from './components/predictor/PredictorScreenA';
import PredictorScreenB from './components/predictor/PredictorScreenB';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DragAndDropPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="results" component={ResultsPage} >
      <IndexRedirect to="predictor" />
      <Route path="predictor" component={PredictorPage}>
        <IndexRedirect to="a" />
        <Route path="a" component={PredictorScreenA} />
        <Route path="b" component={PredictorScreenB} />
      </Route>
    </Route>
  </Route>
);
