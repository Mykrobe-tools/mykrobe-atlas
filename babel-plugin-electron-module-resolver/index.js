/* @flow */

import pathLib from 'path';
import fs from 'fs';

// This plugin will modify imports to import sources with a '.electron' suffix
// Only if process.PLATFORM === 'electron'

const DEBUG = false;

const resolveImport = (path, state) => {
  var source = path.node.source.value;

  if (process.env.PLATFORM !== 'electron') {
    return;
  }

  // ignore anything which is not a relative import
  if (!source.startsWith('./') && !source.startsWith('../')) {
    return;
  }
  DEBUG && console.log('source', source);

  const originalImportFilePath = pathLib.resolve(
    pathLib.dirname(state.file.opts.filename),
    source
  );

  const originalImportFilePathParsed = pathLib.parse(originalImportFilePath);

  let originalImportFilePathResolved = originalImportFilePath;

  // check if there is no extension and if the import is a folder
  if (originalImportFilePathParsed.ext === '') {
    // check if this is a folder
    let isDirectory = false;
    try {
      const stat = fs.lstatSync(originalImportFilePath);
      isDirectory = stat.isDirectory();
    } catch (e) {
      // doesn't exist
    }
    if (isDirectory) {
      // if it is, then add 'index.js'
      originalImportFilePathResolved = pathLib.join(
        originalImportFilePathParsed.dir,
        originalImportFilePathParsed.name,
        'index.js'
      );
    } else {
      // if not, then imply that the extension is a file with extension 'js'
      originalImportFilePathResolved = `${originalImportFilePathResolved}.js`;
    }
  }

  DEBUG &&
    console.log(
      'originalImportFilePathResolved',
      originalImportFilePathResolved
    );

  const originalImportFilePathResolvedParsed = pathLib.parse(
    originalImportFilePathResolved
  );
  DEBUG &&
    console.log(
      'originalImportFilePathResolved',
      JSON.stringify(originalImportFilePathResolvedParsed, null, 2)
    );

  const electronImportFilePath = pathLib.resolve(
    originalImportFilePathResolvedParsed.dir,
    `${originalImportFilePathResolvedParsed.name}.electron${originalImportFilePathResolvedParsed.ext}`
  );

  if (fs.existsSync(electronImportFilePath)) {
    DEBUG && console.log('******** Use: ', electronImportFilePath);
    const sourceFolder = pathLib.dirname(state.file.opts.filename);
    DEBUG && console.log('******** sourceFolder: ', sourceFolder);
    let relativeImportPath = pathLib.relative(
      sourceFolder,
      electronImportFilePath
    );
    if (
      !relativeImportPath.startsWith('/') &&
      !relativeImportPath.startsWith('../')
    ) {
      // ensure path starts with './'
      relativeImportPath = `./${relativeImportPath}`;
    }
    DEBUG && console.log('******** relativeImportPath: ', relativeImportPath);
    path.node.source.value = relativeImportPath;
  }
  // return path;
};

module.exports = function() {
  return {
    visitor: {
      ImportDeclaration: resolveImport,
    },
  };
};
