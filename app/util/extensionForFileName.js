/* @flow */

const extensionForFileName = (fileName: string) => {
  const extension = fileName.substr(fileName.lastIndexOf('.'));
  return extension.toLowerCase();
};

export default extensionForFileName;
