/* @flow */

const webpack = require('webpack');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');

module.exports = {
  entry: {
    bundle: [
      'whatwg-fetch',
      'babel-polyfill',
      'url-search-params-polyfill',
      'event-source-polyfill',
      path.join(dirApp, 'index'),
    ],
  },
  resolve: {
    modules: [dirApp, dirNode],
  },
  plugins: [
    // Don't bundle moment locales - instead, add a require to each specific locale e.g. require('moment/locale/en');
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(makeandship-js-common|makeandship-api-common|mykrobe-atlas-jsonschema|swagger-client))/,
      },
      // IMAGES
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },
  stats: 'errors-only',
};
