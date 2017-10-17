import pathLib from 'path';
import fs from 'fs';

module.exports = function() {
  return {
    visitor: {
      ImportDeclaration: function(path, state) {
        // https://github.com/babel/babel/tree/master/packages/babel-types#timportdeclarationspecifiers-source

        // path.node has properties 'source' and 'specifiers' attached.
        // path.node.source is the library/module name, aka 'react-bootstrap'.
        // path.node.specifiers is an array of ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier

        var source = path.node.source.value;
        // This block handles relative paths, such as ./components, ../../components, etc.
        if (source.match(/^\.{0,2}\//)) {
          console.log('source', source);
          const filePath = pathLib.resolve(
            pathLib.dirname(state.file.opts.filename),
            source
          );
          const sourceFolder = pathLib.resolve(
            pathLib.dirname(state.file.opts.filename),
            pathLib.dirname(source)
          );
          const extension = pathLib.extname(source) || '.js';

          // TODO: here we should check if there is no extension and the import is a folder
          // if it is, then add 'index.js' and check for 'index.electron.js'
          // if not, then imply that the extension is a file with extension 'js'

          const basename = pathLib.parse(source).name;

          const electronFilePath = pathLib.resolve(
            sourceFolder,
            `${basename}.electron${extension}`
          );

          // node.source.value = cwd + '/' + node.source.value.slice(1);
          console.log('filePath', filePath);
          console.log('sourceFolder', sourceFolder);
          console.log('extension', extension);
          console.log('basename', basename);
          console.log('electronFilePath', electronFilePath);
          if (fs.existsSync(electronFilePath)) {
            console.log('Use: ', electronFilePath);
            console.log('source dirname', pathLib.dirname(source));
            const originalExtension = pathLib.extname(source);
            let pathElements = source.split('/');
            pathElements.pop();
            const importDir = pathElements.join('/');
            const electronImportPath = pathLib.join(
              importDir,
              `${basename}.electron${originalExtension}`
            );
            console.log('electronImportPath', electronImportPath);
          }
        }
      },
    },
  };
};
