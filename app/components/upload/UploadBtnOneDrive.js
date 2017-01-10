/* @flow */

import React, { Component, PropTypes } from 'react';
import loadScript from 'load-script';
import styles from './Upload.css';
import config from '../../config';

const ONEDRIVE_SDK_URL = 'https://js.live.net/v7.0/OneDrive.js';

let isLoading = false;

export default class UploadBtnOneDrive extends Component {
  render() {
    return (
      <button
        className={styles.button}
        onClick={(event) => this.onClick(event)}>
        OneDrive
      </button>
    );
  }

  componentDidMount() {
    if (!this.isOneDriveReady() && !isLoading) {
      isLoading = true;
      loadScript(ONEDRIVE_SDK_URL);
    }
  }

  isOneDriveReady() {
    return !!window.OneDrive;
  }

  onClick(e: Event) {
    e.preventDefault();
    if (!this.isOneDriveReady()) {
      return null;
    }
    window.OneDrive.open({
      clientId: config.ONEDRIVE_CLIENT_ID,
      action: 'download',
      multiSelect: false,
      openInNewWindow: true,
      success: (files) => {
        this.onFileSelect(files);
      }
    });
  }

  onFileSelect(files: Object) {
    const {onFileSelect} = this.props;
    onFileSelect(files.value[0]['@microsoft.graph.downloadUrl']);
  }
}

UploadBtnOneDrive.propTypes = {
  onFileSelect: PropTypes.func.isRequired
};
