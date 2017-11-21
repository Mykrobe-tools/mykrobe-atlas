/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

class OrganisationPage extends React.Component {
  render() {
    const { children } = this.props;
    return { ...children };
  }
}

OrganisationPage.propTypes = {
  children: PropTypes.element.isRequired,
};

export default OrganisationPage;
