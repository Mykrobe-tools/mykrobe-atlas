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
      },
    ]
  });

  if (files && files.length) {
    return files[0];
  }

  return false;
}

export function saveFileDialog(defaultPath = 'mykrobe.json') {
  const {dialog, BrowserWindow} = require('electron').remote;
  const browserWindow = BrowserWindow.getFocusedWindow();

  const filePath = dialog.showSaveDialog(browserWindow, {
    title: 'Save',
    defaultPath
  });

  return filePath || false;
}
