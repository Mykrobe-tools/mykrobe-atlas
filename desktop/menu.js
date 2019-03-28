/* @flow */

import { Menu, shell } from 'electron';
import type { BrowserWindow } from 'electron';

import { DEBUG } from './constants';
const pkg = require('./static/package.json');

export const createMenu = (options: any) => {
  const template = getMenuTemplate(options);
  const menu = Menu.buildFromTemplate(template);
  return menu;
};

export const installMenu = (menu: Menu, mainWindow: BrowserWindow) => {
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu);
  } else {
    mainWindow.setMenu(menu);
  }
};

const getMenuTemplate = ({
  mainWindow,
  onMenuFileNew,
  onMenuFileOpen,
  onMenuQuit,
}) => {
  if (process.platform === 'darwin') {
    return [
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
            click: onMenuQuit,
          },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'New',
            accelerator: 'CmdOrCtrl+N',
            click: onMenuFileNew,
          },
          {
            type: 'separator',
          },
          {
            label: 'Open…',
            accelerator: 'CmdOrCtrl+O',
            click: onMenuFileOpen,
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
        submenu: DEBUG
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
  }
  return [
    {
      label: '&File',
      submenu: [
        {
          label: '&New',
          accelerator: 'Ctrl+N',
          click: onMenuFileNew,
        },
        {
          type: 'separator',
        },
        {
          label: '&Open File…',
          accelerator: 'Ctrl+O',
          click: onMenuFileOpen,
        },
        {
          type: 'separator',
        },
        {
          label: '&Save As…',
          accelerator: 'Ctrl+Shift+S',
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
        {
          type: 'separator',
        },
        {
          label: 'Exit',
          click: onMenuQuit,
        },
      ],
    },
    {
      label: '&View',
      submenu: DEBUG
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
};
