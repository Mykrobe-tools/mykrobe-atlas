require('babel-polyfill');

const inquirer = require('inquirer');
const targets = require('./targets.json');
const rootPackageJson = require('../package.json');
const staticPackageJson = require('../static/package.json');
const fs = require('fs');
const path = require('path');

const defaultTargetName = staticPackageJson.targetName || targets[0].value;

const questions = [
  {
    name: 'targetName',
    type: 'list',
    message: 'Select target app',
    default: defaultTargetName,
    choices: targets
  }
];

console.log('questions', JSON.stringify(questions, null, 2));
console.log('targets', JSON.stringify(targets, null, 2));
console.log('defaultTargetName', defaultTargetName);

inquirer.prompt(questions).then((results) => {
  console.log('results', JSON.stringify(results, null, 2));
  // results.targetName

  const targetName = results.targetName;
  let appName = '';
  let appVersion = '';
  let appDisplayVersion = '';
  let appId = '';
  let json = '';
  let filePath = '';
  for (let i = 0; i < targets.length; i++) {
    if (targetName === targets[i].value) {
      appName = targets[i].name;
      appVersion = targets[i].version;
      appDisplayVersion = targets[i].displayVersion;
      appId = targets[i].appId;
    }
  }

  // change the build settings in /package.json
  staticPackageJson.targetName = targetName;
  staticPackageJson.productName = appName;
  staticPackageJson.version = appVersion;
  staticPackageJson.displayVersion = appDisplayVersion;
  json = JSON.stringify(staticPackageJson, null, 2);
  filePath = path.resolve(__dirname, '../static/package.json');
  fs.writeFile(filePath, json, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('JSON saved to ', filePath);
    }
  });

  rootPackageJson.targetName = targetName;
  rootPackageJson.productName = appName;
  rootPackageJson.version = appVersion;
  rootPackageJson.displayVersion = appDisplayVersion;
  rootPackageJson.build.appId = appId;
  json = JSON.stringify(rootPackageJson, null, 2);
  filePath = path.resolve(__dirname, '../package.json');
  fs.writeFile(filePath, json, (err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('JSON saved to ', filePath);
    }
  });
});
