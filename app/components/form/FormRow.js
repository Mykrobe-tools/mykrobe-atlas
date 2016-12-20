/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './FormRow.css';

class FormRow extends Component {

  render() {
    const {children} = this.props;
    return (
      <div className={styles.formRow}>
        {children}
      </div>
    );
  }
}

FormRow.propTypes = {
  children: PropTypes.node.isRequired
};

export default FormRow;
