/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

class AuthPage extends React.Component {
  render() {
    const { children } = this.props;
    return { ...children };
  }
}

AuthPage.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthPage;
