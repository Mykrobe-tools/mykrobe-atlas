/* @flow */

import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import moment from 'moment';
import styles from './ExperimentsTable.css';

class ExperimentsTable extends Component {
  render() {
    const {experiments} = this.props;
    let tableContent;

    if (experiments.isFetching) {
      tableContent = (
        <tr>
          <td className={styles.tableData} colSpan="4">
            <i className="fa fa-cog fa-spin" /> Fetching results
          </td>
        </tr>
      );
    }
    else if (experiments.samples.length === 0) {
      tableContent = (
        <tr>
          <td className={styles.tableData} colSpan="4">
            No results found
          </td>
        </tr>
      );
    }
    else {
      tableContent = experiments.samples.map((experiment) =>
        <tr key={experiment._id}>
          <td className={styles.tableData}>
            {/*
              <Link to={`/sample/${experiment._id}`} className={styles.experimentLink}>
            */}
            {experiment.sample}
            {/*
            </Link>
            */}
          </td>
          <td className={styles.tableData}>{experiment.uploaded_by}</td>
          <td className={styles.tableData}>{moment().to(experiment.collected_at)}</td>
          <td className={styles.tableData}>{experiment.location.name}</td>
        </tr>
      );
    }
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeading}>Sample</th>
            <th className={styles.tableHeading}>User</th>
            <th className={styles.tableHeading}>Collected</th>
            <th className={styles.tableHeading}>Location</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    );
  }
}

ExperimentsTable.propTypes = {
  experiments: PropTypes.object.isRequired
};

export default ExperimentsTable;
