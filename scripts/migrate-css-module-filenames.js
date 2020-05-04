/* @flow */

const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));
const debug = require('debug');
const d = debug('ms:scripts:migrate-css-module-filenames');

const WRITE = argv.write ? true : false;
const SRC = argv.src || path.join(__dirname, '../src');

if (!WRITE) {
  console.error('Please specify --src <folder>');
}

if (!WRITE) {
  d('Dry run, not writing changes');
}

const includesGlobal = (file) => file.includes('.global.');

const migrateFile = (file) => {
  const elements = file.split('.');
  const preExtension = elements[elements.length - 2];
  if (preExtension === 'global') {
    elements.splice(elements.length - 2, 1);
  } else if (preExtension !== 'module') {
    elements.splice(elements.length - 1, 0, 'module');
  }
  return elements.join('.');
};

const migrateFiles = (files) => {
  files.forEach((file) => {
    const newFile = migrateFile(file);
    if (file !== newFile) {
      d(`Renaming "${file}" to "${newFile}"`);
      if (WRITE) {
        fs.renameSync(file, newFile);
      }
    } else {
      d(`Not renaming "${file}"`);
    }
  });
};

const allCssFiles = glob.sync(path.join(SRC, '**/*.{css,scss,sass}'));

const allJsFiles = glob.sync(path.join(SRC, '**/*.{js,jsx}'));

const allCssFilesModule = allCssFiles.filter((file) => !includesGlobal(file));
const allCssFilesGlobal = allCssFiles.filter(includesGlobal);

// migrate .global files last to avoid file name collisions
migrateFiles(allCssFilesModule);
migrateFiles(allCssFilesGlobal);

// capture e.g. import styles from './Component.scss';
const regex = /(import .+ from ["'])(.*\.(scss|sass|css))(["'].*$)/gim;

allJsFiles.forEach((file) => {
  const fileContents = fs.readFileSync(file).toString();
  const newFileContents = fileContents.replace(
    regex,
    (match, capture1, capture2, capture3, capture4) => {
      const newFile = migrateFile(capture2);
      const replacement = `${capture1}${newFile}${capture4}`;
      if (match !== replacement) {
        d(`Replacing \`${match}\` with \`${replacement}\``);
      } else {
        d(`Not replacing \`${match}\``);
      }
      return replacement;
    }
  );
  if (WRITE) {
    fs.writeFileSync(file, newFileContents);
  }
});

d(
  '*** imports within sass/css files remain untouched and may still need to be updated ***'
);

if (WRITE) {
  d('Stylesheets renamed, js imports updated');
} else {
  d('Dry run, no changes made. To write changes run again with --write');
}
