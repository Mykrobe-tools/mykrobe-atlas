const webpack = require('webpack');

module.exports = async ({ config, mode }) => {
  const customConfig =
    mode === 'DEVELOPMENT'
      ? require('../web/webpack.config.development')
      : require('../web/webpack.config.production');
  config.resolve = { ...config.resolve, ...customConfig.resolve };
  config.module.rules = [...config.module.rules, ...customConfig.module.rules];
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      IS_ELECTRON: JSON.stringify(false),
    }),
  ];
  return config;
};
