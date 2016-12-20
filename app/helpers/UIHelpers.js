/* @flow */

export function openFileDialog() {
  const {dialog, BrowserWindow} = require('electron').remote;
  const browserWindow = BrowserWindow.getFocusedWindow();

  const files = dialog.showOpenDialog(browserWindow, {
    title: 'Open',
    properties: ['openFile'],
    filters: [
      {
        name: 'Extensions',
        extensions: ['json', 'bam', 'gz', 'fastq']
      }
    ]
  });

  if (files && files.length) {
    return files[0];
  }

  return false;
}

export function saveFileDialog(defaultPath: string = 'mykrobe.json') {
  const {dialog, BrowserWindow} = require('electron').remote;
  const browserWindow = BrowserWindow.getFocusedWindow();

  const filePath = dialog.showSaveDialog(browserWindow, {
    title: 'Save',
    defaultPath
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
