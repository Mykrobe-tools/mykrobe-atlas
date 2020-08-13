/* @flow */

import * as APIConstants from '../constants/APIConstants';

export function openFileDialog(
  filters: Array<any> = [
    {
      name: 'Extensions',
      extensions: APIConstants.API_SAMPLE_EXTENSIONS_ARRAY,
    },
  ]
) {
  const { dialog, BrowserWindow } = require('electron').remote;
  const browserWindow = BrowserWindow.getFocusedWindow();

  const files = dialog.showOpenDialogSync(browserWindow, {
    title: 'Open',
    properties: ['openFile', 'multiSelections'],
    filters,
  });

  if (files && files.length) {
    return files;
  }

  return false;
}

export function saveFileDialog(
  defaultPath: string = 'mykrobe',
  filters: Array<any> = [
    {
      name: 'JSON',
      extensions: ['json'],
    },
  ]
) {
  const { dialog, BrowserWindow } = require('electron').remote;
  const browserWindow = BrowserWindow.getFocusedWindow();

  const filePath = dialog.showSaveDialogSync(browserWindow, {
    title: 'Save',
    defaultPath,
    filters,
  });

  return filePath || false;
}

export function setProgress(progress: number) {
  // let commander = window.global('commander')
  // $FlowFixMe: Ignore Electron require
  const remote = require('electron').remote;
  const currentWindow = remote.getCurrentWindow();
  if (progress === 0 || progress === 100) {
    currentWindow.setProgressBar(-1);
    return;
  }
  currentWindow.setProgressBar(progress / 100.0);
}

export function launchWebsite() {
  const { shell } = require('electron').remote;
  shell.openExternal('https://www.mykrobe.com/');
}
