/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import { withRouter, Link } from 'react-router-dom';

const ExperimentsList = ({ experiments }) =>
  experiments.map(({ id, distance, metadata }) => {
    const isolateId = _get(metadata, 'sample.isolateId') || 'No isolate Id';
    const countryIsolate = _get(metadata, 'sample.countryIsolate') || '–';
    // const cityIsolate = _get(metadata, 'sample.cityIsolate') || '–';
    return (
      <div key={id}>
        <Link to={`/experiments/${id}/analysis`}>
          <i className="fa fa-chevron-circle-right" />{' '}
          {distance ? (
            <React.Fragment>
              {isolateId} · {distance} SNPs · {countryIsolate}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {isolateId} · {countryIsolate}
            </React.Fragment>
          )}
        </Link>
      </div>
    );
  });

ExperimentsList.propTypes = {
  experiments: PropTypes.array,
};

export default withRouter(ExperimentsList);
