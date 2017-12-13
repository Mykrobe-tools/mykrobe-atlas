/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './Resistance.css';
import Uploading from '../../ui/Uploading';
import MykrobeConfig from '../../../services/MykrobeConfig';
import * as TargetConstants from '../../../constants/TargetConstants';

class Resistance extends React.Component {
  componen;

  render() {
    const { analyser, id, children } = this.props;
    const path = `/sample/${id}/resistance`;
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
                <NavLink
                  to={`${path}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </NavLink>
                <NavLink
                  to={`${path}/drugs`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Drugs
                </NavLink>
                <NavLink
                  to={`${path}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </NavLink>
                <NavLink
                  to={`${path}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </NavLink>
              </div>
            ) : (
              <div className={styles.navigation}>
                <NavLink
                  to={`${path}/all`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  All
                </NavLink>
                <NavLink
                  to={`${path}/class`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Class
                </NavLink>
                <NavLink
                  to={`${path}/evidence`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Evidence
                </NavLink>
                <NavLink
                  to={`${path}/species`}
                  className={styles.navigationItem}
                  activeClassName={styles.navigationItemActive}
                >
                  Species
                </NavLink>
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
