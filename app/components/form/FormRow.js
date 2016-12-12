/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './FormRow.css';

class FormRow extends Component {

  constructor(props: Object) {
    super(props);
  }

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
}

export default FormRow;
