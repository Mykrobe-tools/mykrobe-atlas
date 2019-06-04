/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import ExperimentsList from './ExperimentsList';

import styles from './ExperimentsTooltip.scss';

class ExperimentsTooltip extends React.PureComponent<*> {
  onRef = ref => {
    this._ref = ref;
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleClickOutside = event => {
    const { onClickOutside } = this.props;
    if (!onClickOutside) {
      return;
    }
    if (this._ref && !this._ref.contains(event.target)) {
      // FIXME: this is a crude way of allowing clicking on a navigation link outside
      // this tooltip - possibly on a different tooltip - to propagate
      setTimeout(onClickOutside, 500);
    }
  };

  render() {
    const { x, y, experiments } = this.props;
    if (!experiments || !experiments.length) {
      return null;
    }
    return (
      <div
        className={styles.tooltip}
        style={{ left: x, top: y }}
        ref={this.onRef}
      >
        <div className={styles.tooltipWrapper}>
          <div className={styles.tooltipContainer}>
            <div className={styles.tooltipContent}>
              <ExperimentsList experiments={experiments} />
            </div>
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
  experiments: PropTypes.array,
  x: PropTypes.any,
  y: PropTypes.any,
  onClickOutside: PropTypes.func,
};

export default ExperimentsTooltip;
