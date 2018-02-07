/* @flow */

import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from '../webpack.config.production';
import path from 'path';

const config = merge(baseConfig, {
  entry: { index: [path.resolve(__dirname, '../app/index')] },

  output: {
    path: path.resolve(__dirname, 'build/static'),
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      // Compression specific options
      compress: {
        // remove warnings
        warnings: false,
        // Drop console statements
        drop_console: true,
      },
    }),
  ],
});

console.log(JSON.stringify(config, null, 2));

export default config;
