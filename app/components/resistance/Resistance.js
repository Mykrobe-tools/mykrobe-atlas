/* @flow */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistance.css';
import Uploading from '../ui/Uploading';
import MykrobeConfig from '../../services/MykrobeConfig';
import * as TargetConstants from '../../constants/TargetConstants';

class Resistance extends Component {
  componen;

  render() {
    const { analyser, id, children } = this.props;
    const path = IS_ELECTRON
      ? '/results/resistance'
      : `/sample/${id}/resistance`;
    let content;
    const config = new MykrobeConfig();

    if (analyser.analysing) {
      content = <Uploading sectionName="Resistance" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.header}>
            {TargetConstants.SPECIES_TB === config.species ? (
              <div className={styles.navigation}>
                <Link
                  to={`${path}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </Link>
                <Link
                  to={`${path}/drugs`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Drugs
                </Link>
                <Link
                  to={`${path}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </Link>
                <Link
                  to={`${path}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </Link>
              </div>
            ) : (
              <div className={styles.navigation}>
                <Link
                  to={`${path}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </Link>
                <Link
                  to={`${path}/class`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Class
                </Link>
                <Link
                  to={`${path}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </Link>
                <Link
                  to={`${path}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </Link>
              </div>
            )}
          </div>
          {children}
        </div>
      );
    }

    return <div className={styles.container}>{content}</div>;
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    analyser: state.analyser,
  };
}

Resistance.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default connect(mapStateToProps)(Resistance);
