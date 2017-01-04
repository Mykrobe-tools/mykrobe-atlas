/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from '../webpack.config.production';
import path from 'path';

const config = merge(baseConfig, {
  entry: path.resolve(__dirname, '../app/index'),

  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: 'static'
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'electron.html',
      template: path.resolve(__dirname, '../app/electron.html'),
      inject: false
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true)
    })
  ],

  target: 'electron-renderer'
});

export default config;
