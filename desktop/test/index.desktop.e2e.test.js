/* @flow */

// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

// nb. version of spectron should map to version of electron https://github.com/electron-userland/spectron#version-map
import { Application } from 'spectron';
import fs from 'fs-extra';

import debug from 'debug';
const d = debug('mykrobe:desktop-test');

const path = require('path');

// const exemplarSamplesExpect = jest.requireActual(
//   `../../test/__fixtures__/exemplar_seqeuence_data.expect.jsons.json`
// );

const exemplarSamplesExpect = jest.requireActual(
  `../../test/__fixtures__/exemplar_seqeuence_data.expect.json`
);

import { executeCommand, fetchPredictorBinariesIfChanged } from '../util';

import {
  TIMEOUT,
  delay,
  describeSlowTest,
  beforeAllSlow,
  afterAllSlow,
  ensureExemplarSamples,
  ELECTRON_EXECUTABLE_PATH,
  fileNamesAndPathsForSource,
} from './util';

import createTestHelpers from './helpers';

import testOpenWindow from './testOpenWindow';
import testOpenSourceFile from './testOpenSourceFile';
import testDisplayResults from './testDisplayResults';

jest.setTimeout(TIMEOUT);

d('ELECTRON_EXECUTABLE_PATH', ELECTRON_EXECUTABLE_PATH);

describe('Desktop e2e', () => {
  it('should contain a test', (done) => {
    done();
  });
});

// prerequisites

if (process.env.DEBUG_PRODUCTION === '1') {
  throw 'process.env.DEBUG_PRODUCTION should be falsy when running index.desktop.e2e.test.js';
}

// this step is very slow - compiles desktop app and creates distribution images
// comment out while adjusting only tests

// describe('Desktop e2e package', () => {
//   it('should package app', async () => {
//     executeCommand('yarn desktop-package');
//   });
// });

// describeSlowTest('Desktop e2e dist', () => {
//   it('should create distribution app', async () => {
//     executeCommand('yarn desktop-dist --skip-notarize');
//   });
// });

let _app: Application;

describeSlowTest('Desktop e2e main window', function spec() {
  // these run even if test is excluded: https://github.com/facebook/jest/issues/4166

  beforeAllSlow(async () => {
    await fetchPredictorBinariesIfChanged();
    await ensureExemplarSamples();
    const logPath = path.join(__dirname, './logs');
    fs.ensureDirSync(logPath);
    const options = {
      path: ELECTRON_EXECUTABLE_PATH,
      webdriverLogPath: path.join(logPath, 'webdriver'),
      chromeDriverLogPath: path.join(logPath, 'chromedriver.log'),
    };
    d(`Creating Application with options`, options);
    _app = new Application(options);
    await _app.start();
  });

  afterAllSlow(async () => {
    if (_app && _app.isRunning()) {
      await _app.stop();
    }
  });

  it('should open window', async () => {
    await testOpenWindow(_app);
  });

  for (let i = 0; i < exemplarSamplesExpect.length; i++) {
    const exemplarSamplesExpectEntry = exemplarSamplesExpect[i];
    const source = exemplarSamplesExpectEntry.source;
    const { displayName } = fileNamesAndPathsForSource(source);

    it(`${displayName} - should start on front screen`, async () => {
      const { isExisting } = createTestHelpers(_app);
      // check existence of component
      expect(await isExisting('[data-tid="component-upload"]')).toBe(true);
      // check existence of button
      expect(await isExisting('[data-tid="button-analyse-sample"]')).toBe(true);
    });

    it(`${displayName} - should open source file`, async () => {
      d(`Opening source ${displayName}`);
      await testOpenSourceFile(source, exemplarSamplesExpectEntry, _app);
    });

    if (!exemplarSamplesExpectEntry.expect.reject) {
      it(`${displayName} - should display the expected results`, async () => {
        await testDisplayResults(source, exemplarSamplesExpectEntry, _app);
      });

      it(`${displayName} - should return to front screen`, async () => {
        const { isExisting } = createTestHelpers(_app);
        const { client } = _app;
        // new
        await client.click('[data-tid="button-file-new"]');
        await delay(500);
        // check existence of component
        expect(await isExisting('[data-tid="component-upload"]')).toBe(true);
      });
    }
  }
});
