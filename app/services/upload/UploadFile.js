/* @flow */

import Resumablejs from 'resumablejs';
import EventEmitter from 'events';
import { API_URL } from '../../constants/APIConstants';

// const API_URL = 'http://localhost:3001';

class UploadFile extends EventEmitter {
  acceptedExtensions: Array<string>;
  resumable: Object;
  props: Object;
  id: string;
  accessToken: string;

  setAccessToken = (accessToken: string) => {
    this.accessToken = accessToken;
  };

  // TODO: refactor to use redux-saga, load token from state rather than via Component

  headers = () => {
    if (this.accessToken) {
      return {
        Authorization: `Bearer ${this.accessToken}`,
      };
    } else {
      return {};
    }
  };

  constructor(acceptedExtensions: Array<string>) {
    super();
    this.acceptedExtensions = acceptedExtensions;
    this.resumable = new Resumablejs({
      maxFiles: 1,
      minFileSize: 0,
      uploadMethod: 'PUT',
      headers: this.headers,
      target: () => {
        return `${API_URL}/experiments/${this.id}/file`;
      },
      testTarget: () => {
        return `${API_URL}/experiments/${this.id}/upload-status`;
      },
      fileType: this.acceptedExtensions,
      query: (resumableFile, resumableObj) => {
        return {
          fileUpload: true,
          checksum: resumableFile.hashes[resumableObj.offset],
        };
      },
      maxFilesErrorCallback: () => {
        this.onUploadError('Please upload one file at a time');
      },
      fileTypeErrorCallback: () => {
        this.onUploadError('This filetype is unsupported');
      },
    });
    this.resumable.on('fileError', (file, message) => {
      this.onUploadError(`There was an error with the upload: ${message}`);
    });
    this.resumable.on('fileAdded', file => {
      this.emit('fileAdded', file);
    });
    this.resumable.on('fileProgress', () => {
      this.onUploadProgress();
    });
    this.resumable.on('fileSuccess', file => {
      this.onFileUploadComplete(file);
    });
  }

  setId(id: string) {
    this.id = id;
  }

  assignDrop(dropzoneEl: Element) {
    this.resumable.assignDrop(dropzoneEl);
  }

  assignBrowse(buttonEl: Element) {
    this.resumable.assignBrowse(buttonEl);
  }

  unAssignDrop(dropzoneEl: Element) {
    this.resumable.unAssignDrop(dropzoneEl);
  }

  getAcceptedExtensions() {
    return this.acceptedExtensions;
  }

  isSupported() {
    return this.resumable.support;
  }

  cancel() {
    this.resumable.cancel();
  }

  onUploadProgress() {
    const uploadProgress = Math.floor(this.resumable.progress() * 100);
    this.emit('progress', uploadProgress);
  }

  onUploadError(error: string) {
    this.emit('error', error);
  }

  onFileUploadComplete(file: Object) {
    this.emit('done', file.file);
  }

  startUpload() {
    this.resumable.upload();
  }
}

export default UploadFile;
