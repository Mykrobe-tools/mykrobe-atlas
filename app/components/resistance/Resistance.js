/* @flow */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistance.css';

import MykrobeConfig from '../../api/MykrobeConfig';
import * as TargetConstants from '../../constants/TargetConstants';

class Resistance extends Component {

  render() {
    const {analyser, children} = this.props;
    if (!analyser.transformed) {
      return null;
    }
    const config = new MykrobeConfig();
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          {TargetConstants.SPECIES_TB === config.species ? (
            <div className={styles.navigation}>
              <Link to="/sample/resistance/all" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>All</Link>
              <Link to="/sample/resistance/drugs" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Drugs</Link>
              <Link to="/sample/resistance/species" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Species</Link>
              <Link to="/sample/resistance/evidence" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Evidence</Link>
            </div>
          ) : (
            <div className={styles.navigation}>
              <Link to="/sample/resistance/all" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>All</Link>
              <Link to="/sample/resistance/class" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Class</Link>
              <Link to="/sample/resistance/evidence" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Evidence</Link>
              <Link to="/sample/resistance/species" className={styles.navigationItem} activeClassName={styles.navigationItemActive}>Species</Link>
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Resistance.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default connect(mapStateToProps)(Resistance);
