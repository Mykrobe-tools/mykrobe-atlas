/* @flow */

import * as React from 'react';

import JsonSchemaDisplay, {
  renderRowBrowser,
} from 'makeandship-js-common/src/components/ui/form/JsonSchemaDisplay';
import { experimentSchema } from '../../../schemas/experiment';

import { Container } from 'reactstrap';
import Empty from '../../ui/Empty';

const hideKeyPaths = ['file', 'metadata'];

const renderEmpty = () => {
  return (
    <Empty
      title={'No metadata'}
      subtitle={'This sample has no populated metadata fields'}
    />
  );
};

const renderRow = (row) => {
  const { keyPath, type } = row;
  if (keyPath === 'file') {
    return null;
  }
  if (type === 'title' && keyPath === 'metadata') {
    return null;
  }
  return renderRowBrowser(row);
};

const ViewMetadata = ({
  experimentMetadata,
}: React.ElementProps<*>): React.Element<*> => {
  const data = { metadata: experimentMetadata };
  return (
    <Container fluid className={`d-flex flex-column flex-grow-1 py-3`}>
      <JsonSchemaDisplay
        schema={experimentSchema}
        data={data}
        renderRow={renderRow}
        hideEmpty
        hideKeyPaths={hideKeyPaths}
        renderEmpty={renderEmpty}
      />
    </Container>
  );
};

export default ViewMetadata;
