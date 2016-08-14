import path from 'path';

function baseConfig(env = 'development') {
  const JS_LOADERS =
    ('development' === env)
    ? ['babel-loader']
    : [
      'babel-loader',
      'strip-loader?strip[]=debug,strip[]=debugger,strip[]=console.log'
    ];
  return {
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: JS_LOADERS,
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }]
    },
    output: {
      path: path.join(__dirname, 'static'),
      filename: 'bundle.js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
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
