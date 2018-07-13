/* @flow */

export const shouldAcceptDropEvent = (e: any) => {
  const dt = e.dataTransfer;
  if (
    !(
      dt.types &&
      (dt.types.indexOf
        ? dt.types.indexOf('Files') !== -1
        : dt.types.contains('Files'))
    )
  ) {
    return false;
  } else {
    return true;
  }
};
