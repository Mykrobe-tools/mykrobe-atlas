/* @flow */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Sample.css';
import { Link } from 'react-router';

class Sample extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Name of sample
          </h1>
          <div className={styles.navigation}>
            <Link to="/sample/metadata" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Metadata</Link>
            <Link to="/sample/resistance" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Resistance</Link>
            <Link to="/sample/analysis" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Analysis</Link>
            <Link to="/sample/summary" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Summary</Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

Sample.propTypes = {
  children: PropTypes.element.isRequired
};

export default connect(mapStateToProps)(Sample);
