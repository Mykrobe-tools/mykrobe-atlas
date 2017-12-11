// This will compile and run the production Electron app

// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

import { Application } from 'spectron';
import path from 'path';

import MykrobeConfig from '../app/services/MykrobeConfig';
import * as TargetConstants from '../app/constants/TargetConstants';
const config = new MykrobeConfig();

const pkg = require('../package.json');
const bamsExpect = require('../test/__fixtures__/bams.expect.json');

import {
  executeCommand,
  ensurePredictorBinaries,
  ensureBams,
  INCLUDE_SLOW_TESTS,
  ELECTRON_EXECUTABLE_PATH,
  BAM_FOLDER_PATH,
} from './util';

jest.setTimeout(10 * 60 * 1000); // 10 minutes

// prerequisites

ensurePredictorBinaries();
ensureBams();

describe('Desktop e2e prerequisites', () => {
  it('should package app', done => {
    executeCommand('yarn desktop-package');
    done();
  });
  INCLUDE_SLOW_TESTS &&
    it('should create distribution app', done => {
      executeCommand('yarn desktop-dist');
      done();
    });
});

console.log('ELECTRON_EXECUTABLE_PATH', ELECTRON_EXECUTABLE_PATH);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

INCLUDE_SLOW_TESTS &&
  describe('Desktop e2e main window', function spec() {
    const textForSelector = async selector => {
      const { client } = this.app;
      const { value } = await client.elements(selector);
      let result = [];
      for (let i = 0; i < value.length; i++) {
        const r = await client.elementIdText(value[i].ELEMENT);
        result.push(r.value.toLowerCase());
      }
      return result.length > 1 ? result : result[0];
    };

    beforeAll(async () => {
      this.app = new Application({
        path: ELECTRON_EXECUTABLE_PATH,
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

    for (let i = 0; i < bamsExpect.length; i++) {
      const bamsExpectEntry = bamsExpect[i];
      const extension = bamsExpectEntry.source
        .substr(bamsExpectEntry.source.lastIndexOf('.') + 1)
        .toLowerCase();
      const isJson = extension === 'json';

      it(`should open source file ${bamsExpectEntry.source}`, async done => {
        const { client, webContents } = this.app;
        const filePath = path.join(BAM_FOLDER_PATH, bamsExpectEntry.source);

        // check existence of component
        expect(await client.isExisting('[data-tid="component-upload"]')).toBe(
          true
        );

        // check existence of button
        expect(
          await client.isExisting('[data-tid="button-analyse-sample"]')
        ).toBe(true);

        // send file > open event
        webContents.send('open-file', filePath);

        if (!isJson) {
          // await UI change
          await delay(500);

          // check existence of cancel button
          expect(
            await client.isExisting('[data-tid="button-analyse-cancel"]')
          ).toBe(true);

          // check status text
          expect(
            (await client
              .element('[data-tid="status-text"]')
              .getText()).toLowerCase()
          ).toBe('analysing');

          // TODO check for progress changes once reinstated
        }
        // wait for results to appear
        expect(
          await client.waitForVisible(
            '[data-tid="component-resistance"]',
            10 * 60 * 1000
          )
        ).toBe(true);

        done();
      });

      it('should display the expected results', async () => {
        const { client } = this.app;

        // click each section and check the result shown in the UI

        // drugs or class

        if (TargetConstants.SPECIES_TB === config.species) {
          await client.click('[data-tid="button-resistance-drugs"]');
          expect(
            await client.waitForVisible(
              '[data-tid="component-resistance-drugs"]'
            )
          ).toBe(true);
          const firstLineDrugs = await textForSelector(
            '[data-tid="panel-first-line-drugs"] [data-tid="drug"]'
          );
          expect(firstLineDrugs).toEqual(
            bamsExpectEntry.expect.drugs.firstLineDrugs
          );
          const secondLineDrugs = await textForSelector(
            '[data-tid="panel-second-line-drugs"] [data-tid="drug"]'
          );
          expect(secondLineDrugs).toEqual(
            bamsExpectEntry.expect.drugs.secondLineDrugs
          );
        } else {
          await client.click('[data-tid="button-resistance-class"]');
          expect(
            await client.waitForVisible(
              '[data-tid="component-resistance-class"]'
            )
          ).toBe(true);
        }

        // evidence

        await client.click('[data-tid="button-resistance-evidence"]');
        expect(
          await client.waitForVisible(
            '[data-tid="component-resistance-evidence"]'
          )
        ).toBe(true);

        const evidenceDrugs = Object.keys(bamsExpectEntry.expect.evidence);
        for (let drug in evidenceDrugs) {
          const evidence = await textForSelector(
            `[data-tid="panel-${drug}"] [data-tid="evidence"]`
          );
          expect(evidence).toEqual(bamsExpectEntry.expect.evidence[drug]);
        }

        // species

        await client.click('[data-tid="button-resistance-species"]');
        expect(
          await client.waitForVisible(
            '[data-tid="component-resistance-species"]'
          )
        ).toBe(true);
        const species = await textForSelector('[data-tid="species"]');
        expect(species).toEqual(bamsExpectEntry.expect.species);

        // all

        await client.click('[data-tid="button-resistance-all"]');
        expect(
          await client.waitForVisible('[data-tid="component-resistance-all"]')
        ).toBe(true);
        const susceptible = await textForSelector(
          '[data-tid="column-susceptible"] [data-tid="drug"]'
        );
        expect(susceptible).toEqual(bamsExpectEntry.expect.all.susceptible);
        const resistant = await textForSelector(
          '[data-tid="column-resistant"] [data-tid="drug"]'
        );
        expect(resistant).toEqual(bamsExpectEntry.expect.all.resistant);

        // new

        await client.click('[data-tid="button-file-new"]');
        await delay(500);

        // check existence of component
        expect(await client.isExisting('[data-tid="component-upload"]')).toBe(
          true
        );
      });
    }
  });
