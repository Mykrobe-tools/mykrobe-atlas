const path = require('path');
const express = require('express');
const del = require('del');
const app = express();
const multipart = require('connect-multiparty');
const resumable = require('./resumable-uploader');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

const uploadDirectory = path.resolve(__dirname, 'tmp');
resumable.setUploadDirectory(uploadDirectory);

// empty upload temp directory
del([`${uploadDirectory}/*`], {force: true}).then(paths => {
  if (paths.length > 0) {
    console.log('Temp files removed:\n', paths.join('\n'));
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
  var postUpload = resumable.post(req);
  console.log('POST', postUpload);
  res.send(postUpload.complete);
  if (postUpload.complete) {
    // file upload is complete, reassemble original file and process...
    // ...
  }
});

// Handle status checks on chunks through Resumable.js
app.get('/api/upload', (req, res) => {
  var validateGetRequest = resumable.get(req);
  console.log('GET', validateGetRequest);
  res.status(validateGetRequest.valid ? 200 : 204).send(validateGetRequest);
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
  console.log(`API dev server listening at http://${host}:${port}`);
});

// Stop dev API server
process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  server.close(() => {
    process.exit(0);
  });
});
