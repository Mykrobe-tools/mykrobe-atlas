/* @flow */

import * as React from 'react';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import ExperimentMetadataNavigationContainer from './ExperimentMetadataNavigationContainer';
import ExperimentMetadataRoutes from './ExperimentMetadataRoutes';

import withExperiment, {
  withExperimentPropTypes,
} from '../../../hoc/withExperiment';
import JsonSchemaDisplay, {
  renderRowBrowser,
} from 'makeandship-js-common/src/components/ui/form/JsonSchemaDisplay';
import { experimentSchema } from '../../../schemas/experiment';

import styles from './ExperimentMetadataContainer.module.scss';
import { Container } from 'reactstrap';
import Empty from '../../ui/Empty';
import Footer from '../../ui/footer/Footer';

const hideKeyPaths = ['file', 'metadata'];

const renderEmpty = () => {
  return (
    <Empty
      title={'No metadata'}
      subtitle={'This sample has no populated metadata fields'}
    />
  );
};

const ExperimentMetadataContainer = ({
  experimentIsolateId,
  title,
  experimentOwnerIsCurrentUser,
  experimentMetadata,
}: React.ElementProps<*>): React.Element<*> => {
  const data = { metadata: experimentMetadata };
  const renderRow = React.useCallback((row) => {
    const { keyPath, type } = row;
    if (keyPath === 'file') {
      return null;
    }
    if (type === 'title' && keyPath === 'metadata') {
      return null;
    }
    return renderRowBrowser(row);
  });

  return (
    <div className={styles.container}>
      <AppDocumentTitle title={[experimentIsolateId, 'Metadata', title]} />
      {experimentOwnerIsCurrentUser ? (
        <React.Fragment>
          <ExperimentMetadataNavigationContainer />
          <ExperimentMetadataRoutes />
        </React.Fragment>
      ) : (
        <Container fluid className={`${styles.container} py-3`}>
          <JsonSchemaDisplay
            schema={experimentSchema}
            data={data}
            renderRow={renderRow}
            hideEmpty
            hideKeyPaths={hideKeyPaths}
            renderEmpty={renderEmpty}
          />
        </Container>
      )}
      <Footer />
    </div>
  );
};

ExperimentMetadataContainer.propTypes = {
  ...withExperimentPropTypes,
};

export default withExperiment(ExperimentMetadataContainer);
