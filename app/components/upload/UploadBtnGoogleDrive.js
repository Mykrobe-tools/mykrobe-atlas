/* @flow */

import React, { Component, PropTypes } from 'react';
import loadScript from 'load-script';
import styles from './Upload.css';
import config from '../../config';

const SCOPE = ['https://www.googleapis.com/auth/drive.readonly'];
const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';

let isLoading = false;

export default class UploadBtnGoogleDrive extends Component {
  render() {
    return (
      <button
        className={styles.button}
        onClick={(event) => this.onClick(event)}>
        Google Drive
      </button>
    );
  }

  componentDidMount() {
    if (this.isGoogleReady()) {
      this.onApiLoad();
    }
    else if (!isLoading) {
      isLoading = true;
      loadScript(GOOGLE_SDK_URL, this.onApiLoad);
    }
  }

  isGoogleReady() {
    return !!window.gapi;
  }

  isGoogleAuthReady() {
    return !!window.gapi.auth;
  }

  isGooglePickerReady() {
    return !!window.google.picker;
  }

  onApiLoad() {
    window.gapi.load('auth');
    window.gapi.load('picker');
    window.gapi.load('client', () => {
      window.gapi.client.load('drive', 'v3');
    });
  }

  authoriseApp(callback: Function) {
    window.gapi.auth.authorize({
      client_id: config.GOOGLE_DRIVE_CLIENT_ID,
      scope: SCOPE,
      immediate: false
    },
    callback);
  }

  createPicker(oauthToken: string) {
    const picker = new window.google.picker.PickerBuilder();
    picker.addView(window.google.picker.ViewId.DOCS);
    picker.setOAuthToken(oauthToken);
    picker.setDeveloperKey(config.GOOGLE_DRIVE_DEVELOPER_KEY);
    picker.setCallback((data) => {
      this.onFileSelect(data);
    });
    picker.enableFeature(window.google.picker.Feature.NAV_HIDDEN);
    picker.build().setVisible(true);
  }

  onClick() {
    if (!this.isGoogleReady() || !this.isGoogleAuthReady() || !this.isGooglePickerReady()) {
      return null;
    }

    const token = window.gapi.auth.getToken();
    const oauthToken = token && token.access_token;

    if (oauthToken) {
      this.createPicker(oauthToken);
    }
    else {
      this.authoriseApp(({access_token}) => this.createPicker(access_token));
    }
  }

  onFileSelect(data: Object) {
    const {onFileSelect} = this.props;
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      const file = data[window.google.picker.Response.DOCUMENTS][0];
      const id = file[window.google.picker.Document.ID];
      const request = window.gapi.client.drive.files.get({
        'fileId': id
      });
      request.execute((response) => {
        onFileSelect({
          name: response.name,
          url: `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
          headers: {
            'Authorization': 'Bearer ' + window.gapi.auth.getToken().access_token
          }
        });
      });
    }
  }
}

UploadBtnGoogleDrive.propTypes = {
  onFileSelect: PropTypes.func.isRequired
};
