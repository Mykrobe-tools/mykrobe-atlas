/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';
import _ from 'lodash';

import HeaderContainer from '../header/HeaderContainer';
import styles from './ExperimentNavigation.scss';

class ExperimentNavigation extends React.Component<*> {
  render() {
    const { match, experiment } = this.props;
    const isolateId = _.get(experiment, 'metadata.sample.isolateId') || 'No isolate Id';
    return (
      <div className={styles.container}>
        <HeaderContainer title={isolateId} />
        <Container fluid>
          <div className={styles.navigation}>
            <NavLink
              to={`${match.url}/metadata`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Metadata
            </NavLink>
            <NavLink
              to={`${match.url}/resistance`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Resistance
            </NavLink>
            <NavLink
              to={`${match.url}/analysis`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Analysis
            </NavLink>
            <NavLink
              to={`${match.url}/summary`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Summary
            </NavLink>
          </div>
        </Container>
      </div>
    );
  }
}

ExperimentNavigation.propTypes = {
  match: PropTypes.object.isRequired,
  experiment: PropTypes.object,
};

export default ExperimentNavigation;
