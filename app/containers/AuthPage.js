/* @flow */

import { Component, PropTypes } from 'react';

class AuthPage extends Component {
  render() {
    const { children } = this.props;
    return { ...children };
  }
}

AuthPage.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthPage;
