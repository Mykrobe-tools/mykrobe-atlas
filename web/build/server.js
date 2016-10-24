/* eslint no-console: 0 */

import express from 'express';
import path from 'path';

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.use('/static/', express.static(path.resolve(__dirname, 'static')));

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
