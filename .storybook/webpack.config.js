const webpack = require('webpack');
const _ = require('lodash');

const { version, productName } = require('../package.json');
const getReactAppEnv = require('../scripts/react-app-env');

const debug = require('debug');
const d = debug('mykrobe:storybook-config');

// define window.env via webpack.DefinePlugin - TODO: replace with vars injected into HTML to make behaviour idential to actual runtime

const env = getReactAppEnv();

const defines = {};
Object.entries(env).forEach(([key, value]) => {
  defines[`window.env.${key}`] = JSON.stringify(value);
});

d(defines);

// exclude rules which conflict with Storybook's

const filteredRulesBlacklist = ['url-loader', 'file-loader'];

const filteredRules = (rules) =>
  rules.filter((rule) => {
    if (_.isString(rule.loader)) {
      return !filteredRulesBlacklist.includes(rule.loader);
    } else if (_.isString(rule.use)) {
      return !filteredRulesBlacklist.includes(rule.use);
    } else if (_.isArray(rule.use)) {
      for (let i = 0; i < rule.use.length; i++) {
        if (filteredRulesBlacklist.includes(rule.use[i].loader)) {
          return false;
        }
      }
      return true;
    } else if (rule.use.loader) {
      return !filteredRulesBlacklist.includes(rule.use.loader);
    } else {
      d('Unhandled rule - including by default', JSON.stringify(rule, null, 2));
      return true;
    }
  });

module.exports = async ({ config, mode }) => {
  d({ mode });
  const customConfig =
    mode === 'DEVELOPMENT'
      ? require('../web/webpack.config.development')
      : require('../web/webpack.config.production');
  const customConfigFilteredRules = filteredRules(customConfig.module.rules);
  config.resolve.modules = [
    ...config.resolve.modules,
    ...customConfig.resolve.modules,
  ];
  config.module.rules = [...config.module.rules, ...customConfigFilteredRules];
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      ...defines,
      PACKAGE_JSON: JSON.stringify({ version, productName }),
      IS_ELECTRON: JSON.stringify(false),
    }),
  ];
  return config;
};
