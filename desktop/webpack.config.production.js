/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from '../webpack.config.production';
import path from 'path';

const pkg = require('../package.json');

const appHtmlTitle = pkg.productName;

const config = merge(baseConfig, {
  target: 'electron-renderer',

  output: {
    path: path.resolve(__dirname, 'static'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.template.html'),
      title: appHtmlTitle,
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true),
    }),
  ],
});

export default config;
