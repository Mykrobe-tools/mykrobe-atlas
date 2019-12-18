/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';

import HeaderContainer from '../ui/header/HeaderContainer';
import styles from './ExperimentNavigation.scss';

class ExperimentNavigation extends React.Component<*> {
  render() {
    const { match, experimentIsolateId } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={experimentIsolateId} />
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
  match: PropTypes.object,
  experiment: PropTypes.object,
};

export default ExperimentNavigation;
