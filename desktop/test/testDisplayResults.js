/* @flow */

import { Application } from 'spectron';

import * as TargetConstants from '../../app/constants/TargetConstants';

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

  const DEBUG = true;

  // click each section and check the result shown in the UI

  // drugs or class

  if (TargetConstants.SPECIES_TB === TargetConstants.SPECIES) {
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
      DEBUG &&
        console.log('firstLineDrugs', JSON.stringify(firstLineDrugs, null, 2));
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
        DEBUG && console.log('resistance', JSON.stringify(resistance, null, 2));
      }
    } else {
      // TODO: verify that nothing is shown
    }
  } else {
    // TODO: non-TB, presumably Staph
    await client.click('[data-tid="button-resistance-class"]');
    expect(
      await client.waitForVisible('[data-tid="component-resistance-class"]')
    ).toBe(true);
    await saveScreenshot(`${source}__resistance-class.png`);
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
    DEBUG &&
      console.log('evidenceDrugs', JSON.stringify(evidenceDrugs, null, 2));

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
        console.log(`evidence[${drug}]`, JSON.stringify(evidence, null, 2));
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
  DEBUG && console.log('species', JSON.stringify(species, null, 2));

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
    DEBUG && console.log('susceptible', JSON.stringify(susceptible, null, 2));

    const resistant = await textForSelector(
      '[data-tid="column-resistant"] [data-tid="drug"]'
    );
    expectCaseInsensitiveEqual(
      resistant,
      exemplarSamplesExpectEntry.expect.all.resistant
    );
    DEBUG && console.log('resistant', JSON.stringify(resistant, null, 2));
  } else {
    // TODO: verify that nothing is shown
  }
};

export default testOpenSourceFile;
