/* @flow */

export function fetchToCurl(url: string, options: any = {}) {
  const { method, headers, body } = options;
  const components = ['curl', `'${url}'`];
  if (method) {
    components.push('-X');
    components.push(method);
  }
  for (let key in headers) {
    const value = headers[key];
    components.push('-H');
    components.push(`'${key}: ${value}'`);
  }
  if (body) {
    components.push('--data-binary');
    components.push(`'${body}'`);
  }
  const curl = components.join(' ');
  return curl;
}
