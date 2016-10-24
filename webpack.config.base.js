import webpack from 'webpack';
import path from 'path';

function baseConfig(env = 'development') {
  return {
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=100000&mimetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=100000'
      }, {
        test: /\.(png)$/,
        loader: 'url-loader?limit=100000'
      }]
    },
    output: {
      filename: 'bundle.js'
    },
    resolve: {
      root: [
        path.resolve(__dirname, 'app')
      ],
      extensions: ['', '.js', '.jsx', '.json'],
      packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    },
    plugins: [
    ],
    externals: [
      // put your node 3rd party libraries which can't be built with webpack here
      // (mysql, mongodb, and so on..)
    ]
  };
}

export default baseConfig;
