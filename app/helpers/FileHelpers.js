/* @flow */

import path from 'path';

// magically create a 'File' object from a file path
// http://stackoverflow.com/a/30896068

export function getFileObject(filePathOrUrl: string): Promise<File> {
  return new Promise((resolve, reject) => {
    getFileBlob(filePathOrUrl).then(blob => {
      const fileObject = blobToFile(blob, path.basename(filePathOrUrl));
      resolve(fileObject);
    });
  });
}

function getFileBlob(url): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.addEventListener('load', () => {
      resolve(xhr.response);
    });
    xhr.send();
  });
}

function blobToFile(blob: Blob, name: string): File {
  // $FlowFixMe: Ignore missing type values
  blob.lastModifiedDate = new Date();
  // $FlowFixMe: Ignore missing type values
  blob.name = name;
  // $FlowFixMe: Ignore missing type values
  return blob;
}
