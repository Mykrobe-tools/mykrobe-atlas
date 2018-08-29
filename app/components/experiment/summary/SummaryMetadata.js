/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import styles from './SummaryMetadata.scss';

class SummaryMetadata extends React.Component<*> {
  render() {
    const {
      experimentTransformed,
      experiment: { metadata },
    } = this.props;
    const labId = _.get(metadata, 'sample.labId') || '–';
    let collectionDate = _.get(metadata, 'sample.collectionDate');
    collectionDate = collectionDate
      ? moment(collectionDate).format('LLL')
      : '–';
    const countryIsolate = _.get(metadata, 'sample.countryIsolate') || '–';
    const cityIsolate = _.get(metadata, 'sample.cityIsolate') || '–';
    return (
      <div className={styles.container}>
        <div className={styles.summaryContainer}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Lab Id</td>
                <td>{labId}</td>
              </tr>
              <tr>
                <td>Country Isolate</td>
                <td>{countryIsolate}</td>
              </tr>
              <tr>
                <td>City Isolate</td>
                <td>{cityIsolate}</td>
              </tr>
              <tr>
                <td>Collection Date</td>
                <td>{collectionDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.summaryContainer}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Species</td>
                <td>
                  <em>{experimentTransformed.speciesString || '–'}</em>
                </td>
              </tr>
              <tr>
                <td>TB Lineage</td>
                <td>{experimentTransformed.lineageString || '–'}</td>
              </tr>
              <tr>
                <td>Closest relative</td>
                <td>
                  [Placeholder]{' '}
                  <a href="#">
                    <i className="fa fa-chevron-circle-right" /> :sampleid:
                  </a>{' '}
                  - X SNPs apart
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

SummaryMetadata.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
};

export default SummaryMetadata;
