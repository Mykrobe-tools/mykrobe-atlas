/* @flow */

const webpack = require('webpack');
const path = require('path');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');

module.exports = {
  entry: {
    bundle: [
      'whatwg-fetch',
      'babel-polyfill',
      'url-search-params-polyfill',
      path.join(dirApp, 'index'),
    ],
  },
  resolve: {
    modules: [dirApp, dirNode],
  },
  plugins: [
    // Don't bundle moment locales - instead, add a require to each specific locale e.g. require('moment/locale/en');
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(makeandship-js-common|makeandship-api-common|swagger-client))/,
      },
      // IMAGES
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },
};
