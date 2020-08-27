module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: false,
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    'inline-dotenv',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
  ],
  env: {
    production: {
      plugins: [
        'transform-react-remove-prop-types',
        './babel-plugin-electron-module-resolver',
      ],
    },
    development: {
      plugins: ['./babel-plugin-electron-module-resolver'],
    },
  },
};
