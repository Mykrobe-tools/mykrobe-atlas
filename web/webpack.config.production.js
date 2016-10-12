import merge from 'webpack-merge';
import baseConfig from '../webpack.config.production';
import path from 'path';

const config = merge(baseConfig, {
  entry: path.resolve(__dirname, '../app/index'),

  output: {
    path: path.resolve(__dirname, 'build')
  }
});

export default config;
