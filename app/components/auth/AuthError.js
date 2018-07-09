/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getError } from 'makeandship-js-common/src/modules/auth';

class AuthError extends React.Component<*> {
  render() {
    const { error } = this.props;
    return (
      <div>
        <h1>Authentication error</h1>
        <p>{error && error.statusText}</p>
        <Link to="/">Home</Link>
      </div>
    );
  }
}

AuthError.propTypes = {
  error: PropTypes.any,
};

const withRedux = connect(state => ({
  error: getError(state),
}));

export default withRedux(AuthError);
