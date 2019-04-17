/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

const pkg = require('../package.json');
const webpackConfig = require('../webpack.config.production');

const appHtmlTitle = pkg.productName;

module.exports = merge(webpackConfig, {
  output: {
    path: path.resolve(__dirname, 'build/static'),
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, 'build/static')]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.template.html'),
      title: appHtmlTitle,
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
      API_URL: JSON.stringify(process.env.API_URL),
      API_SWAGGER_URL: JSON.stringify(process.env.API_SWAGGER_URL),
      AUTH_COOKIE_URL: JSON.stringify(process.env.AUTH_COOKIE_URL),
      API_DEBUG: JSON.stringify(process.env.API_DEBUG),
      PRODUCTION_DEBUG: JSON.stringify(process.env.PRODUCTION_DEBUG),
    }),
  ],
});
