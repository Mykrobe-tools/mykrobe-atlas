/* @flow */

import { Application } from 'spectron';

import debug from 'debug';
const d = debug('mykrobe:desktop-test:test-display-results');

import { delay, expectCaseInsensitiveEqual } from './util';

import createTestHelpers from './helpers';

const testOpenSourceFile = async (
  source: string,
  exemplarSamplesExpectEntry: any,
  app: Application
) => {
  if (!app) {
    throw 'Missing argument app';
  }
  const { textForSelector, saveScreenshot } = createTestHelpers(app);
  const { client } = app;

  // click each section and check the result shown in the UI

  // drugs or class

  await client.click('[data-tid="button-resistance-drugs"]');
  expect(
    await client.waitForVisible('[data-tid="component-resistance-drugs"]')
  ).toBe(true);
  await delay(500);
  await saveScreenshot(`${source}__resistance-drugs.png`);
  if (exemplarSamplesExpectEntry.expect.drugs) {
    const firstLineDrugs = await textForSelector(
      '[data-tid="panel-first-line-drugs"] [data-tid="drug"]'
    );
    expectCaseInsensitiveEqual(
      firstLineDrugs,
      exemplarSamplesExpectEntry.expect.drugs.firstLineDrugs
    );
    d('firstLineDrugs', JSON.stringify(firstLineDrugs, null, 2));
    const secondLineDrugs = await textForSelector(
      '[data-tid="panel-second-line-drugs"] [data-tid="drug"]'
    );
    expectCaseInsensitiveEqual(
      secondLineDrugs,
      exemplarSamplesExpectEntry.expect.drugs.secondLineDrugs
    );
    d('secondLineDrugs', JSON.stringify(secondLineDrugs, null, 2));
    if (exemplarSamplesExpectEntry.expect.drugs.resistance) {
      const resistance = await textForSelector(
        '[data-tid="panel-resistance"] [data-tid="resistance"]'
      );
      expectCaseInsensitiveEqual(
        resistance,
        exemplarSamplesExpectEntry.expect.drugs.resistance
      );
      d('resistance', JSON.stringify(resistance, null, 2));
    }
  } else {
    // TODO: verify that nothing is shown
  }

  // evidence

  await client.click('[data-tid="button-resistance-evidence"]');
  expect(
    await client.waitForVisible('[data-tid="component-resistance-evidence"]')
  ).toBe(true);
  await delay(500);
  await saveScreenshot(`${source}__resistance-evidence.png`);

  if (exemplarSamplesExpectEntry.expect.evidence) {
    const evidenceDrugs = Object.keys(
      exemplarSamplesExpectEntry.expect.evidence
    );
    d('evidenceDrugs', JSON.stringify(evidenceDrugs, null, 2));

    for (let k = 0; k < evidenceDrugs.length; k++) {
      const drug = evidenceDrugs[k];
      const evidence = await textForSelector(
        `[data-tid="panel-${drug.toLowerCase()}"] [data-tid="evidence"]`
      );
      expectCaseInsensitiveEqual(
        evidence,
        exemplarSamplesExpectEntry.expect.evidence[drug]
      );
      d(`evidence[${drug}]`, JSON.stringify(evidence, null, 2));
    }
  } else {
    // TODO: verify that no evidence is shown
  }

  // species

  await client.click('[data-tid="button-resistance-species"]');
  expect(
    await client.waitForVisible('[data-tid="component-resistance-species"]')
  ).toBe(true);
  await delay(500);
  await saveScreenshot(`${source}__resistance-species.png`);
  const species = await textForSelector('[data-tid="species"]', false);
  expectCaseInsensitiveEqual(
    species,
    exemplarSamplesExpectEntry.expect.species
  );
  d('species', JSON.stringify(species, null, 2));

  // all

  await client.click('[data-tid="button-resistance-all"]');
  expect(
    await client.waitForVisible('[data-tid="component-resistance-all"]')
  ).toBe(true);
  await delay(500);
  await saveScreenshot(`${source}__resistance-all.png`);
  if (exemplarSamplesExpectEntry.expect.all) {
    const susceptible = await textForSelector(
      '[data-tid="column-susceptible"] [data-tid="drug"]'
    );
    expectCaseInsensitiveEqual(
      susceptible,
      exemplarSamplesExpectEntry.expect.all.susceptible
    );
    d('susceptible', JSON.stringify(susceptible, null, 2));

    const resistant = await textForSelector(
      '[data-tid="column-resistant"] [data-tid="drug"]'
    );
    expectCaseInsensitiveEqual(
      resistant,
      exemplarSamplesExpectEntry.expect.all.resistant
    );
    d('resistant', JSON.stringify(resistant, null, 2));
  } else {
    // TODO: verify that nothing is shown
  }
};

export default testOpenSourceFile;
