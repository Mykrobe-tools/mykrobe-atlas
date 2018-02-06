import path from 'path';

import {
  ensurePredictorBinaries,
  ensureExemplarSamples,
  INCLUDE_SLOW_TESTS,
  EXEMPLAR_SAMPLES_FOLDER_PATH,
  expectCaseInsensitiveEqual,
} from '../../../desktop/util';

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

const GENERATE_JSON_FIXTURES = true;

const exemplarSamplesExpect = require('../../../test/__fixtures__/exemplar-samples.expect.json');

// prerequisites

ensurePredictorBinaries();
ensureExemplarSamples();

const config = new MykrobeConfig();

INCLUDE_SLOW_TESTS && jest.setTimeout(10 * 60 * 1000); // 10 minutes

beforeEach(() => {
  process.env.NODE_ENV = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV;
});

describe('AnalyserLocalFile', () => {
  for (let i = 0; i < exemplarSamplesExpect.length; i++) {
    const exemplarSamplesExpectEntry = exemplarSamplesExpect[i];
    for (let j = 0; j < exemplarSamplesExpectEntry.source.length; j++) {
      const source = exemplarSamplesExpectEntry.source[j];
      const extension = source
        .substr(source.lastIndexOf('.') + 1)
        .toLowerCase();
      const isJson = extension === 'json';
      if (!isJson && !INCLUDE_SLOW_TESTS) {
        console.log(`Skipping slow test for ${source}`);
        continue;
      }
      it(`should analyse source file ${source}`, async done => {
        const analyser = new AnalyserLocalFile(config);
        const filePath = path.join(EXEMPLAR_SAMPLES_FOLDER_PATH, source);
        analyser
          .analyseFile(filePath)
          .on('progress', progress => {
            console.log('progress', progress);
          })
          .on('done', result => {
            const { json, transformed } = result;
            if (GENERATE_JSON_FIXTURES) {
              const fs = require('fs');
              // write unprocessed json
              fs.writeFileSync(
                `test/__fixtures__/exemplar-samples/${source}.json`,
                JSON.stringify(json, null, 2)
              );
              // write transformed json
              fs.writeFileSync(
                `test/__fixtures__/exemplar-samples/${source}__AnalyserLocalFile__.json`,
                JSON.stringify(transformed, null, 2)
              );
            }
            expectCaseInsensitiveEqual(
              transformed.speciesPretty,
              exemplarSamplesExpectEntry.expect.species
            );
            expectCaseInsensitiveEqual(
              transformed.resistant,
              exemplarSamplesExpectEntry.expect.all.resistant
            );
            expectCaseInsensitiveEqual(
              transformed.susceptible,
              exemplarSamplesExpectEntry.expect.all.susceptible
            );
            expectCaseInsensitiveEqual(
              transformed.drugsResistance,
              exemplarSamplesExpectEntry.expect.drugs.resistanceFlags
            );
            done();
          })
          .on('error', error => {
            // check if this was expected to be rejected
            let expectedReject = false;
            if (exemplarSamplesExpectEntry.expect.reject) {
              if (
                error.description &&
                error.description.includes(
                  'does not give susceptibility predictions'
                )
              ) {
                expectedReject = true;
              }
            }
            expect(expectedReject).toBeTruthy();
            if (!expectedReject) {
              throw error;
            }
            done();
          });
      });
    }
  }
});
