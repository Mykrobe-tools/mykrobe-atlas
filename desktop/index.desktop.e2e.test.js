// This will compile and run the production Electron app

// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

import { Application } from 'spectron';
import path from 'path';

import MykrobeConfig from '../app/services/MykrobeConfig';
import * as TargetConstants from '../app/constants/TargetConstants';
const config = new MykrobeConfig();

const DEBUG = true;

const pkg = require('../package.json');
const exemplarSamplesExpect = require('../test/__fixtures__/exemplar-samples.expect.json');

import {
  executeCommand,
  ensurePredictorBinaries,
  ensureExemplarSamples,
  INCLUDE_SLOW_TESTS,
  ELECTRON_EXECUTABLE_PATH,
  EXEMPLAR_SAMPLES_FOLDER_PATH,
  expectCaseInsensitiveEqual,
} from './util';

jest.setTimeout(10 * 60 * 1000); // 10 minutes

// prerequisites

ensurePredictorBinaries();
ensureExemplarSamples();

describe('Desktop e2e prerequisites', () => {
  it('should package app', async () => {
    executeCommand('yarn desktop-package');
  });
  INCLUDE_SLOW_TESTS &&
    it('should create distribution app', async () => {
      executeCommand('yarn desktop-dist');
    });
});

console.log('ELECTRON_EXECUTABLE_PATH', ELECTRON_EXECUTABLE_PATH);

const delay = time => new Promise(resolve => setTimeout(resolve, time));

INCLUDE_SLOW_TESTS &&
  describe('Desktop e2e main window', function spec() {
    const textForSelector = async (selector, asArray = true) => {
      const { client } = this.app;
      const { value } = await client.elements(selector);
      let result = [];
      for (let i = 0; i < value.length; i++) {
        const r = await client.elementIdText(value[i].ELEMENT);
        result.push(r.value);
      }
      return asArray || result.length > 1 ? result : result[0];
    };

    // convenience to tell us which element wasn't found

    const isExisting = async selector => {
      const { client } = this.app;
      const existing = await client.isExisting(selector);
      if (!existing) {
        throw `Element not found for selector ${selector}`;
      }
      return existing;
    };

    // these run even if test is excluded: https://github.com/facebook/jest/issues/4166

    beforeAll(async () => {
      this.app = new Application({
        path: ELECTRON_EXECUTABLE_PATH,
      });

      await this.app.start();
    });

    afterAll(async () => {
      console.log('Quitting app');
      if (this.app && this.app.isRunning()) {
        await this.app.stop();
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

    for (let i = 0; i < exemplarSamplesExpect.length; i++) {
      const exemplarSamplesExpectEntry = exemplarSamplesExpect[i];
      const extension = exemplarSamplesExpectEntry.source
        .substr(exemplarSamplesExpectEntry.source.lastIndexOf('.') + 1)
        .toLowerCase();
      const isJson = extension === 'json';

      it(`should open source file ${
        exemplarSamplesExpectEntry.source
      }`, async () => {
        const { client, webContents } = this.app;
        const filePath = path.join(
          EXEMPLAR_SAMPLES_FOLDER_PATH,
          exemplarSamplesExpectEntry.source
        );

        // check existence of component
        expect(await isExisting('[data-tid="component-upload"]')).toBe(true);

        // check existence of button
        expect(await isExisting('[data-tid="button-analyse-sample"]')).toBe(
          true
        );

        // send file > open event
        webContents.send('open-file', filePath);

        if (!isJson) {
          // await UI change
          await delay(500);

          // check existence of cancel button
          expect(await isExisting('[data-tid="button-analyse-cancel"]')).toBe(
            true
          );

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
          expectCaseInsensitiveEqual(
            firstLineDrugs,
            exemplarSamplesExpectEntry.expect.drugs.firstLineDrugs
          );
          DEBUG &&
            console.log(
              'firstLineDrugs',
              JSON.stringify(firstLineDrugs, null, 2)
            );
          const secondLineDrugs = await textForSelector(
            '[data-tid="panel-second-line-drugs"] [data-tid="drug"]'
          );
          expectCaseInsensitiveEqual(
            secondLineDrugs,
            exemplarSamplesExpectEntry.expect.drugs.secondLineDrugs
          );
          DEBUG &&
            console.log(
              'secondLineDrugs',
              JSON.stringify(secondLineDrugs, null, 2)
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

        const evidenceDrugs = Object.keys(
          exemplarSamplesExpectEntry.expect.evidence
        );
        DEBUG &&
          console.log('evidenceDrugs', JSON.stringify(evidenceDrugs, null, 2));

        for (let i = 0; i < evidenceDrugs.length; i++) {
          const drug = evidenceDrugs[i].toLowerCase();
          const evidence = await textForSelector(
            `[data-tid="panel-${drug}"] [data-tid="evidence"]`
          );
          // expectCaseInsensitiveEqual(
          //   evidence,
          //   exemplarSamplesExpectEntry.expect.evidence[drug]
          // );
          DEBUG &&
            console.log(`evidence[${drug}]`, JSON.stringify(evidence, null, 2));
        }

        // species

        await client.click('[data-tid="button-resistance-species"]');
        expect(
          await client.waitForVisible(
            '[data-tid="component-resistance-species"]'
          )
        ).toBe(true);
        const species = await textForSelector('[data-tid="species"]', false);
        expectCaseInsensitiveEqual(
          species,
          exemplarSamplesExpectEntry.expect.species
        );
        DEBUG && console.log('species', JSON.stringify(species, null, 2));

        // all

        await client.click('[data-tid="button-resistance-all"]');
        expect(
          await client.waitForVisible('[data-tid="component-resistance-all"]')
        ).toBe(true);
        const susceptible = await textForSelector(
          '[data-tid="column-susceptible"] [data-tid="drug"]'
        );
        expectCaseInsensitiveEqual(
          susceptible,
          exemplarSamplesExpectEntry.expect.all.susceptible
        );
        DEBUG &&
          console.log('susceptible', JSON.stringify(susceptible, null, 2));

        const resistant = await textForSelector(
          '[data-tid="column-resistant"] [data-tid="drug"]'
        );
        expectCaseInsensitiveEqual(
          resistant,
          exemplarSamplesExpectEntry.expect.all.resistant
        );
        DEBUG && console.log('resistant', JSON.stringify(resistant, null, 2));

        // new

        await client.click('[data-tid="button-file-new"]');
        await delay(500);

        // check existence of component
        expect(await isExisting('[data-tid="component-upload"]')).toBe(true);
      });
    }
  });
