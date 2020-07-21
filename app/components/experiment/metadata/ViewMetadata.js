/* @flow */

import * as React from 'react';
import _get from 'lodash.get';

import JsonSchemaDisplay, {
  renderRowBrowser,
} from 'makeandship-js-common/src/components/ui/form/JsonSchemaDisplay';
import { experimentSchema } from '../../../schemas/experiment';

import { Container } from 'reactstrap';
import Empty from '../../ui/Empty';
import Susceptibility from '../../ui/susceptibility/Susceptibility';

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
  const { keyPath, type, data, depth } = row;
  if (keyPath === 'file') {
    return null;
  }

  // hide duplicate title
  if (type === 'title' && keyPath === 'metadata') {
    return null;
  }

  // replace all phenotyping with Susceptibility component
  if (type === 'title' && keyPath === 'metadata.phenotyping') {
    const rendered = renderRowBrowser(row);
    const value = _get(data, 'metadata.phenotyping');
    if (!value) {
      return null;
    }
    return (
      <React.Fragment>
        {rendered}
        <div
          key={`${keyPath}-custom`}
          className="row form-group"
          data-depth={depth}
        >
          <label className="col-md-3 col-form-label">Profile</label>
          <div className="col-md-9">
            <Susceptibility susceptibility={value} />
          </div>
        </div>
      </React.Fragment>
    );
  }

  // hide all underlying phenotyping fields
  if (keyPath.startsWith('metadata.phenotyping.')) {
    return null;
  }

  // default
  const rendered = renderRowBrowser(row);
  return rendered;
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
