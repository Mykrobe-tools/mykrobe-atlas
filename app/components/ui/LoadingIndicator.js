/* @flow */

import React, { Component, PropTypes } from 'react';
import styles from './LoadingIndicator.css';

export default class LoadingIndicator extends Component {
  render() {
    const {isDisplayed} = this.props;
    return (
      <div className={isDisplayed ? styles.loadingIndicatorDisplayed : styles.loadingIndicator} />
    );
  }

  static defaultProps = {
    isDisplayed: false
  };
}

LoadingIndicator.propTypes = {
  isDisplayed: PropTypes.bool.isRequired
};
