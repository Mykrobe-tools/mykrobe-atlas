/* @flow */

// rather than use query-string, these functions preserve order of keys
// this is necessary when dynamically adding and removing filters
// so that the ui will maintain order

export const parseQuery = (query: string): any => {
  const searchParams = new URLSearchParams(query);
  const parsed = {};
  for (let param of searchParams) {
    const key = param[0];
    const value = param[1];
    parsed[key] = value;
  }
  return parsed;
};

export const stringifyQuery = (query: any): string => {
  var searchParams = new URLSearchParams('');
  const queryKeys = Object.keys(query);
  for (let i = 0; i < queryKeys.length; i++) {
    const key = queryKeys[i];
    const value = query[key];
    searchParams.set(key, value);
  }
  return searchParams.toString();
};
