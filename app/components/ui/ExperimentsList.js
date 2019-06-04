/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import { withRouter, Link } from 'react-router-dom';

import styles from './ExperimentsList.scss';

const ExperimentsList = ({ experiments }) =>
  experiments.map(({ id, distance, metadata }) => {
    const isolateId = _get(metadata, 'sample.isolateId') || 'No isolate Id';
    const countryIsolate = _get(metadata, 'sample.countryIsolate');
    // const cityIsolate = _get(metadata, 'sample.cityIsolate') || '–';
    const elements = [isolateId];
    distance && elements.push(`${distance} SNPs`);
    countryIsolate && elements.push(countryIsolate);
    return (
      <div className={styles.experiment} key={id}>
        <Link to={`/experiments/${id}/analysis`}>
          <i className="fa fa-chevron-circle-right" /> {elements.join(` · `)}
        </Link>
      </div>
    );
  });

ExperimentsList.propTypes = {
  experiments: PropTypes.array,
};

export default withRouter(ExperimentsList);
