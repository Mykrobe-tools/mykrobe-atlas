// This will compile and run the production Electron app

// we mock 'electron' for other tests but want to actually use it here
jest.unmock('electron');

import { Application } from 'spectron';
import path from 'path';
import fs from 'fs-extra';

import * as TargetConstants from '../app/constants/TargetConstants';

const TIMEOUT = 30 * 60 * 1000; // 30 minutes (can take over 10 minutes in VM)
const DEBUG = true;

const pkg = require('../package.json');
const exemplarSamplesExpect = require('../test/__fixtures__/exemplar_seqeuence_data.expect.json');

import {
  executeCommand,
  ensureMykrobeBinaries,
  ensureExemplarSamples,
  INCLUDE_SLOW_TESTS,
  ELECTRON_EXECUTABLE_PATH,
  EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
  EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH,
  expectCaseInsensitiveEqual,
} from './util';

jest.setTimeout(TIMEOUT);

describe('Desktop e2e', () => {
  it('should contain a test', done => {
    done();
  });
});

// prerequisites

if (process.env.DEBUG_PRODUCTION === '1') {
  throw 'process.env.DEBUG_PRODUCTION should be falsy when running index.desktop.e2e.test.js';
}

ensureMykrobeBinaries();
ensureExemplarSamples();

// this step is very slow - compiles desktop app and creates distribution images
// comment out while adjusting only tests

// describe('Desktop e2e prerequisites', () => {
//   it('should package app', async () => {
//     executeCommand('yarn desktop-package');
//   });
//   INCLUDE_SLOW_TESTS &&
//     it('should create distribution app', async () => {
//       executeCommand('yarn desktop-dist');
//     });
// });

console.log('ELECTRON_EXECUTABLE_PATH', ELECTRON_EXECUTABLE_PATH);

const delay = time => new Promise(resolve => setTimeout(resolve, time));
let _app;

