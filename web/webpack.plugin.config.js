const path = require('path');

const getReactAppEnv = require('../scripts/react-app-env');

const pkg = require('../package.json');

const appHtmlTitle = pkg.productName;

const getHtmlWebpackPluginConfig = () => {
  let config = {
    template: path.join(__dirname, 'index.template.ejs'),
    title: appHtmlTitle,
    minify: {
      collapseWhitespace: true,
      preserveLineBreaks: false,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    const env = getReactAppEnv();
    config.env = JSON.stringify(env);
  } else {
    // in production, inject an ejs template tag `<%- REACT_APP_ENV %>` that can be replaced by the express server
    config.env = `<%- REACT_APP_ENV %>`;
    config.filename = `index.ejs`;
  }

  return config;
};

module.exports = {
  getHtmlWebpackPluginConfig,
};
