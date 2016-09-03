require('babel-polyfill');

const inquirer = require('inquirer');
const targets = require('../targets.json');
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

inquirer.prompt(questions).then((results) => {
  const targetName = results.targetName;
  let productName = '';
  let appVersion = '';
  let appDisplayVersion = '';
  let appId = '';
  let json = '';
  let filePath = '';
  for (let i = 0; i < targets.length; i++) {
    if (targetName === targets[i].value) {
      productName = targets[i].name;
      appVersion = targets[i].version;
      appDisplayVersion = targets[i].displayVersion;
      appId = targets[i].appId;
    }
  }

  const devHtmlPath = path.resolve(__dirname, '../app/app.html');
  const staticHtmlPath = path.resolve(__dirname, '../static/app.html');

  // change the bundled settings in /static/package.json
  staticPackageJson.targetName = targetName;
  staticPackageJson.productName = productName;
  staticPackageJson.version = appVersion;
  staticPackageJson.displayVersion = appDisplayVersion;
  json = JSON.stringify(staticPackageJson, null, 2);
  filePath = path.resolve(__dirname, '../static/package.json');

  writeJsonToFile(filePath, json)
  .then(() => {
    rootPackageJson.targetName = targetName;
    rootPackageJson.productName = productName;
    rootPackageJson.version = appVersion;
    rootPackageJson.displayVersion = appDisplayVersion;
    rootPackageJson.build.appId = appId;
    json = JSON.stringify(rootPackageJson, null, 2);
    filePath = path.resolve(__dirname, '../package.json');
    writeJsonToFile(filePath, json);
  })
  .then(() => {
    setTitleInHtmlFile(devHtmlPath, productName);
  })
  .then(() => {
    setTitleInHtmlFile(staticHtmlPath, productName);
  })
  .then(() => {
    console.log(`Target changed to ${productName}`);
  })
  .catch((err) => {
    return console.log(err);
  });
});

function writeJsonToFile(filePath, json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, json, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function setTitleInHtmlFile(filePath, title) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      const html = data.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}<\/title>`);
      fs.writeFile(filePath, html, 'utf8', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}
