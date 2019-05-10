/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';

import withAuth, {
  withAuthPropTypes,
} from 'makeandship-js-common/src/hoc/withAuth';

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
  ...withAuthPropTypes,
};

export default withAuth(AuthError);
