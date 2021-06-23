/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import ExperimentsList from './ExperimentsList';

import styles from './ExperimentsTooltip.module.scss';

const ExperimentsTooltip = ({
  x = 0,
  y = 0,
  experiment,
  experiments = [],
}: React.ElementProps<*>) => {
  const style = React.useMemo(() => {
    return { left: x, top: y };
  }, [x, y]);
  if (!experiments.length) {
    return null;
  }
  return (
    <div className={styles.tooltip} style={style}>
      <div className={styles.tooltipWrapper}>
        <div className={styles.tooltipContainer}>
          <div className={styles.tooltipContent}>
            <ExperimentsList
              experiment={experiment}
              experiments={experiments}
              expandable
              minExpandable={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ExperimentsTooltip.propTypes = {
  experiments: PropTypes.array,
  x: PropTypes.any,
  y: PropTypes.any,
  onClickOutside: PropTypes.func,
};

export default ExperimentsTooltip;
