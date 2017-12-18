/* @flow */

/* eslint max-len: 0 */
import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  devtool: 'eval-cheap-module-source-map',

  entry: {
    index: [
      'webpack-hot-middleware/client?reload=true&path=http://localhost:3000/__webpack_hmr',
      './app/index',
    ],
  },

  output: {
    publicPath: 'http://localhost:3000/static/',
  },

  module: {
    rules: [
      {
        test: /\.global\.css$/,
        use: ['style-loader', 'css-loader?sourceMap'],
      },

      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
});
