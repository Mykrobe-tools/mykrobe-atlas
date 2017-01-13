const path = require('path');
const express = require('express');
const del = require('del');
const app = express();
const multipart = require('connect-multiparty');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;
const resumablePath = path.resolve(__dirname, 'tmp');
const resumable = require('./resumable-uploader')(resumablePath);

// empty upload temp directory
del([`${resumablePath}/*`], {force: true}).then(paths => {
  if (paths.length > 0) {
    console.log('Files removed:\n', paths.join('\n'));
  }
});

// Handle form multipart data
app.use(multipart());

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Handle uploads through Resumable.js
app.post('/api/upload', (req, res) => {
  resumable.post(req, (status, filename, originalFilename, identifier) => {
    console.log('POST', status, originalFilename, identifier);
    res.send(status);
    if (status === 'done') {
      // file upload is complete, begin processing
      // ...
    }
  });
});

// Handle status checks on chunks through Resumable.js
app.get('/api/upload', (req, res) => {
  resumable.get(req, (status, filename, originalFilename, identifier) => {
    console.log('GET', status);
    res.status(status === 'found' ? 200 : 204).send(status);
  });
});

// Handle access requests to uploaded files
app.get('/api/download/:identifier', (req, res) => {
  resumable.write(req.params.identifier, res);
});

// Serve all other api fixtures
app.get('/api/:endpoint', (req, res, next) => {
  const {endpoint} = req.params;
  res.sendFile(path.resolve(__dirname, '../test/_fixtures/api', `${endpoint}.json`));
});

// Start dev API server
const server = app.listen(port, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Listening at http://${host}:${port}`);
});

// Stop dev API server
process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  server.close(() => {
    process.exit(0);
  });
});
