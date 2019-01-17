/* @flow */

import { app, BrowserWindow, Menu, shell } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

if (process.env.NODE_ENV === 'production') {
  setupAutoUpdater();
}

const pkg = require('./static/package.json');

let menu;
let template;
let mainWindow: BrowserWindow;
let filepath;
let ready = false;

const SHOW_DEV_TOOLS = process.env.NODE_ENV === 'development';
// const SHOW_DEV_TOOLS = true;

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
  const path = require('path');
  const p = path.join(__dirname, '../node_modules');
  require('module').globalPaths.push(p);
  // Log level
  log.transports.console.level = 'info';
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
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

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    const installExtensions = async () => {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
        REDUX_DEVTOOLS,
      } = require('electron-devtools-installer');
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err));
    };

    await installExtensions();
  }

  if (process.env.NODE_ENV === 'production') {
    // This will immediately download an update, then install when the app quits
    autoUpdater.checkForUpdatesAndNotify();
  }

  // const packageJson = require('./package.json');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 800,
    minHeight: 600,
  });

  if (process.env.NODE_ENV == 'production') {
    mainWindow.loadURL(`file://${__dirname}/index.html`);
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.webContents.on('did-finish-load', () => {
    if (SHOW_DEV_TOOLS) {
      mainWindow.webContents.openDevTools();
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'darwin') {
    template = [
      {
        label: `${pkg.productName}`,
        submenu: [
          {
            label: `About ${pkg.productName}`,
            click() {
              mainWindow.send('menu-about');
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Services',
            submenu: [],
          },
          {
            type: 'separator',
          },
          {
            label: `Hide ${pkg.productName}`,
            accelerator: 'Command+H',
            selector: 'hide:',
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:',
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click() {
              mainWindow.send('menu-file-new');
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Open…',
            accelerator: 'CmdOrCtrl+O',
            click() {
              mainWindow.send('menu-file-open');
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Save As…',
            accelerator: 'CmdOrCtrl+Shift+S',
            click() {
              mainWindow.send('menu-file-save-as');
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Save Screenshot…',
            click() {
              mainWindow.send('menu-capture-page');
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:',
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:',
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:',
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:',
          },
        ],
      },
      {
        label: 'View',
        submenu: SHOW_DEV_TOOLS
          ? [
              {
                label: 'Reload',
                accelerator: 'Command+R',
                click() {
                  mainWindow.webContents.reload();
                },
              },
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click() {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen());
                },
              },
              {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click() {
                  mainWindow.toggleDevTools();
                },
              },
            ]
          : [
              {
                label: 'Toggle Full Screen',
                accelerator: 'Ctrl+Command+F',
                click() {
                  mainWindow.setFullScreen(!mainWindow.isFullScreen());
                },
              },
            ],
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:',
          },
          {
            label: 'Close',
            accelerator: 'Command+W',
            selector: 'performClose:',
          },
          {
            type: 'separator',
          },
          {
            label: 'Bring All to Front',
            selector: 'arrangeInFront:',
          },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('http://www.mykrobe.com/');
            },
          },
        ],
      },
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click() {
              mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click() {
                    mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click() {
                    mainWindow.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click() {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: `About ${pkg.productName}`,
            click() {
              mainWindow.send('menu-about');
            },
          },
          {
            label: 'Learn More',
            click() {
              shell.openExternal('http://www.mykrobe.com/');
            },
          },
        ],
      },
    ];
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
  ready = true;
  if (filepath) {
    mainWindow.webContents.send('open-file', filepath);
    filepath = null;
  }
});

function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('App starting...');
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
