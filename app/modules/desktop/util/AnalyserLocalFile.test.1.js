/* @flow */

import path from 'path';

import {
  ensureMykrobeBinaries,
  ensureExemplarSamples,
  INCLUDE_SLOW_TESTS,
  EXEMPLAR_SAMPLES_FOLDER_PATH,
  expectCaseInsensitiveEqual,
} from '../../../../desktop/util';

import AnalyserLocalFile from './AnalyserLocalFile';

import { isArray, isString } from 'makeandship-js-common/src/util/is';

const GENERATE_JSON_FIXTURES = true;

const exemplarSamplesExpect = require('../../../../test/__fixtures__/exemplar-samples.expect.json');

INCLUDE_SLOW_TESTS && jest.setTimeout(10 * 60 * 1000); // 10 minutes

describe('AnalyserLocalFile', () => {
  it('should contain a test', done => {
    done();
  });
});

ensureMykrobeBinaries();
ensureExemplarSamples();

// TODO: this affects where the analyser looks for the mykrobe executable - should use a more explicit flag

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
      let source = exemplarSamplesExpectEntry.source[j];
      let isJson = false;
      if (isString(source)) {
        const extension = source
          .substr(source.lastIndexOf('.') + 1)
          .toLowerCase();
        isJson = extension === 'json';
        if (!isJson && !INCLUDE_SLOW_TESTS) {
          console.log(`Skipping slow test for ${source}`);
          continue;
        }
      }
      it(`should analyse source file(s) ${source}`, async done => {
        const analyser = new AnalyserLocalFile();
        if (!isArray(source)) {
          source = [source];
        }
        const filePaths = source.map(filePath =>
          path.join(EXEMPLAR_SAMPLES_FOLDER_PATH, filePath)
        );
        analyser
          .analyseFile(filePaths)
          .on('progress', progress => {
            console.log('progress', progress);
          })
          .on('done', result => {
            const { json, transformed } = result;
            if (GENERATE_JSON_FIXTURES) {
              const fs = require('fs');
              if (!isJson) {
                // write unprocessed json
                fs.writeFileSync(
                  `test/__fixtures__/exemplar-samples/${source.join(
                    '__'
                  )}.json`,
                  JSON.stringify(json, null, 2)
                );
              }
              // write transformed json
              fs.writeFileSync(
                `test/__fixtures__/exemplar-samples/${source.join(
                  '__'
                )}__AnalyserLocalFile__.json`,
                JSON.stringify(transformed, null, 2)
              );
            }
            expectCaseInsensitiveEqual(
              transformed.speciesAndLineageString,
              exemplarSamplesExpectEntry.expect.species
            );
            if (transformed.hasResistance) {
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
            }
            done();
          })
          .on('error', error => {
            console.error(error);
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
