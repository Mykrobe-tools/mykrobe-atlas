import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Map.css';

class Map extends Component {
  render() {
    const {children} = this.props;
    return (
      <div className={styles.container}>
        Map
      </div>
    );
  }
}

export default Map;
