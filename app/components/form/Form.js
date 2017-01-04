/* @flow */

import React, { Component, PropTypes } from 'react';

class Form extends Component {

  render() {
    const {children, onSubmit} = this.props;
    return (
      <form onSubmit={(event) => onSubmit(event)}>
        {children}
      </form>
    );
  }
}

Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default Form;
