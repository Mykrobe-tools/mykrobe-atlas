/* @flow */

import React, { Component, PropTypes } from 'react';
import loadScript from 'load-script';
import styles from './Upload.css';

const BOX_SDK_URL = 'https://cdn01.boxcdn.net/js/static/select.js';
const CLIENT_ID = 'gjwt1p1esw2pfwcfkswpxfmtpua0ybka';

let isLoading = false;
let boxSelect;

export default class UploadBtnBox extends Component {
  render() {
    return (
      <button
        className={styles.button}
        onClick={(event) => this.onClick(event)}>
        Box
      </button>
    );
  }

  componentDidMount() {
    if (!this.isBoxReady() && !isLoading) {
      isLoading = true;
      loadScript(BOX_SDK_URL, () => this.onApiLoad());
    }
  }

  onApiLoad() {
    const options = {
      clientId: CLIENT_ID,
      linkType: 'direct',
      multiselect: 'false'
    };
    boxSelect = new window.BoxSelect(options);
    boxSelect.success((files) => {
      this.onFileSelect(files);
    });
  }

  isBoxReady() {
    return !!window.BoxSelect && !!boxSelect;
  }

  onClick(e: Event) {
    e.preventDefault();
    if (!this.isBoxReady()) {
      return null;
    }
    boxSelect.launchPopup();
  }

  onFileSelect(files: Array<Object>) {
    const {onFileSelect} = this.props;
    onFileSelect(files[0].url);
  }
}

UploadBtnBox.propTypes = {
  onFileSelect: PropTypes.func.isRequired
};
