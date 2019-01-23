const webpack = require('webpack');
const base = require('../webpack.config.development');

module.exports = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
  ],
  resolve: {
    ...base.resolve,
  },
  module: {
    rules: [...base.module.rules],
  },
};
