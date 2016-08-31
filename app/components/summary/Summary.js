import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Summary.css';

class Summary extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        Summary
      </div>
    );
  }
}

export default Summary;
