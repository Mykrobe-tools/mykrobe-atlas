/* @flow */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';

import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true,
  serverSideRender: false
});

app.use(wdm);

app.use(webpackHotMiddleware(compiler));

// static assets for demo
app.use('/demo/', express.static(path.resolve(__dirname, 'demo')));

// serve font awe...
app.use('*/fonts', express.static('./node_modules/font-awesome/fonts'));

// treeplace for demo
// e.g. http://13.69.243.89:8000/treeplace?file=10057-10.fastq.gz
app.get('/treeplace', (req, res, next) => {
  const {file} = req.query;
  const index = file.indexOf('.');
  const prefix = file.substr(0, index);
  res.sendFile(path.resolve(__dirname, 'demo', `${prefix}.json`));
});

// serve api fixtures
app.get('/api/:endpoint', (req, res, next) => {
  const {endpoint} = req.params;
  res.sendFile(path.resolve(__dirname, '../test/_fixtures/api', `${endpoint}.json`));
});

// serve html
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  }
  else {
    next();
  }
});

const server = app.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Listening at http://${host}:${port}`);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});
