/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Sample.css';
import { NavLink } from 'react-router-dom';

class Sample extends React.Component {
  render() {
    const { children, analyser, match: { params } } = this.props;
    const { id } = params;
    const path = `/sample/${id}`;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>(Name of sample)</div>
        </div>
        <div className={styles.navigation}>
          <NavLink
            to={`${path}/metadata`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Metadata
          </NavLink>
          <NavLink
            to={`${path}/resistance`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Resistance
          </NavLink>
          <NavLink
            to={`${path}/analysis`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Analysis
          </NavLink>
          <NavLink
            to={`${path}/summary`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Summary
          </NavLink>
        </div>
        {children && React.cloneElement(children, { analyser, id })}
      </div>
    );
  }
}

Sample.propTypes = {
  children: PropTypes.element.isRequired,
  analyser: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Sample;
