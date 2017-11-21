/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './FormLabel.css';

class FormLabel extends React.Component {
  render() {
    const { children, htmlFor, label } = this.props;
    return (
      <label className={styles.label} htmlFor={htmlFor} key={htmlFor}>
        {children}
        {label}
      </label>
    );
  }
}

FormLabel.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default FormLabel;
