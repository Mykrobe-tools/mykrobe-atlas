/* @flow */

const webpack = require('webpack');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');

// Specifically define used portions of package.json
// rather than inadvertently bundling the whole file in the client
const { version, productName } = require('./package.json');

module.exports = {
  entry: {
    bundle: [
      'url-search-params-polyfill',
      'event-source-polyfill',
      'resize-observer-polyfill',
      path.join(dirApp, 'index'),
    ],
  },
  resolve: {
    modules: [dirApp, dirNode],
  },
  plugins: [
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
    new webpack.DefinePlugin({
      PACKAGE_JSON: JSON.stringify({ version, productName }),
    }),
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(makeandship-js-common|makeandship-api-common|mykrobe-atlas-jsonschema|swagger-client|@google\/markerclustererplus))/,
      },
    ],
  },
  stats: 'errors-only',
};
