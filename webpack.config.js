/* @flow */

const webpack = require('webpack');
const path = require('path');
const Dotenv = require('dotenv-webpack');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');

module.exports = {
  entry: {
    bundle: [
      'babel-polyfill',
      'url-search-params-polyfill',
      path.join(dirApp, 'index'),
    ],
  },
  resolve: {
    modules: [dirApp, dirNode],
  },
  plugins: [
    new Dotenv(),
    // Don't bundle moment locales - instead, add a require to each specific locale e.g. require('moment/locale/en');
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(makeandship-js-common))/,
      },
      // IMAGES
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },
};
