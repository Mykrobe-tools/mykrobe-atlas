/* @flow */

import Resumablejs from 'resumablejs';

export const typePrefix = 'upload/uploadFileResumable/';

export const RESUMABLE_UPLOAD_FILES_ADDED = `${typePrefix}RESUMABLE_UPLOAD_FILES_ADDED`;
export const RESUMABLE_UPLOAD_PROGRESS = `${typePrefix}RESUMABLE_UPLOAD_PROGRESS`;
export const RESUMABLE_UPLOAD_ERROR = `${typePrefix}RESUMABLE_UPLOAD_ERROR`;
export const RESUMABLE_UPLOAD_DONE = `${typePrefix}RESUMABLE_UPLOAD_DONE`;

class ResumableUpload {
  acceptedExtensions: Array<string>;
  resumable: Object;
  actionChannel: any;
  id: string;
  accessToken: string;

  headers = () => {
    if (this.accessToken) {
      return {
        Authorization: `Bearer ${this.accessToken}`,
      };
    } else {
      return {};
    }
  };

  constructor(actionChannel: any, acceptedExtensions: Array<string>) {
    this.actionChannel = actionChannel;
    this.acceptedExtensions = acceptedExtensions;
    this.resumable = new Resumablejs({
      maxFiles: 2,
      minFileSize: 0,
      uploadMethod: 'PUT',
      headers: this.headers,
      target: () => {
        return `${window.env.REACT_APP_API_URL}/experiments/${this.id}/file`;
      },
      testTarget: () => {
        return `${window.env.REACT_APP_API_URL}/experiments/${this.id}/upload-status`;
      },
      fileType: this.acceptedExtensions,
      query: (resumableFile, resumableObj) => {
        return {
          fileUpload: true,
          checksum: resumableFile.hashes[resumableObj.offset],
        };
      },
      maxFilesErrorCallback: (files) => {
        console.log('maxFilesErrorCallback', files);
        this.actionChannel.put({
          type: RESUMABLE_UPLOAD_ERROR,
          payload: 'Please add no more than two files per experiment',
        });
      },
      fileTypeErrorCallback: () => {
        this.actionChannel.put({
          type: RESUMABLE_UPLOAD_ERROR,
          payload: 'This filetype is unsupported',
        });
      },
    });
    this.resumable.on('error', (message, file) => {
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_ERROR,
        payload: message,
      });
    });
    this.resumable.on('filesAdded', (files) => {
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_FILES_ADDED,
        payload: files,
      });
    });
    this.resumable.on('progress', () => {
      const uploadProgress = this.resumable.progress();
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_PROGRESS,
        payload: uploadProgress,
      });
    });
    this.resumable.on('complete', (file) => {
      if (file) {
        this.actionChannel.put({ type: RESUMABLE_UPLOAD_DONE, payload: file });
      }
    });
  }

  setAccessToken = (accessToken: string) => {
    this.accessToken = accessToken;
  };

  setId(id: string) {
    this.id = id;
  }

  onDrop(files) {
    if (files) {
      this.resumable.addFiles(files);
    }
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

  startUpload() {
    this.resumable.upload();
  }
}

export default ResumableUpload;
