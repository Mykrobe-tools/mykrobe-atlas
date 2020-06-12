/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from '../webpack.config.production';
import path from 'path';

// Specifically define used portions of package.json
// rather than inadvertently bundling the whole file in the client
const { version, productName } = require('../package.json');

// we need to overwrite the existing entry just for this single file

baseConfig.entry = {
  index: [path.join(__dirname, 'index.desktop')],
};

// the node: config unmocks __dirname

export default merge(baseConfig, {
  target: 'electron-main',

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },

  node: {
    __dirname: false,
    __filename: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      PACKAGE_JSON: JSON.stringify({ version, productName }),
      IS_ELECTRON: JSON.stringify(true),
    }),
  ],

  externals: [
    // 'font-awesome',
    // 'source-map-support'
  ],
});
