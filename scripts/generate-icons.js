/* @flow */

import debug from 'debug';
const d = debug('mykrobe:scripts:generate-icons');

const path = require('path');

import { executeCommand } from '../desktop/util';

export const generateIconsMac = async (iconPath) => {
  d('generateIconsMac');
  const sizes = [16, 32, 128, 256, 512];
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];

    const sizeRetina = size * 2;
    const filenameBase = `icon_${size}x${size}`;
    const filename = `${filenameBase}.png`;
    const filenameRetina = `${filenameBase}@2x.png`;
    const outputPath = path.join(iconPath, 'icon.iconset', filename);
    const outputPathRetina = path.join(
      iconPath,
      'icon.iconset',
      filenameRetina
    );
    const pdfPath = path.join(iconPath, 'icon.pdf');

    const command = `gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r72 -dPDFFitPage=true -g${size}x${size} -sOutputFile="${outputPath}" "${pdfPath}"`;
    const commandRetina = `gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r72 -dPDFFitPage=true -g${sizeRetina}x${sizeRetina} -sOutputFile="${outputPathRetina}" "${pdfPath}"`;

    await executeCommand(command);
    await executeCommand(commandRetina);
  }

  // create icns once the other sizes are created
  const icnsPath = path.join(iconPath, 'icon.icns');
  const iconsetPath = path.join(iconPath, 'icon.iconset');
  const command = `iconutil -c icns -o "${icnsPath}" "${iconsetPath}"`;
  await executeCommand(command);
};

export const generateIconsWindows = async (iconPath) => {
  const pngPath = path.join(iconPath, 'icon.iconset', 'icon_512x512@2x.png');
  const icoPath = path.join(iconPath, 'icon.ico');
  const command = `/usr/local/bin/convert "${pngPath}" -define icon:auto-resize=256,128,96,64,48,32,16 "${icoPath}"`;
  await executeCommand(command);
};

export const generateIcons = async () => {
  const targets = ['atlas-tb', 'desktop'];
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const iconPath = path.resolve(
      __dirname,
      `../desktop/resources/icon/${target}`
    );
    // generate mac, then windows which is using the generated mac pngs
    await generateIconsMac(iconPath);
    await generateIconsWindows(iconPath);
  }
};

(async () => {
  await generateIcons();
})();
