import path from 'path';

function baseConfig(env = 'development') {
  const STRIP_CONSOLE_LOG = ('development' !== env);
// const STRIP_CONSOLE_LOG = false;

  const JS_LOADERS =
    STRIP_CONSOLE_LOG
    ? [
      'babel-loader',
      'strip-loader?strip[]=debug,strip[]=debugger,strip[]=console.log'
    ]
    : ['babel-loader'];
  return {
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: JS_LOADERS,
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=100000"
      }, {
        test: /\.(png)$/,
        loader: 'url-loader?limit=100000'
      }]
    },
    output: {
      path: path.join(__dirname, 'static'),
      filename: 'bundle.js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      root: [
        path.resolve('./app')
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
