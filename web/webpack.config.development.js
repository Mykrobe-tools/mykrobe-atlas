/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const pkg = require('../package.json');
const webpackConfig = require('../webpack.config.development');

const appHtmlTitle = pkg.productName;

module.exports = merge(webpackConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.template.html'),
      title: appHtmlTitle,
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
  ],
});
