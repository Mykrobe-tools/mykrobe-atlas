const fs = require('fs');
const path = require('path');

const getReactAppEnv = () => {
  const dotenvFile = path.join(__dirname, '../.env');
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }

  const REACT_APP = /^REACT_APP_/i;

  const env = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
      }
    );
  return env;
};

module.exports = getReactAppEnv;
