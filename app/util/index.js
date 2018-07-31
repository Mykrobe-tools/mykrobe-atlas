/* @flow */

export const notImplemented = () => {
  alert('This feature is not yet implemented');
};

export const isNumeric = (num: any): boolean => !isNaN(num);
