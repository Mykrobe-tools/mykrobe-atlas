import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from '../webpack.config.production';
import path from 'path';

const config = merge(baseConfig, {
  entry: path.resolve(__dirname, '../app/index'),

  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: 'static'
  },

  target: 'electron-renderer'
});

export default config;
