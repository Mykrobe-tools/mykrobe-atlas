/* @flow */

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import styles from './ExperimentsTable.css';
import Loading from '../ui/Loading';

class ExperimentsTable extends Component {
  render() {
    const { experiments } = this.props;
    let tableContent;

    if (experiments.isFetching) {
      return <Loading />;
    } else if (experiments.samples.length === 0) {
      tableContent = (
        <tr>
          <td className={styles.tableData} colSpan="5">
            No results found
          </td>
        </tr>
      );
    } else {
      tableContent = experiments.samples.map(experiment => (
        <tr key={experiment.id}>
          <td className={styles.tableData}>
            <Link
              to={`/sample/${experiment.id}`}
              className={styles.experimentLink}
            >
              {experiment.id}
            </Link>
          </td>
          <td className={styles.tableData}>
            {experiment.owner && (
              <span>
                {experiment.owner.firstname} {experiment.owner.lastname}
              </span>
            )}
          </td>
          <td className={styles.tableData}>
            {experiment.organisation && (
              <span>{experiment.organisation.name}</span>
            )}
          </td>
          <td className={styles.tableData}>
            {moment().to(experiment.collected)}
          </td>
          <td className={styles.tableData}>
            {experiment.location && <span>{experiment.location.name}</span>}
          </td>
        </tr>
      ));
    }
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeading}>Sample</th>
            <th className={styles.tableHeading}>User</th>
            <th className={styles.tableHeading}>Organisation</th>
            <th className={styles.tableHeading}>Collected</th>
            <th className={styles.tableHeading}>Location</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
}

ExperimentsTable.propTypes = {
  experiments: PropTypes.object.isRequired,
};

export default ExperimentsTable;
