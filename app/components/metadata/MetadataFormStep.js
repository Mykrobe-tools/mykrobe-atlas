/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

class MetadataFormStep extends React.Component<*> {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

MetadataFormStep.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
};

export default MetadataFormStep;
