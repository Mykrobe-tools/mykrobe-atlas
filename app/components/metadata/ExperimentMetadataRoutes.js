/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import EditMetadata from './EditMetadata';

const EditPatientMetadata = props => (
  <EditMetadata {...props} title="Patient" subsections={['patient']} />
);

const EditSampleMetadata = props => (
  <EditMetadata {...props} title="Sample" subsections={['sample']} />
);

const EditGenotypingMetadata = props => (
  <EditMetadata {...props} title="Genotyping" subsections={['genotyping']} />
);

const EditPhenotypingMetadata = props => (
  <EditMetadata {...props} title="Phenotyping" subsections={['phenotyping']} />
);

const EditTreatmentMetadata = props => (
  <EditMetadata {...props} title="Treatment" subsections={['treatment']} />
);

const EditOutcomeMetadata = props => (
  <EditMetadata {...props} title="Outcome" subsections={['outcome']} />
);

const ExperimentMetadataRoutes = () => (
  <Switch>
    <Route
      exact
      path={`/experiments/:experimentId/metadata`}
      component={({ match }) => <Redirect to={`${match.url}/patient`} />}
    />
    <Route
      path={`/experiments/:experimentId/metadata/patient`}
      component={EditPatientMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/sample`}
      component={EditSampleMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/genotyping`}
      component={EditGenotypingMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/phenotyping`}
      component={EditPhenotypingMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/treatment`}
      component={EditTreatmentMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/outcome`}
      component={EditOutcomeMetadata}
    />
  </Switch>
);

export default ExperimentMetadataRoutes;
