/* @flow */

import EventEmitter from 'events';
import loadScript from 'load-script';
import config from '../../config';

const ONEDRIVE_SDK_URL = 'https://js.live.net/v7.0/OneDrive.js';

let isLoading = false;

class UploadOneDrive extends EventEmitter {

  constructor() {
    super();
    if (!this.isOneDriveReady() && !isLoading) {
      isLoading = true;
      loadScript(ONEDRIVE_SDK_URL);
    }
  }

  isOneDriveReady() {
    return !!window.OneDrive;
  }

  trigger() {
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
    this.emit('fileSelected', {
      name: files.value[0].name,
      url: files.value[0]['@microsoft.graph.downloadUrl']
    });
  }
}

export default UploadOneDrive;
