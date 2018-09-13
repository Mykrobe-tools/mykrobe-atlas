import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './CircularProgress.scss';

class CircularProgress extends React.Component<*> {
  render() {
    const { strokeWidth, wellWhite } = this.props;
    const percentage = parseInt(this.props.percentage);
    const radius = 50 - strokeWidth / 2;
    const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

    const diameter = Math.PI * 2 * radius;
    const progressStyle = {
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${(diameter * (100 - percentage)) / 100}px`,
    };
    return (
      <div className={styles.container}>
        <svg className={styles.svgContainer} viewBox="0 0 100 100">
          <path
            className={wellWhite ? styles.wellWhite : styles.well}
            d={pathDescription}
            strokeWidth={strokeWidth}
          />
          <path
            className={wellWhite ? styles.fillWellWhite : styles.fill}
            d={pathDescription}
            strokeWidth={strokeWidth}
            fillOpacity={0}
            style={progressStyle}
          />
        </svg>
      </div>
    );
  }
  static defaultProps = {
    percentage: 50,
    strokeWidth: 10,
    wellWhite: false,
  };
}

CircularProgress.propTypes = {
  percentage: PropTypes.number,
  strokeWidth: PropTypes.number,
  wellWhite: PropTypes.bool,
};

export default CircularProgress;
