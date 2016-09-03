export function openFileDialog(callback) {
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
