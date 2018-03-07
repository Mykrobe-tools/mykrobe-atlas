/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component<*> {
  render() {
    const { children, onSubmit } = this.props;
    return <form onSubmit={event => onSubmit(event)}>{children}</form>;
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