INCLUDE_SLOW_TESTS &&
  describe('Desktop e2e main window', function spec() {
    const textForSelector = async (selector, asArray = true) => {
      const { client } = _app;
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
      const { client } = _app;
      const existing = await client.isExisting(selector);
      if (!existing) {
        throw `Element not found for selector ${selector}`;
      }
      return existing;
    };

    // convenience to save screenshot

    const saveScreenshot = async filename => {
      // browserWindow.capturePage() is not reliable
      // so we capture screen within browser process
      const { webContents } = _app;
      const filePath = path.join(
        EXEMPLAR_SEQUENCE_DATA_ARTEFACT_IMG_FOLDER_PATH,
        filename
      );
      fs.ensureDirSync(path.dirname(filePath));
      webContents.send('capture-page', filePath);
    };

    // these run even if test is excluded: https://github.com/facebook/jest/issues/4166

    beforeAll(async () => {
      if (INCLUDE_SLOW_TESTS) {
        _app = new Application({
          path: ELECTRON_EXECUTABLE_PATH,
        });

        await _app.start();
      }
    });

    afterAll(async () => {
      if (INCLUDE_SLOW_TESTS) {
        console.log('Quitting app');
        if (_app && _app.isRunning()) {
          await _app.stop();
        }
      }
    });

    it('should open window', async () => {
      const { client, browserWindow } = _app;

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

      const bounds = await browserWindow.getContentBounds();

      expect(bounds.width).toBeGreaterThanOrEqual(640);
      expect(bounds.height).toBeGreaterThanOrEqual(480);

      // make large enough to see 'evidence' tab in screen grab
      await browserWindow.setContentSize(1024, 1024);
      await browserWindow.center();
    });

    for (let i = 0; i < exemplarSamplesExpect.length; i++) {
      const exemplarSamplesExpectEntry = exemplarSamplesExpect[i];
      for (let j = 0; j < exemplarSamplesExpectEntry.source.length; j++) {
        const source = exemplarSamplesExpectEntry.source[j];
        const extension = source
          .substr(source.lastIndexOf('.') + 1)
          .toLowerCase();
        const isJson = extension === 'json';

        it(`${source} - should open source file`, async () => {
          const { client, webContents } = _app;
          const filePath = path.join(
            EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
            source
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
          if (exemplarSamplesExpectEntry.expect.reject) {
            console.log('awaiting rejection');
            console.log(
              'exemplarSamplesExpectEntry.expect',
              JSON.stringify(exemplarSamplesExpectEntry.expect, null, 2)
            );
            // should display an error notification rejecting this file
            await client.waitForVisible(
              '[data-tid="component-notification-content"]',
              TIMEOUT
            );
            const notifications = await textForSelector(
              '[data-tid="component-notification-content"]'
            );
            await saveScreenshot(`${source}__rejection__.png`);
            expect(
              notifications[0].includes(
                'does not give susceptibility predictions'
              )
            ).toBeTruthy();
          } else {
            // wait for results to appear
            await client.waitForVisible(
              '[data-tid="component-resistance"]',
              TIMEOUT
            );
          }
        });

        if (!exemplarSamplesExpectEntry.expect.reject) {
          it(`${source} - should display the expected results`, async () => {
            const { client } = _app;

            // click each section and check the result shown in the UI

            // drugs or class

            if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
              await client.click('[data-tid="button-resistance-drugs"]');
              expect(
                await client.waitForVisible(
                  '[data-tid="component-resistance-drugs"]'
                )
              ).toBe(true);
              await saveScreenshot(`${source}__resistance-drugs.png`);
              if (exemplarSamplesExpectEntry.expect.drugs) {
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
                if (exemplarSamplesExpectEntry.expect.drugs.resistance) {
                  const resistance = await textForSelector(
                    '[data-tid="panel-resistance"] [data-tid="resistance"]'
                  );
                  expectCaseInsensitiveEqual(
                    resistance,
                    exemplarSamplesExpectEntry.expect.drugs.resistance
                  );
                  DEBUG &&
                    console.log(
                      'resistance',
                      JSON.stringify(resistance, null, 2)
                    );
                }
              }
            } else {
              await client.click('[data-tid="button-resistance-class"]');
              expect(
                await client.waitForVisible(
                  '[data-tid="component-resistance-class"]'
                )
              ).toBe(true);
              await saveScreenshot(`${source}__resistance-class.png`);
            }

            // evidence

            await client.click('[data-tid="button-resistance-evidence"]');
            expect(
              await client.waitForVisible(
                '[data-tid="component-resistance-evidence"]'
              )
            ).toBe(true);
            await saveScreenshot(`${source}__resistance-evidence.png`);
            if (exemplarSamplesExpectEntry.expect.evidence) {
              const evidenceDrugs = Object.keys(
                exemplarSamplesExpectEntry.expect.evidence
              );
              DEBUG &&
                console.log(
                  'evidenceDrugs',
                  JSON.stringify(evidenceDrugs, null, 2)
                );

              for (let k = 0; k < evidenceDrugs.length; k++) {
                const drug = evidenceDrugs[k];
                const evidence = await textForSelector(
                  `[data-tid="panel-${drug.toLowerCase()}"] [data-tid="evidence"]`
                );
                expectCaseInsensitiveEqual(
                  evidence,
                  exemplarSamplesExpectEntry.expect.evidence[drug]
                );
                DEBUG &&
                  console.log(
                    `evidence[${drug}]`,
                    JSON.stringify(evidence, null, 2)
                  );
              }
            }

            // species

            await client.click('[data-tid="button-resistance-species"]');
            expect(
              await client.waitForVisible(
                '[data-tid="component-resistance-species"]'
              )
            ).toBe(true);
            await saveScreenshot(`${source}__resistance-species.png`);
            const species = await textForSelector(
              '[data-tid="species"]',
              false
            );
            expectCaseInsensitiveEqual(
              species,
              exemplarSamplesExpectEntry.expect.species
            );
            DEBUG && console.log('species', JSON.stringify(species, null, 2));

            // all

            await client.click('[data-tid="button-resistance-all"]');
            expect(
              await client.waitForVisible(
                '[data-tid="component-resistance-all"]'
              )
            ).toBe(true);
            await saveScreenshot(`${source}__resistance-all.png`);
            if (exemplarSamplesExpectEntry.expect.all) {
              const susceptible = await textForSelector(
                '[data-tid="column-susceptible"] [data-tid="drug"]'
              );
              expectCaseInsensitiveEqual(
                susceptible,
                exemplarSamplesExpectEntry.expect.all.susceptible
              );
              DEBUG &&
                console.log(
                  'susceptible',
                  JSON.stringify(susceptible, null, 2)
                );

              const resistant = await textForSelector(
                '[data-tid="column-resistant"] [data-tid="drug"]'
              );
              expectCaseInsensitiveEqual(
                resistant,
                exemplarSamplesExpectEntry.expect.all.resistant
              );
              DEBUG &&
                console.log('resistant', JSON.stringify(resistant, null, 2));
            }
            // new

            await client.click('[data-tid="button-file-new"]');
            await delay(500);

            // check existence of component
            expect(await isExisting('[data-tid="component-upload"]')).toBe(
              true
            );
          });
        }
      }
    }
  });
