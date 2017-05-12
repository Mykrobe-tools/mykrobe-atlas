/* @flow */

import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends Component {

  resetScroll() {
    const element = ReactDom.findDOMNode(this);
    if (element instanceof HTMLElement) {
      element.scrollTop = 0;
    }
  }

  render() {
    const {analyser, id} = this.props;
    return (
      <div className={styles.container}>
        {analyser.analysing &&
          <div className={styles.uploadingMessage}>
            <h2 className={styles.uploadingMessageTitle}>
              Your sample is uploading
            </h2>
            <p className={styles.uploadingMessageText}>
              To help Atlas provide more accurate results, please provide any available metadata
            </p>
          </div>
        }
        <div className={styles.formContainer}>
          <MetadataForm id={id} resetScroll={() => this.resetScroll()} />
        </div>
      </div>
    );
  }
}

Metadata.propTypes = {
  analyser: PropTypes.object,
  id: PropTypes.string
};

export default Metadata;
