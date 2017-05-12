/* @flow */

import React, { Component, PropTypes } from 'react';

class MetadataFormStep extends Component {

  render() {
    const {children} = this.props;
    return <div>{children}</div>;
  }
}

MetadataFormStep.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired
};

export default MetadataFormStep;
