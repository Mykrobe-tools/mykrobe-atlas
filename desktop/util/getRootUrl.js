/* @flow */

const getRootUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    let url = require('url').format({
      protocol: 'file',
      slashes: true,
      pathname: require('path').join(__dirname, 'index.html'),
    });
    return url;
  } else {
    return 'http://localhost:3000';
  }
};

export default getRootUrl;
