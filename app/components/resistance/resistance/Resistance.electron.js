/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Resistance.css';
import MykrobeConfig from '../../../services/MykrobeConfig';
import * as TargetConstants from '../../../constants/TargetConstants';
import Logo from '../../logo/Logo';
import * as AnalyserActions from '../../../actions/AnalyserActions';

class Resistance extends React.Component {
  render() {
    const { children, analyseFileNew, analyseFileSave } = this.props;
    const path = '/results/resistance';
    const config = new MykrobeConfig();

    return (
      <div className={styles.container} data-tid="component-resistance">
        <div className={styles.header}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.navigation}>
            <Link
              to={`${path}/all`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              All
            </Link>
            {TargetConstants.SPECIES_TB === config.species ? (
              <Link
                to={`${path}/drugs`}
                className={styles.navigationItem}
                activeClassName={styles.navigationItemActive}
              >
                Drugs
              </Link>
            ) : (
              <Link
                to={`${path}/class`}
                className={styles.navigationItem}
                activeClassName={styles.navigationItemActive}
              >
                Class
              </Link>
            )}
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
          <div className={styles.actions}>
            <a
              onClick={() => {
                analyseFileSave();
              }}
              className={styles.navigationItem}
            >
              Save
            </a>
            <a
              onClick={() => {
                analyseFileNew();
              }}
              className={styles.navigationItem}
            >
              New
            </a>
          </div>
        </div>
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      analyseFileSave: AnalyserActions.analyseFileSave,
      analyseFileNew: AnalyserActions.analyseFileNew,
    },
    dispatch
  );
}

Resistance.propTypes = {
  analyseFileSave: PropTypes.func.isRequired,
  analyseFileNew: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default connect(mapStateToProps, mapDispatchToProps)(Resistance);
