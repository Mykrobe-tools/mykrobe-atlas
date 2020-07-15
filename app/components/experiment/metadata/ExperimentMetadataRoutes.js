/* @flow */

import * as React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import urljoin from 'url-join';

import { filteredSchemaWithSubsections } from '../../../schemas/experiment';

import EditMetadataContainer from './EditMetadataContainer';

const EditPatientMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['patient']);
  return <EditMetadataContainer {...props} title="Patient" schema={schema} />;
};

const EditSampleMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['sample']);
  return <EditMetadataContainer {...props} title="Sample" schema={schema} />;
};

const EditGenotypingMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['genotyping']);
  return (
    <EditMetadataContainer {...props} title="Genotyping" schema={schema} />
  );
};

const EditPhenotypingMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['phenotyping']);
  return (
    <EditMetadataContainer {...props} title="Phenotyping" schema={schema} />
  );
};

const EditTreatmentMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['treatment']);
  return <EditMetadataContainer {...props} title="Treatment" schema={schema} />;
};

const EditOutcomeMetadata = (props) => {
  const schema = filteredSchemaWithSubsections(['outcome']);
  return <EditMetadataContainer {...props} title="Outcome" schema={schema} />;
};

const ExperimentMetadataRoutes = () => (
  <Switch>
    <Route
      exact
      path={`/experiments/:experimentId/metadata`}
      component={({ match }) => <Redirect to={urljoin(match.url, 'sample')} />}
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
      path={`/experiments/:experimentId/metadata/patient`}
      component={EditPatientMetadata}
    />
    <Route
      path={`/experiments/:experimentId/metadata/outcome`}
      component={EditOutcomeMetadata}
    />
  </Switch>
);

export default withRouter(ExperimentMetadataRoutes);
