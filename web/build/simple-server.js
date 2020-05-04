/* @flow */

import express from 'express';
import path from 'path';

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// static assets
app.use('/', express.static(path.resolve(__dirname, 'static')));

// serve html for all unmatched routes
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
  } else {
    next();
  }
});

const server = app.listen(port, host, err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at http://${host}:${port}`);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  server.close(() => {
    process.exit(0);
  });
});

export default server;
