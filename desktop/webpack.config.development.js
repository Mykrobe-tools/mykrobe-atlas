/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const pkg = require('../package.json');
const baseConfig = require('../webpack.config.development');

const appHtmlTitle = pkg.productName;

module.exports = merge(baseConfig, {
  target: 'electron-renderer',
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
