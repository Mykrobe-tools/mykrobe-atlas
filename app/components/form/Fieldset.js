/* @flow */

import React, { Component, PropTypes } from 'react';

import styles from './Fieldset.css';

class Fieldset extends Component {

  render() {
    const {children, legend} = this.props;
    return (
      <fieldset className={styles.fieldset}>
        {legend ? (
          <div className={styles.legend}>
            {legend}
          </div>
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
  legend: PropTypes.string
};

export default Fieldset;
