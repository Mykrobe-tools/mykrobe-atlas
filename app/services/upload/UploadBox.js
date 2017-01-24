/* @flow */

import EventEmitter from 'events';
import loadScript from 'load-script';
import config from '../../config';

const BOX_SDK_URL = 'https://cdn01.boxcdn.net/js/static/select.js';

let isLoading = false;
let boxSelect;

class UploadBox extends EventEmitter {

  constructor() {
    super();
    if (!this.isBoxReady() && !isLoading) {
      isLoading = true;
      loadScript(BOX_SDK_URL, () => this.onApiLoad());
    }
  }

  onApiLoad() {
    const options = {
      clientId: config.BOX_CLIENT_ID,
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

  trigger() {
    if (!this.isBoxReady()) {
      return null;
    }
    boxSelect.launchPopup();
  }

  onFileSelect(files: Array<Object>) {
    this.emit('fileSelected', {
      name: files[0].name,
      url: files[0].url
    });
  }
}

export default UploadBox;
