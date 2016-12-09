/* @flow */

import React, { Component } from 'react';

import styles from './FormRow.css';

class FormRow extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <div className={styles.formRow}>
        {this.props.children}
      </div>
    );
  }
}

FormRow.propTypes = {
  children: React.PropTypes.node.isRequired
}

export default FormRow;
