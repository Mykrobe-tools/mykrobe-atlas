/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Fieldset.css';

class Fieldset extends React.Component<*> {
  render() {
    const { children, legend } = this.props;
    return (
      <fieldset className={styles.fieldset}>
        {legend ? (
          <div className={styles.legend}>{legend}</div>
        ) : (
          <div className={styles.ruleTop} />
        )}
        {children}
      </fieldset>
    );
  }
}

Fieldset.propTypes = {
  children: PropTypes.node.isRequired,
  legend: PropTypes.string,
};

export default Fieldset;
