/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Sample.css';
import { NavLink } from 'react-router-dom';

class Sample extends React.Component {
  render() {
    const { children, analyser, match } = this.props;
    const id = match.params.id;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>(Name of sample)</div>
        </div>
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
