/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';

import styles from './ExperimentMetadataNavigation.scss';

class ExperimentMetadataNavigation extends React.Component<*> {
  render() {
    const { match } = this.props;
    return (
      <div className={styles.container}>
        <Container fluid>
          <div className={styles.navigation}>
            <NavLink
              to={`${match.url}/patient`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Patient
            </NavLink>
            <NavLink
              to={`${match.url}/sample`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Sample
            </NavLink>
            <NavLink
              to={`${match.url}/genotyping`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Genotyping
            </NavLink>
            <NavLink
              to={`${match.url}/phenotyping`}
              className={styles.navigationItem}
              activeClassName={styles.navigationItemActive}
            >
              Phenotyping
            </NavLink>
          </div>
        </Container>
      </div>
    );
  }
}

ExperimentMetadataNavigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ExperimentMetadataNavigation;
