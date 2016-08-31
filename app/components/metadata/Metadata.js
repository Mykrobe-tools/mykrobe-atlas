import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Metadata.css';

class Metadata extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        Metadata
      </div>
    );
  }
}

export default Metadata;
