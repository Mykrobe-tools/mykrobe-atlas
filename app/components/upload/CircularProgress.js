/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './CircularProgress.css';

class CircularProgress extends Component {
  static defaultProps: {
    radius: number,
    lightPercentage: number,
    darkPercentage: number,
    strokeWidth: number
  };

  render() {
    const lightPercentage = parseInt(this.props.lightPercentage);
    const darkPercentage = parseInt(this.props.darkPercentage);
    const radius = this.props.radius - this.props.strokeWidth / 2;
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const viewBox = `0 0 ${width} ${height}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffsetLight = dashArray - dashArray * lightPercentage / 100;
    const dashOffsetDark = dashArray - dashArray * darkPercentage / 100;
    return (
      <svg
        className={styles.container}
        width={this.props.radius * 2}
        height={this.props.radius * 2}
        viewBox={viewBox}>
        <circle
          className={styles.background}
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
        />
        <circle
          className={styles.foregroundLight}
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffsetLight
          }}
        />
        <circle
          className={styles.foregroundDark}
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffsetDark
          }}
        />
      </svg>
    );
  }
}

CircularProgress.propTypes = {
  radius: PropTypes.number,
  lightPercentage: PropTypes.number,
  darkPercentage: PropTypes.number,
  strokeWidth: PropTypes.number
};

CircularProgress.defaultProps = {
  radius: 240,
  lightPercentage: 0,
  darkPercentage: 0,
  strokeWidth: 36
};

export default CircularProgress;
