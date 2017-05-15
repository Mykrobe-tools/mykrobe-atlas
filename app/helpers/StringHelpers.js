/* @flow */

export function objectToParamString(args: Object) {
  let params = new URLSearchParams();
  for (let key in args) {
    if (args.hasOwnProperty(key)) {
      params.set(key, args[key]);
    }
  }
  return params.toString();
}
