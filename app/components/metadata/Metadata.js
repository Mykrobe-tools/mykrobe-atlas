/* @flow */

import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends Component {

  resetScroll = () => {
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
            <div className={styles.uploadingMessageTitle}>
              Your sample is uploading
            </div>
          </div>
        }
        <div className={styles.formContainer}>
          <MetadataForm id={id} resetScroll={this.resetScroll} />
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
