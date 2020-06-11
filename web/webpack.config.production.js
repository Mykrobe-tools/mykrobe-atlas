/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpackConfig = require('../webpack.config.production');
const pluginConfig = require('./webpack.plugin.config');

module.exports = merge(webpackConfig, {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(pluginConfig.getHtmlWebpackPluginConfig()),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
  ],
});
