/* @flow */

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import EditMetadata from './EditMetadata';

const ExperimentMetadataRoutes = () => (
  <Switch>
    <Route
      exact
      path={`/experiments/:experimentId/metadata`}
      component={({ match }) => <Redirect to={`${match.url}/patient`} />}
    />
    <Route
      path={`/experiments/:experimentId/metadata/patient`}
      render={props => (
        <EditMetadata {...props} title="Patient" subsections={['patient']} />
      )}
    />
    <Route
      path={`/experiments/:experimentId/metadata/sample`}
      render={props => (
        <EditMetadata {...props} title="Sample" subsections={['sample']} />
      )}
    />
    <Route
      path={`/experiments/:experimentId/metadata/genotyping`}
      render={props => (
        <EditMetadata
          {...props}
          title="Genotyping"
          subsections={['genotyping']}
        />
      )}
    />
    <Route
      path={`/experiments/:experimentId/metadata/phenotyping`}
      render={props => (
        <EditMetadata
          {...props}
          title="Phenotyping"
          subsections={['phenotyping']}
        />
      )}
    />
  </Switch>
);

export default ExperimentMetadataRoutes;
