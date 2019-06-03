/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash.get';
import { withRouter, Link } from 'react-router-dom';

import styles from './ExperimentsTooltip.scss';

class ExperimentsTooltip extends React.PureComponent<*> {
  render() {
    const { x, y, experiments } = this.props;
    if (!experiments || !experiments.length) {
      return null;
    }
    // const isolateId = _get(node, 'metadata.sample.isolateId') || '–';
    // const countryIsolate = _get(node, 'metadata.sample.countryIsolate') || '–';
    // const cityIsolate = _get(node, 'metadata.sample.cityIsolate') || '–';
    // const collected = _get(node, 'collected');
    // const date = collected ? moment(collected).format('LLL') : '–';
    return (
      <div className={styles.tooltip} style={{ left: x, top: y }}>
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            {experiments.map(({ id, distance, metadata }) => {
              const isolateId =
                _get(metadata, 'sample.isolateId') || 'No isolate Id';
              const countryIsolate =
                _get(metadata, 'sample.countryIsolate') || '–';
              const cityIsolate = _get(metadata, 'sample.cityIsolate') || '–';
              return (
                <div key={id}>
                  <Link to={`/experiments/${id}/analysis`}>
                    <i className="fa fa-chevron-circle-right" />{' '}
                    {distance ? (
                      <React.Fragment>
                        {isolateId} – {distance} SNPs · {cityIsolate} ·{' '}
                        {countryIsolate}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {isolateId} · {cityIsolate} · {countryIsolate}
                      </React.Fragment>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  static defaultProps = {
    x: 0,
    y: 0,
  };
}

ExperimentsTooltip.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

export default withRouter(ExperimentsTooltip);
