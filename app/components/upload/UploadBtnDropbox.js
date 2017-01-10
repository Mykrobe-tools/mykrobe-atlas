/* @flow */

import React, { Component, PropTypes } from 'react';
import loadScript from 'load-script';
import styles from './Upload.css';
import config from '../../config';

const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
const SCRIPT_ID = 'dropboxjs';

let isLoading = false;

export default class UploadBtnDropbox extends Component {
  render() {
    return (
      <button
        className={styles.button}
        onClick={(event) => this.onClick(event)}>
        Dropbox
      </button>
    );
  }

  componentDidMount() {
    if (!this.isDropboxReady() && !isLoading) {
      isLoading = true;
      loadScript(DROPBOX_SDK_URL, {
        attrs: {
          id: SCRIPT_ID,
          'data-app-key': config.DROPBOX_APP_KEY
        }
      });
    }
  }

  isDropboxReady() {
    return !!window.Dropbox;
  }

  onClick(e: Event) {
    e.preventDefault();
    if (!this.isDropboxReady()) {
      return null;
    }
    const {acceptedExtensions} = this.props;
    window.Dropbox.choose({
      success: (files) => {
        this.onFileSelect(files);
      },
      linkType: 'direct',
      multiselect: false,
      extensions: acceptedExtensions
    });
  }

  onFileSelect(files: Array<Object>) {
    const {onFileSelect} = this.props;
    onFileSelect(files[0].link);
  }
}

UploadBtnDropbox.propTypes = {
  onFileSelect: PropTypes.func.isRequired,
  acceptedExtensions: PropTypes.array.isRequired
};
