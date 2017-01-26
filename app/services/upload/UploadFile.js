/* @flow */

import Resumablejs from 'resumablejs';
import SparkMD5 from 'spark-md5';
import EventEmitter from 'events';
import { BASE_URL } from '../../constants/APIConstants';

class UploadFile extends EventEmitter {
  acceptedExtensions: Array<string>;
  resumable: Object;
  props: Object;

  constructor(acceptedExtensions: Array<string>) {
    super();
    this.acceptedExtensions = acceptedExtensions;
    this.resumable = new Resumablejs({
      target: `${BASE_URL}/api/experiments/upload`,
      maxFiles: 1,
      minFileSize: 0,
      fileType: this.acceptedExtensions,
      query: (resumableFile, resumableObj) => {
        return {
          'checksum': resumableFile.hashes[resumableObj.offset]
        };
      },
      maxFilesErrorCallback: () => {
        this.onUploadError('Please upload one file at a time');
      },
      fileTypeErrorCallback: (file, errorCount) => {
        this.onUploadError('This filetype is unsupported');
      }
    });
    this.resumable.on('fileError', (file, message) => {
      this.onUploadError(`There was an error with the upload: ${message}`);
    });
    this.resumable.on('fileAdded', (file) => {
      this.emit('prepare', file.fileName);
      this.computeChecksums(file);
    });
    this.resumable.on('fileProgress', (file) => {
      this.onUploadProgress();
    });
    this.resumable.on('fileSuccess', (file) => {
      this.onFileUploadComplete(file);
    });
  }

  bindUploader(dropzoneEl: Element, buttonEl: Element) {
    this.resumable.assignDrop(dropzoneEl);
    this.resumable.assignBrowse(buttonEl);
  }

  unbindUploader(dropzoneEl: Element) {
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

  // Calculate md5 checksums for each chunk
  // Adapted from: https://github.com/23/resumable.js/issues/135#issuecomment-31123690
  computeChecksums(resumableFile: Object, offset: number = 0, fileReader: ?FileReader = null) {
    const round = resumableFile.resumableObj.getOpt('forceChunkSize') ? Math.ceil : Math.floor;
    const chunkSize = resumableFile.getOpt('chunkSize');
    const numChunks = Math.max(round(resumableFile.file.size / chunkSize), 1);
    const forceChunkSize = resumableFile.getOpt('forceChunkSize');
    const func = (resumableFile.file.slice ? 'slice' : (resumableFile.file.mozSlice ? 'mozSlice' : (resumableFile.file.webkitSlice ? 'webkitSlice' : 'slice')));
    let startByte;
    let endByte;
    let bytes;

    resumableFile.hashes = resumableFile.hashes || [];
    fileReader = fileReader || new FileReader();

    startByte = offset * chunkSize;
    endByte = Math.min(resumableFile.file.size, (offset + 1) * chunkSize);

    if (resumableFile.file.size - endByte < chunkSize && !forceChunkSize) {
      endByte = resumableFile.file.size;
    }
    bytes = resumableFile.file[func](startByte, endByte);

    fileReader.onloadend = (e) => {
      var spark = SparkMD5.ArrayBuffer.hash(e.target.result);
      resumableFile.hashes.push(spark);
      if (numChunks > offset + 1) {
        this.emit('progress', Math.floor((offset / numChunks) * 100));
        this.computeChecksums(resumableFile, offset + 1, fileReader);
      }
      else {
        this.emit('upload', resumableFile.fileName);
        this.resumable.upload();
      }
    };
    fileReader.readAsArrayBuffer(bytes);
  }
}

export default UploadFile;
