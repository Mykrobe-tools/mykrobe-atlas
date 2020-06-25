/* @flow */

const express = require('express');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());

const REACT_APP_ENV = {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_API_SPEC_URL: process.env.REACT_APP_API_SPEC_URL,
  REACT_APP_KEYCLOAK_URL: process.env.REACT_APP_KEYCLOAK_URL,
  REACT_APP_KEYCLOAK_REALM: process.env.REACT_APP_KEYCLOAK_REALM,
  REACT_APP_KEYCLOAK_CLIENT_ID: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  REACT_APP_KEYCLOAK_IDP: process.env.REACT_APP_KEYCLOAK_IDP,
  REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  REACT_APP_BOX_CLIENT_ID: process.env.REACT_APP_BOX_CLIENT_ID,
  REACT_APP_DROPBOX_APP_KEY: process.env.REACT_APP_DROPBOX_APP_KEY,
  REACT_APP_GOOGLE_DRIVE_CLIENT_ID:
    process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
  REACT_APP_GOOGLE_DRIVE_DEVELOPER_KEY:
    process.env.REACT_APP_GOOGLE_DRIVE_DEVELOPER_KEY,
  REACT_APP_ONEDRIVE_CLIENT_ID: process.env.REACT_APP_ONEDRIVE_CLIENT_ID,
};

// static assets
app.use('/static', express.static(path.resolve(__dirname, 'static')));

// serve index.ejs template for all unmatched routes
app.get('*', async (req, res, next) => {
  if (req.accepts('html')) {
    const indexTemplate = path.join(__dirname, 'index.ejs');
    const str = await ejs.renderFile(indexTemplate, {
      REACT_APP_ENV: JSON.stringify(REACT_APP_ENV),
    });
    res.send(str);
  } else {
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
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;
