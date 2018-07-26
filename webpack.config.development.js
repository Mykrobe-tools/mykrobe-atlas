/* @flow */

const webpack = require('webpack');
const merge = require('webpack-merge');

const webpackConfig = require('./webpack.config');

const cssRegex = /\.global\.css$/;
const cssModuleRegex = /^((?!\.global).)*\.css$/;
const sassRegex = /\.global\.(scss|sass)$/;
const sassModuleRegex = /^((?!\.global).)*\.(scss|sass)$/;

// devtool: https://webpack.js.org/configuration/devtool/#development

module.exports = merge(webpackConfig, {
  mode: 'development',

  devtool: 'cheap-eval-source-map',

  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: cssRegex,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: cssModuleRegex,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },

      // SASS support - compile all .global.scss files and pipe it to style.css
      {
        test: sassRegex,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: { precision: 8 },
          },
        ],
      },

      // SASS support - compile all other .scss files and pipe it to style.css
      {
        test: sassModuleRegex,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: { precision: 8 },
          },
        ],
      },

      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },

      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },

      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },

      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },

      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
    ],
  },

  plugins: [new webpack.NamedModulesPlugin()],
});
