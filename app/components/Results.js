import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Results.css';

class Results extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        {children}
      </div>
    );
  }
}

export default Results;
