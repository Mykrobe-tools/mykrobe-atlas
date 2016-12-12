/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './FormLabel.css';

class FormLabel extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    const {children, htmlFor, label} = this.props;
    return (
      <label
        className={styles.label}
        htmlFor={htmlFor}
        key={htmlFor}>
        {children}
        {label}
      </label>
    );
  }
}

FormLabel.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
  label: PropTypes.string.isRequired
}

export default FormLabel;
