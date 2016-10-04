require('babel-polyfill');

const targets = require('../targets.json');
const path = require('path');
const exec = require('child_process').exec;

let promises = [];
targets.forEach((target, index) => {
  const iconPath = path.resolve(__dirname, `../electron/resources/icon/${target.value}`);
  // generate mac, then windows which is using the generated mac pngs
  promises.push(generateIconsMac(iconPath).then(() => {
    generateIconsWindows(iconPath);
  }));
});

Promise.all(promises).then(() => {
  console.log('done');
})
.catch((err) => {
  console.error(err);
});

function generateIconsMac(iconPath) {
  let promises = [];
  const sizes = [16, 32, 128, 256, 512];
  sizes.forEach((size, index) => {
    let sizeRetina = size * 2;
    let filenameBase = `icon_${size}x${size}`;
    let filename = `${filenameBase}.png`;
    let filenameRetina = `${filenameBase}@2x.png`;
    let outputPath = path.join(iconPath, 'icon.iconset', filename);
    let outputPathRetina = path.join(iconPath, 'icon.iconset', filenameRetina);
    let pdfPath = path.join(iconPath, 'icon.pdf');

    let command = `gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r72 -dPDFFitPage=true -g${size}x${size} -sOutputFile="${outputPath}" "${pdfPath}"`;
    let commandRetina = `gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r72 -dPDFFitPage=true -g${sizeRetina}x${sizeRetina} -sOutputFile="${outputPathRetina}" "${pdfPath}"`;

    promises.push(execute(command));
    promises.push(execute(commandRetina));
  });
  let icnsPath = path.join(iconPath, 'icon.icns');
  let iconsetPath = path.join(iconPath, 'icon.iconset');
  let command = 'iconutil -c icns -o "' + icnsPath + '" "' + iconsetPath + '"';

  // create icns once the other sizes are created
  return Promise.all(promises).then(() => {
    execute(command);
  });
}

function generateIconsWindows(iconPath) {
  let pngPath = path.join(iconPath, 'icon.iconset', 'icon_512x512@2x.png');
  let icoPath = path.join(iconPath, 'icon.ico');
  let command = `/usr/local/bin/convert "${pngPath}" -define icon:auto-resize=256,128,96,64,48,32,16 "${icoPath}"`;
  return execute(command);
}

function execute(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout);
    });
  });
}

/*
exec('cat *.js bad_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
*/
