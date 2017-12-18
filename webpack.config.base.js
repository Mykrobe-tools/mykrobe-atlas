/* @flow */

import path from 'path';

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(png)$/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
  output: {
    filename: 'bundle.js',
  },
  resolve: {
    modules: [path.join(__dirname, 'app'), 'node_modules'],
  },
};

export default baseConfig;
