/* @flow */

import { Component, PropTypes } from 'react';

class OrganisationPage extends Component {
  render() {
    const {children} = this.props;
    return (
      {...children}
    );
  }
}

OrganisationPage.propTypes = {
  children: PropTypes.element.isRequired
};

export default OrganisationPage;
