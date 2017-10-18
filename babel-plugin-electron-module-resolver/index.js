/* @flow */

import pathLib from 'path';
import fs from 'fs';

const resolveImport = (path, state) => {
  // https://github.com/babel/babel/tree/master/packages/babel-types#timportdeclarationspecifiers-source

  // path.node has properties 'source' and 'specifiers' attached.
  // path.node.source is the library/module name, aka 'react-bootstrap'.
  // path.node.specifiers is an array of ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier

  var source = path.node.source.value;
  console.log('source', source);
  // ignore anything which is not a relative import
  if (!source.startsWith('./') && !source.startsWith('../')) {
    return;
  }

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
      originalImportFilePathResolved = path.join(
        originalImportFilePathParsed.dir,
        originalImportFilePathParsed.name,
        'index.js'
      );
    } else {
      // if not, then imply that the extension is a file with extension 'js'
      originalImportFilePathResolved = `${originalImportFilePathResolved}.js`;
    }
  }

  console.log('originalImportFilePathResolved', originalImportFilePathResolved);

  const originalImportFilePathResolvedParsed = pathLib.parse(
    originalImportFilePathResolved
  );
  console.log(
    'originalImportFilePathResolved',
    JSON.stringify(originalImportFilePathResolvedParsed, null, 2)
  );

  const electronImportFilePath = pathLib.resolve(
    originalImportFilePathResolvedParsed.dir,
    `${originalImportFilePathResolvedParsed.name}.electron${originalImportFilePathResolvedParsed.ext}`
  );

  if (fs.existsSync(electronImportFilePath)) {
    console.log('******** Use: ', electronImportFilePath);
    const sourceFolder = pathLib.dirname(state.file.opts.filename);
    console.log('******** sourceFolder: ', sourceFolder);
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
    console.log('******** relativeImportPath: ', relativeImportPath);
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
