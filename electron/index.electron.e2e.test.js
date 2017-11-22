// This will compile and run the production Electron app

// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

import { Application } from 'spectron';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';

const pkg = require('../package.json');

import { executeCommand } from './util';

const arch = os.arch();
const plat = os.platform();

const INCLUDE_SLOW_TESTS =
  process.env.INCLUDE_SLOW_TESTS && process.env.INCLUDE_SLOW_TESTS === 'true';

jest.setTimeout(10 * 60 * 1000); // 10 minutes?

// prerequisites

const binFolder = path.join(
  __dirname,
  `resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
);
const executableName =
  plat === 'win32' ? 'mykrobe_predictor.exe' : 'mykrobe_predictor';
const executablePath = path.join(binFolder, executableName);
console.log(`Checking for existence of '${executablePath}'`);
const exists = fs.existsSync(executablePath);

// check for existence of binary and bail with error
if (!exists) {
  throw `No executable found at '${
    executablePath
  }' - Please run 'yarn build-predictor-binaries' before running this test`;
}

describe('Electron e2e prerequisites', () => {
  it('should package app', done => {
    executeCommand('yarn electron-package');
    done();
  });
});

let electronPath;

if (plat === 'win32') {
  electronPath = path.join(
    __dirname,
    'release',
    `${plat}-${arch}`,
    `${pkg.productName}-${plat}-${arch}`,
    `${pkg.productName}.exe`
  );
} else {
  electronPath = path.join(
    __dirname,
    'release',
    `${plat}-${arch}`,
    `${pkg.productName}-${plat}-${arch}`,
    `${pkg.productName}.app`,
    `Contents/MacOS/${pkg.productName}`
  );
}

console.log('electronPath', electronPath);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

INCLUDE_SLOW_TESTS &&
  describe('Electron e2e main window', function spec() {
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
      expect(title).toBe(pkg.productName);

      const isDevToolsOpened = await browserWindow.isDevToolsOpened();
      expect(isDevToolsOpened).toBeFalsy();

      const isMinimized = await browserWindow.isMinimized();
      expect(isMinimized).toBeFalsy();

      const isVisible = await browserWindow.isVisible();
      expect(isVisible).toBeTruthy();

      const isFocused = await browserWindow.isFocused();
      expect(isFocused).toBeTruthy();

      const bounds = await browserWindow.getBounds();
      console.log('bounds', bounds);
      expect(bounds.width).toBeGreaterThanOrEqual(640);
      expect(bounds.height).toBeGreaterThanOrEqual(480);
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
