import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Results.css';
import { Route, IndexRoute, Link } from 'react-router';

class Results extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigation}>
            <Link to="results/metadata" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Metadata</Link>
            <Link to="results/resistance" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Resistance</Link>
            <Link to="results/map" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Map</Link>
            <Link to="results/summary" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Summary</Link>
            <Link to="results/share" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Share</Link>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

export default Results;
