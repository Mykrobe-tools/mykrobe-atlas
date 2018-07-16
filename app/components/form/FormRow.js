/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './FormRow.scss';

class FormRow extends React.Component<*> {
  render() {
    const { children } = this.props;
    return <div className={styles.formRow}>{children}</div>;
  }
}

FormRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormRow;
