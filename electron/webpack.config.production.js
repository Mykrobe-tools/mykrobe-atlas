/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from '../webpack.config.production';
import path from 'path';

const config = merge(baseConfig, {
  devtool: null,

  entry: path.resolve(__dirname, '../app/index'),

  output: {
    path: path.resolve(__dirname, 'static'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../electron/index.html'),
      inject: false,
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true),
    }),
  ],

  target: 'electron-renderer',
});

export default config;
