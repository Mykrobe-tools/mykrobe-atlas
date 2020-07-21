/* @flow */

const sortObject = (o: Object) => {
  let sorted = {};

  let keys = Object.keys(o);
  keys.sort();

  keys.forEach((key) => {
    sorted[key] = o[key];
  });
  return sorted;
};

export default sortObject;
