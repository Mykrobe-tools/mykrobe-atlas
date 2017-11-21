/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Sample.css';
import { Link } from 'react-router';

class Sample extends React.Component {
  render() {
    const { children, analyser, params } = this.props;
    const { id } = params;
    const path = `/sample/${id}`;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>(Name of sample)</div>
        </div>
        <div className={styles.navigation}>
          <Link
            to={`${path}/metadata`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Metadata
          </Link>
          <Link
            to={`${path}/resistance`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Resistance
          </Link>
          <Link
            to={`${path}/analysis`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Analysis
          </Link>
          <Link
            to={`${path}/summary`}
            className={styles.navigationItem}
            activeClassName={styles.navigationItemActive}
          >
            Summary
          </Link>
        </div>
        {children && React.cloneElement(children, { analyser, id })}
      </div>
    );
  }
}

Sample.propTypes = {
  children: PropTypes.element.isRequired,
  analyser: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
};

export default Sample;
