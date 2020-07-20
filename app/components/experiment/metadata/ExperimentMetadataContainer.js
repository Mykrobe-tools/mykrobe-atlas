/* @flow */

import * as React from 'react';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import ExperimentMetadataNavigationContainer from './ExperimentMetadataNavigationContainer';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import withExperiment, {
  withExperimentPropTypes,
} from '../../../hoc/withExperiment';

import styles from './ExperimentMetadataContainer.module.scss';
import Footer from '../../ui/footer/Footer';
import ViewMetadata from './ViewMetadata';

const ExperimentMetadataContainer = ({
  experimentIsolateId,
  title,
  experimentOwnerIsCurrentUser,
  experimentMetadata,
}: React.ElementProps<*>): React.Element<*> => {
  return (
    <div className={styles.container}>
      <AppDocumentTitle title={[experimentIsolateId, 'Metadata', title]} />
      {experimentOwnerIsCurrentUser ? (
        <React.Fragment>
          <ExperimentMetadataNavigationContainer />
          <ExperimentMetadataRoutes />
        </React.Fragment>
      ) : (
        <ViewMetadata experimentMetadata={experimentMetadata} />
      )}
      <Footer />
    </div>
  );
};

ExperimentMetadataContainer.propTypes = {
  ...withExperimentPropTypes,
};

export default withExperiment(ExperimentMetadataContainer);
