/* @flow */

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const config = merge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.global\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /^((?!\.global).)*\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use:
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        }),
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'strip-loader?strip[]=debug,strip[]=debugger,strip[]=console.log',
        ],
      },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],
});

export default config;
