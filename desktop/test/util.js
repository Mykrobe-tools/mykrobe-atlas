/* @flow */

import os from 'os';
import path from 'path';
import fs from 'fs-extra';

export const pkg = require('../../package.json');

export const TIMEOUT = 30 * 60 * 1000; // 30 minutes (can take over 10 minutes in VM)

export const delay = (time: number): Promise<*> =>
  new Promise(resolve => setTimeout(resolve, time));

export const INCLUDE_SLOW_TESTS =
  process.env.INCLUDE_SLOW_TESTS && process.env.INCLUDE_SLOW_TESTS === 'true';

/* eslint-disable no-unused-vars */
const NOOP = (...args) => {};
/* eslint-enable no-unused-vars */

export const describeSlowTest = INCLUDE_SLOW_TESTS ? describe : xdescribe;
export const itSlow = INCLUDE_SLOW_TESTS ? it : xit;
export const beforeAllSlow = INCLUDE_SLOW_TESTS ? beforeAll : NOOP;
export const afterAllSlow = INCLUDE_SLOW_TESTS ? afterAll : NOOP;

export const arch = os.arch();
export const plat = os.platform();

export const ELECTRON_EXECUTABLE_PATH =
  plat === 'win32'
    ? path.join(__dirname, '../dist/win-unpacked', `${pkg.productName}.exe`)
    : path.join(
        __dirname,
        '../dist/mac',
        `${pkg.productName}.app`,
        `Contents/MacOS/${pkg.productName}`
      );

export const EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH = path.join(
  __dirname,
  '../../test/__fixtures__/exemplar_seqeuence_data'
);

export const EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH = path.join(
  EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
  '__test_artefacts__',
  `${plat}-${arch}`,
  'img'
);
export const EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH = path.join(
  EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
  '__test_artefacts__',
  `${plat}-${arch}`,
  'json'
);

export const ensureExemplarSamples = () => {
  const exists = fs.existsSync(EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH);
  if (!exists) {
    throw `No exemplar sequence data folder found at '${EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH}' - Please see README.md and download folder before running this test`;
  }
  fs.ensureDirSync(EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH);
  fs.ensureDirSync(EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH);
};

export const ensureMykrobeBinaries = () => {
  const binFolder = path.join(
    __dirname,
    `../resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
  );
  const executableName =
    plat === 'win32' ? 'mykrobe_atlas.exe' : 'mykrobe_atlas';
  const executablePath = path.join(binFolder, executableName);
  console.log(`Checking for existence of '${executablePath}'`);
  const exists = fs.existsSync(executablePath);

  // check for existence of binary and bail with error
  if (!exists) {
    throw `No executable found at '${executablePath}' - Please run 'yarn build-mykrobe-binaries' before running this test`;
  }
};

export const asLowerCase = (o: any) => {
  if (typeof o === 'string') {
    return o.toLowerCase();
  }
  if (Array.isArray(o)) {
    return o.map(value => asLowerCase(value));
  }
  return o;
};

export const expectCaseInsensitiveEqual = (a, b) => {
  expect(asLowerCase(a)).toEqual(asLowerCase(b));
};
