/* @flow */

import React, { Component } from 'react';

class FormLabel extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <label
        htmlFor={this.props.htmlFor}
        key={this.props.htmlFor}>
        {this.props.children}
        {this.props.label}
      </label>
    );
  }
}

FormLabel.propTypes = {
  children: React.PropTypes.node,
  label: React.PropTypes.string.isRequired,
  htmlFor: React.PropTypes.string
}

export default FormLabel;
