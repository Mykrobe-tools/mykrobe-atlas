const pathLib = require('path');
const fs = require('fs');
const debug = require('debug');
const d = debug('babel-plugin-electron-module-resolver');

// This plugin will modify imports and requires to resolve sources with a '.electron' suffix
// Only if process.PLATFORM === 'electron'

const resolvedPath = (source, state) => {
  if (process.env.PLATFORM !== 'electron') {
    return;
  }

  if (!source || typeof source !== 'string') {
    return;
  }

  // ignore anything which is not a relative import
  if (!source.startsWith('./') && !source.startsWith('../')) {
    return;
  }
  d('source', source);

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

  d('originalImportFilePathResolved', originalImportFilePathResolved);

  const originalImportFilePathResolvedParsed = pathLib.parse(
    originalImportFilePathResolved
  );
  d(
    'originalImportFilePathResolved',
    JSON.stringify(originalImportFilePathResolvedParsed, null, 2)
  );

  const electronImportFilePath = pathLib.resolve(
    originalImportFilePathResolvedParsed.dir,
    `${originalImportFilePathResolvedParsed.name}.electron${originalImportFilePathResolvedParsed.ext}`
  );

  if (fs.existsSync(electronImportFilePath)) {
    d('******** Use: ', electronImportFilePath);
    const sourceFolder = pathLib.dirname(state.file.opts.filename);
    d('******** sourceFolder: ', sourceFolder);
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
    d('******** relativeImportPath: ', relativeImportPath);
    return relativeImportPath;
  }
};

// See http://astexplorer.net/ for exploring AST

// import './module';

const importDeclaration = (path, state) => {
  const newPath = resolvedPath(path.node.source.value, state);
  if (newPath) {
    path.node.source.value = newPath;
  }
};

// require('./module');

const callExpression = (path, state) => {
  if (path.node.callee.name === 'require') {
    const newPath = resolvedPath(path.node.arguments[0].value, state);
    if (newPath) {
      path.node.arguments[0].value = newPath;
    }
  }
};

module.exports = function () {
  return {
    visitor: {
      ImportDeclaration: importDeclaration,
      CallExpression: callExpression,
    },
  };
};
