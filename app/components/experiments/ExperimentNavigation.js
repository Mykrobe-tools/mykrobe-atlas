/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import Header from '../header/Header';
import styles from './ExperimentNavigation.scss';

class ExperimentNavigation extends React.Component<*> {
  render() {
    const { match } = this.props;
    return (
      <Row className={styles.container}>
        <Col>
          <div className={styles.contentWrap}>
            <Header title={'(Name of sample)'} />
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
          </div>
        </Col>
      </Row>
    );
  }
}

ExperimentNavigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ExperimentNavigation;
