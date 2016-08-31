import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Results.css';
import { Route, IndexRoute, Link } from 'react-router';

class Results extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        <ul>
          <li><Link to="results/map" activeClassName="active">Map</Link></li>
          <li><Link to="results/metadata" activeClassName="active">Metadata</Link></li>
          <li><Link to="results/resistence" activeClassName="active">Resistence</Link></li>
          <li><Link to="results/share" activeClassName="active">Share</Link></li>
          <li><Link to="results/summary" activeClassName="active">Summary</Link></li>
        </ul>
        {children}
      </div>
    );
  }
}

export default Results;
