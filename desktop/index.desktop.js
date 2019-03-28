/* @flow */

import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import log from 'electron-log';
import type { Menu } from 'electron';

import { DEBUG } from './constants';

import { createMenu, installMenu } from './menu';

let autoUpdater;

// FIXME: currently have to comment out the following block to build on Windows
// nb. modifying this with an addional variable/flag check will not currently work
// as the require() is still evaluated, resulting in error and build failure

if (process.env.NODE_ENV === 'production') {
  autoUpdater = require('electron-updater').autoUpdater;
  setupAutoUpdater();
}

// end FIXME

let mainWindow: BrowserWindow;
let filepath;
let ready = false;
let menu: Menu;
let isAnalysing = false;

if (DEBUG) {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path');
  const p = path.join(__dirname, '../node_modules');
  require('module').globalPaths.push(p);
  // Log level
  log.transports.console.level = 'info';
}

// quit on closing windows
app.on('window-all-closed', () => {
  app.quit();
});

// TODO: this is not yet working - perhaps need to set file associations in mac info.plist

app.on('will-finish-launching', () => {
  app.on('open-file', function(event, path) {
    event.preventDefault();
    filepath = path;
    if (ready) {
      mainWindow && mainWindow.webContents.send('open-file', filepath);
      filepath = null;
      return;
    }
  });
});

// save enabled

ipcMain.on('set-save-enabled', (event, value) => {
  log.info('set-save-enabled', value);
  menu.items[1].submenu.items[4].enabled = value;
});

ipcMain.on('set-is-analysing', (event, value) => {
  log.info('set-is-analysing', value);
  isAnalysing = value;
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    const installExtensions = async () => {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS,
      } = require('electron-devtools-installer');
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => log.info(`Added Extension:  ${name}`))
        .catch(err => log.error('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then(name => log.info(`Added Extension:  ${name}`))
        .catch(err => log.error('An error occurred: ', err));
    };

    await installExtensions();
  }

  if (autoUpdater) {
    log.info('Auto updater starting');
    // This will immediately download an update, then install when the app quits
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    log.info('Auto updater is disabled');
  }

  // const packageJson = require('./package.json');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 800,
    minHeight: 600,
  });

  menu = createMenu(mainWindow);

  if (process.env.NODE_ENV == 'production') {
    let url = require('url').format({
      protocol: 'file',
      slashes: true,
      pathname: require('path').join(__dirname, 'index.html'),
    });
    log.info('mainWindow.loadURL', url);
    mainWindow.loadURL(url);
  } else {
    log.info('mainWindow.loadURL', `http://localhost:3000`);
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.webContents.on('did-finish-load', () => {
    installMenu(menu, mainWindow);
    if (DEBUG) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    // FIXME: timeout avoids 1 frame of rendering with no text before fonts are ready
    // find a more concrete way e.g. measure a fragment of styled text, callback when font is ready
    setTimeout(() => {
      mainWindow.center();
      mainWindow.show();
      mainWindow.focus();
    }, 0);
  });

  mainWindow.on('close', e => {
    if (isAnalysing) {
      const choice = dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['OK', 'Cancel'],
        message: 'Analysis in progress - are you sure you want to quit?',
      });
      if (choice == 1) {
        e.preventDefault();
      }
    }
  });

  ready = true;
  if (filepath) {
    mainWindow.webContents.send('open-file', filepath);
    filepath = null;
  }
});

function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
  });
  autoUpdater.on('update-available', info => {
    log.info('Update available.', info);
  });
  autoUpdater.on('update-not-available', info => {
    log.info('Update not available.', info);
  });
  autoUpdater.on('error', err => {
    log.error('Error in auto-updater.', err);
  });
  autoUpdater.on('download-progress', progressObj => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message =
      log_message +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')';
    log.info(log_message);
  });
  autoUpdater.on('update-downloaded', info => {
    log.info('Update downloaded', info);
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call autoUpdater.quitAndInstall(); immediately
    // setTimeout(() => {
    //   autoUpdater.quitAndInstall();
    // }, 5000);
  });
}
