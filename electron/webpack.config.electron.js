/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.production';
import path from 'path';

export default merge(baseConfig, {
  devtool: null,

  entry: [path.resolve(__dirname, '../electron/index.electron')],

  output: {
    path: __dirname,
    filename: './static/main.js',
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true),
    }),
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [
    // 'font-awesome',
    // 'source-map-support'
  ],
});
