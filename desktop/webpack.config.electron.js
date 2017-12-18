/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.production';
import path from 'path';

export default merge(baseConfig, {
  devtool: false,

  entry: { index: [path.join(__dirname, 'index.desktop')] },

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'static'),
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
