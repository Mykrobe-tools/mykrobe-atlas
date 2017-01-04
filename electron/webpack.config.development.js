/* @flow */

/* eslint max-len: 0 */
import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from '../webpack.config.development';
import path from 'path';

export default merge(baseConfig, {

  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
    path.resolve(__dirname, '../app/index')
  ],

  output: {
    path: path.join(__dirname, 'static'),
    publicPath: 'http://localhost:3000/static/'
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(true)
    })
  ],

  target: 'electron-renderer'
});
