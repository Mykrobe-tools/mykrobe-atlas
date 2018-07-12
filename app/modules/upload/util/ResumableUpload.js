/* @flow */

import Resumablejs from 'resumablejs';
import { API_URL } from '../../../constants/APIConstants';

export const typePrefix = 'upload/uploadFileResumable/';

export const RESUMABLE_UPLOAD_FILE_ADDED = `${typePrefix}RESUMABLE_UPLOAD_FILE_ADDED`;
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
        this.actionChannel.put({
          type: RESUMABLE_UPLOAD_ERROR,
          payload: 'Please upload one file at a time',
        });
      },
      fileTypeErrorCallback: () => {
        this.actionChannel.put({
          type: RESUMABLE_UPLOAD_ERROR,
          payload: 'This filetype is unsupported',
        });
      },
    });
    this.resumable.on('fileError', (file, message) => {
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_ERROR,
        payload: message,
      });
    });
    this.resumable.on('fileAdded', file => {
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_FILE_ADDED,
        payload: file,
      });
    });
    this.resumable.on('fileProgress', () => {
      const uploadProgress = Math.floor(this.resumable.progress() * 100);
      this.actionChannel.put({
        type: RESUMABLE_UPLOAD_PROGRESS,
        payload: uploadProgress,
      });
    });
    this.resumable.on('fileSuccess', file => {
      this.actionChannel.put({ type: RESUMABLE_UPLOAD_DONE, payload: file });
    });
  }

  setAccessToken = (accessToken: string) => {
    this.accessToken = accessToken;
  };

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

  startUpload() {
    this.resumable.upload();
  }
}

export default ResumableUpload;
