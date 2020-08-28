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

const additionalPlugins = [];

console.log('process.env.SENTRY_AUTH_TOKEN', process.env.SENTRY_AUTH_TOKEN);
console.log('process.env.UPLOAD_TO_SENTRY', process.env.UPLOAD_TO_SENTRY);

if (process.env.SENTRY_AUTH_TOKEN && process.env.UPLOAD_TO_SENTRY !== 'false') {
  console.log('Using SentryCliPlugin');
  const release = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
  console.log('release', release);
  additionalPlugins.push(
    new SentryCliPlugin({
      include: buildPath,
      release,
    })
  );
} else {
  console.log('Not using SentryCliPlugin');
}

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
