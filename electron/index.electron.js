/* @flow */

import { app, BrowserWindow, Menu, shell } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

let menu;
let template;
let mainWindow = null;
let filepath;
let ready = false;

const SHOW_DEV_TOOLS = process.env.NODE_ENV === 'development';
// const SHOW_DEV_TOOLS = true;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support') // eslint-disable-line
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')(); // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const installExtensions = async () => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

// TODO: this is not yet working - perhaps need to set file associations in mac info.plist

app.on('will-finish-launching', () => {
  app.on('open-file', function(event, path) {
    event.preventDefault();
    filepath = path;
    if (ready) {
      mainWindow.webContents.send('open-file', filepath);
      filepath = null;
      return;
    }
  });
});

app.on('ready', async () => {
  await installExtensions();

  // const packageJson = require('./package.json');

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (SHOW_DEV_TOOLS) {
    mainWindow.openDevTools();
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(x, y);
          },
        },
      ]).popup(mainWindow);
    });
  }

  if (process.platform === 'darwin') {
    template = [
      {
        label: 'Electron',
        submenu: [
          {
            label: 'About ElectronReact',
            selector: 'orderFrontStandardAboutPanel:',
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
            label: 'Hide ElectronReact',
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
              shell.openExternal('http://electron.atom.io');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/atom/electron/tree/master/docs#readme'
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://discuss.atom.io/c/electron');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/atom/electron/issues');
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
            label: 'Learn More',
            click() {
              shell.openExternal('http://electron.atom.io');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/atom/electron/tree/master/docs#readme'
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://discuss.atom.io/c/electron');
            },
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/atom/electron/issues');
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
