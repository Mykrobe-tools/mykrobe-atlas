const path = require('path');
const express = require('express');
const del = require('del');
const multipart = require('connect-multiparty');
const proxy = require('express-http-proxy');
const resumable = require('./resumable-uploader');
const bodyParser = require('body-parser');

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

const uploadDirectory = path.resolve(__dirname, 'tmp');
resumable.setUploadDirectory(uploadDirectory);

// empty upload temp directory
del([`${uploadDirectory}/*`], { force: true }).then(paths => {
  if (paths.length > 0) {
    console.log('Temp files removed:\n', paths.join('\n'));
  }
});

// Handle form multipart data
app.use(multipart());

// parse application/json
app.use(bodyParser.text());
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Handle new upload id creation
let id = 1;
app.post('/api/experiments/', (req, res) => {
  res.status(200).send({ id: id++ });
});

// Handle upload updates
app.put('/api/experiments/:id', (req, res) => {
  // Handle uploads through Resumable.js
  if (req.body.fileUpload) {
    var postUpload = resumable.post(req);
    console.log('PUT', postUpload);
    res.send(postUpload.complete);
    if (postUpload.complete) {
      // file upload is complete, reassemble original file and process...
      // ...
    }
  } else {
    // Handle Metadata API data
    console.log(JSON.parse(req.body));
    res.status(202).send({ status: 'ok' });
  }
});

// Handle status checks on chunks through Resumable.js
app.get('/api/experiments/:id/upload-status', (req, res) => {
  var validateGetRequest = resumable.get(req);
  console.log('GET', validateGetRequest);
  res.status(validateGetRequest.valid ? 200 : 204).send(validateGetRequest);
});

// Serve experiment api fixture
app.get('/api/experiments/:id', (req, res) => {
  // eslint-disable-line
  res.sendFile(
    path.resolve(__dirname, '../test/__fixtures__/api/experiment.json')
  );
});

// Serve all other api fixtures
app.get('/api/:endpoint', (req, res) => {
  // eslint-disable-line
  const { endpoint } = req.params;
  res.sendFile(
    path.resolve(__dirname, '../test/__fixtures__/api', `${endpoint}.json`)
  );
});

// Treeplace
app.use(
  '/treeplace',
  proxy('13.69.243.89:8000', {
    forwardPath: req => {
      // eslint-disable-line
      return `/treeplace${require('url')
        .parse(req.url)
        .path.substr(1)}`;
    },
  })
);

// Pass through all other requests to the API
app.use(
  proxy('api.atlas-dev.makeandship.com', {
    https: true,
  })
);

// Start dev API server
const server = app.listen(port, err => {
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
