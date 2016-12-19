/* @flow */

// for babel-plugin-webpack-loaders
require('babel-register')

module.exports = {
  output: {
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: []
  }
}
