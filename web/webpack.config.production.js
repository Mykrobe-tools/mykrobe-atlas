/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const path = require('path');

const webpackConfig = require('../webpack.config.production');
const pluginConfig = require('./webpack.plugin.config');

const buildPath = path.join(__dirname, 'build');

const additionalPlugins =
  process.env.UPLOAD_TO_SENTRY !== 'false'
    ? [
        new SentryCliPlugin({
          include: buildPath,
        }),
      ]
    : [];

module.exports = merge(webpackConfig, {
  devtool: 'source-map',

  output: {
    path: buildPath,
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(pluginConfig.getHtmlWebpackPluginConfig()),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
    ...additionalPlugins,
  ],
});
