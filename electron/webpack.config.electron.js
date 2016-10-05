import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.production';
import path from 'path';

export default merge(baseConfig, {
  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../app/main.development')
  ],

  output: {
    path: __dirname,
    filename: './static/main.js'
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true)
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  },

  externals: [
    // 'font-awesome',
    // 'source-map-support'
  ]
});
