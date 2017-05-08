/* @flow */

import EventEmitter from 'events';
import loadScript from 'load-script';
import config from '../../config';

const DROPBOX_SDK_URL = 'https://www.dropbox.com/static/api/2/dropins.js';
const SCRIPT_ID = 'dropboxjs';

let isLoading = false;

class UploadDropbox extends EventEmitter {
  acceptedExtensions: Array<string>;

  constructor(acceptedExtensions: Array<string>) {
    super();
    this.acceptedExtensions = acceptedExtensions;
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

  trigger() {
    if (!this.isDropboxReady()) {
      return null;
    }
    window.Dropbox.choose({
      success: (files) => {
        this.onFileSelect(files);
      },
      linkType: 'direct',
      multiselect: false,
      extensions: this.acceptedExtensions.map(ext => {
        // dropbox requires a fullstop at the start of extension
        return `.${ext}`;
      })
    });
  }

  onFileSelect(files: Array<Object>) {
    this.emit('fileSelected', {
      name: files[0].name,
      path: files[0].link,
      provider: 'dropbox'
    });
  }
}

export default UploadDropbox;
