import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './SummaryMetadata.css';

class SummaryMetadata extends Component {
  render() {
    const {analyser} = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.summaryContainer}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Sample ID</td>
                <td>45869836589536483489</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>United Kingdom</td>
              </tr>
              <tr>
                <td>Date collected</td>
                <td>11.06.16</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.summaryContainer}>
          Right
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

SummaryMetadata.propTypes = {
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(SummaryMetadata);
