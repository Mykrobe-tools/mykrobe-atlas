import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import DragAndDropPage from './containers/DragAndDropPage';
import AnalysingPage from './containers/AnalysingPage';
import PredictorPage from './containers/PredictorPage';
import PredictorScreenA from './components/predictor/PredictorScreenA';
import PredictorScreenB from './components/predictor/PredictorScreenB';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DragAndDropPage} />
    <Route path="analysing" component={AnalysingPage} />
    <Route path="predictor" component={PredictorPage}>
      <IndexRoute component={PredictorScreenA} />
      <Route path="b" component={PredictorScreenB} />
    </Route>
  </Route>
);
