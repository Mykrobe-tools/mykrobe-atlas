// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

import { Application } from 'spectron';
import path from 'path';
import os from 'os';
const pkg = require('../package.json');

import { executeCommand } from './util';

const INCLUDE_SLOW_TESTS =
  process.env.INCLUDE_SLOW_TESTS && process.env.INCLUDE_SLOW_TESTS === 'true';

jest.setTimeout(10 * 60 * 1000); // 10 minutes?

describe('Electron e2e prerequisites', () => {
  it('should have a binary available', done => {
    // build
    // executeCommand('yarn build-predictor-binaries');
    // TODO check for existence of binary and bail with error
    done();
  });

  it('should package app', done => {
    executeCommand('yarn electron-package');
    done();
  });
});

const arch = os.arch();
const platform = os.platform();
const productName = pkg.productName;

// TODO test on Windows - this is currently MacOS specific
const electronPath = path.join(
  __dirname,
  'release',
  `${platform}-${arch}`,
  `${productName}-${platform}-${arch}`,
  `${productName}.app`,
  `Contents/MacOS/${productName}`
);

console.log('electronPath', electronPath);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

INCLUDE_SLOW_TESTS &&
  describe('Electron e2e main window', () => {
    beforeAll(async () => {
      this.app = new Application({
        path: electronPath,
      });

      return this.app.start();
    });

    afterAll(() => {
      if (this.app && this.app.isRunning()) {
        return this.app.stop();
      }
    });

    it('should open window', async () => {
      const { client, browserWindow } = this.app;

      await client.waitUntilWindowLoaded();
      await delay(500);
      const title = await browserWindow.getTitle();
      expect(title).toBe(productName);
    });

    it("should haven't any logs in console of main window", async () => {
      const { client } = this.app;
      const logs = await client.getRenderProcessLogs();
      // Print renderer process logs
      logs.forEach(log => {
        console.log(log.message);
        console.log(log.source);
        console.log(log.level);
      });
      expect(logs).toHaveLength(0);
    });
  });
