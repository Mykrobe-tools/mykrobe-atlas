/* @flow */

import * as React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import urljoin from 'url-join';

import EditMetadataContainer from './EditMetadataContainer';

const EditPatientMetadata = props => (
  <EditMetadataContainer {...props} title="Patient" subsections={['patient']} />
);

const EditSampleMetadata = props => (
  <EditMetadataContainer {...props} title="Sample" subsections={['sample']} />
);

const EditGenotypingMetadata = props => (
  <EditMetadataContainer
    {...props}
    title="Genotyping"
    subsections={['genotyping']}
  />
);

const EditPhenotypingMetadata = props => (
  <EditMetadataContainer
    {...props}
    title="Phenotyping"
    subsections={['phenotyping']}
  />
);

const EditTreatmentMetadata = props => (
  <EditMetadataContainer
    {...props}
    title="Treatment"
    subsections={['treatment']}
  />
);

const EditOutcomeMetadata = props => (
  <EditMetadataContainer {...props} title="Outcome" subsections={['outcome']} />
);

const ExperimentMetadataRoutes = () => (
  <Switch>
    <Route
      exact
      path={`/experiments/:experimentId/metadata`}
      component={({ match }) => <Redirect to={urljoin(match.url, 'patient')} />}
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

export default withRouter(ExperimentMetadataRoutes);
