/* @flow */

import SparkMD5 from 'spark-md5';
import type { ResumableFile } from 'resumablejs';

export const typePrefix = 'upload/uploadFileComputeChecksums/';

export const COMPUTE_CHECKSUMS_PROGRESS = `${typePrefix}COMPUTE_CHECKSUMS_PROGRESS`;
export const COMPUTE_CHECKSUMS_COMPLETE = `${typePrefix}COMPUTE_CHECKSUMS_COMPLETE`;

class ComputeChecksums {
  actionChannel: any;
  isCancelled: boolean;

  constructor(actionChannel: any) {
    this.actionChannel = actionChannel;
    this.isCancelled = false;
  }

  computeChecksums(
    resumableFile: ResumableFile,
    offset: number = 0,
    fileReader: ?FileReader = null
  ) {
    if (this.isCancelled) {
      if (offset === 0 && !fileReader) {
        // we are starting again
        this.isCancelled = false;
      } else {
        return;
      }
    }
    const round = resumableFile.resumableObj.getOpt('forceChunkSize')
      ? Math.ceil
      : Math.floor;
    const chunkSize = resumableFile.getOpt('chunkSize');
    const numChunks = Math.max(round(resumableFile.file.size / chunkSize), 1);
    const forceChunkSize = resumableFile.getOpt('forceChunkSize');
    const func = resumableFile.file.slice
      ? 'slice'
      : resumableFile.file.mozSlice
      ? 'mozSlice'
      : resumableFile.file.webkitSlice
      ? 'webkitSlice'
      : 'slice';
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
      if (this.isCancelled) {
        return;
      }
      var spark = SparkMD5.ArrayBuffer.hash(e.target.result);
      resumableFile.hashes.push(spark);
      if (numChunks > offset + 1) {
        this.actionChannel.put({
          type: COMPUTE_CHECKSUMS_PROGRESS,
          payload: offset / numChunks,
          meta: resumableFile.uniqueIdentifier,
        });
        this.computeChecksums(resumableFile, offset + 1, fileReader);
      } else {
        this.actionChannel.put({
          type: COMPUTE_CHECKSUMS_COMPLETE,
          meta: resumableFile.uniqueIdentifier,
        });
      }
    };
    fileReader.readAsArrayBuffer(bytes);
  }

  cancel() {
    this.isCancelled = true;
  }
}

export default ComputeChecksums;
