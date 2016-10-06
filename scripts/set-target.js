require('babel-polyfill');

const inquirer = require('inquirer');
const targets = require('../targets.json');
const rootPackageJson = require('../package.json');
const fs = require('fs-extra');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const defaultTargetName = rootPackageJson.targetName || targets[0].value;

const questions = [
  {
    name: 'targetName',
    type: 'list',
    message: 'Select target app',
    default: defaultTargetName,
    choices: targets
  }
];

let targetName = argv.value || argv.v || false;

if (targetName) {
  setTarget(targetName);
}
else {
  inquirer.prompt(questions).then((results) => {
    const targetName = results.targetName;
    setTarget(targetName);
  });
}

function setTarget(targetName) {
  let productName = '';
  let appVersion = '';
  let appDisplayVersion = '';
  let appId = '';
  let json = '';
  let filePath = '';
  let isValidTarget = false;
  for (let i = 0; i < targets.length; i++) {
    if (targetName === targets[i].value) {
      productName = targets[i].name;
      appVersion = targets[i].version;
      appDisplayVersion = targets[i].displayVersion;
      appId = targets[i].appId;
      isValidTarget = true;
    }
  }

  if (!isValidTarget) {
    return console.error(`Target with value '${targetName}' not found in targets.json`);
  }

  const electronHtmlPath = path.resolve(__dirname, '../app/electron.html');
  const webHtmlPath = path.resolve(__dirname, '../app/web.html');

  // change the bundled settings in /package.json
  rootPackageJson.targetName = targetName;
  rootPackageJson.productName = productName;
  rootPackageJson.version = appVersion;
  rootPackageJson.displayVersion = appDisplayVersion;
  rootPackageJson.build.appId = appId;
  json = JSON.stringify(rootPackageJson, null, 2);
  filePath = path.resolve(__dirname, '../package.json');
  writeJsonToFile(filePath, json)
  .then(() => {
    return setTitleInHtmlFile(electronHtmlPath, productName);
  })
  .then(() => {
    return setTitleInHtmlFile(webHtmlPath, productName);
  })
  .then(() => {
    const filePath = path.resolve(__dirname, `../app/css/target/${targetName}.css`);
    const copyPath = path.resolve(__dirname, '../app/css/target/current.css');
    return copyFile(filePath, copyPath);
  })
  .then(() => {
    console.log(`Target changed to ${productName}`);
  })
  .catch((err) => {
    return console.error(err);
  });
}

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

function copyFile(filePath, copyPath) {
  return new Promise((resolve, reject) => {
    let stat = false;
    try {
      stat = fs.statSync(copyPath);
    }
    catch (err) {
    }
    if (stat) {
      fs.unlink(copyPath);
    }
    fs.copySync(filePath, copyPath);
    resolve();
  });
}
