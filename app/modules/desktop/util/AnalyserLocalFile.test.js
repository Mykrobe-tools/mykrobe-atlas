/* @flow */

import path from 'path';
import parsePath from 'parse-filepath';
import fs from 'fs-extra';

import {
  ensureMykrobeBinaries,
  ensureExemplarSamples,
  INCLUDE_SLOW_TESTS,
  EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
  EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH,
  expectCaseInsensitiveEqual,
} from '../../../../desktop/util';

import AnalyserLocalFile from './AnalyserLocalFile';
import detectFileSeq from './detectFileSeq';

const GENERATE_JSON_FIXTURES = true;

const exemplarSamplesExpect = require('../../../../test/__fixtures__/exemplar_seqeuence_data.expect.json');

INCLUDE_SLOW_TESTS && jest.setTimeout(30 * 60 * 1000); // 10 minutes

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
      const extension = source
        .substr(source.lastIndexOf('.') + 1)
        .toLowerCase();
      const isJson = extension === 'json';
      if (!isJson && !INCLUDE_SLOW_TESTS) {
        console.log(`Skipping slow test for ${source}`);
        continue;
      }
      const filePath = path.join(EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH, source);
      const result = detectFileSeq(filePath);
      let filePaths = [filePath];
      if (result) {
        filePaths = filePaths.concat(result);
      }
      const fileNames = filePaths.map(filePath => parsePath(filePath).basename);
      it(`should analyse source file ${source} - analysing (${fileNames.join(
        ', '
      )})`, async done => {
        const analyser = new AnalyserLocalFile();
        analyser
          .analyseFile(filePaths)
          .on('progress', progress => {
            console.log('progress', progress);
          })
          .on('done', result => {
            const { json, transformed } = result;
            if (GENERATE_JSON_FIXTURES) {
              if (!isJson) {
                // write unprocessed json
                const outputPath = path.join(
                  EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH,
                  `${source}.json`
                );
                fs.ensureDirSync(path.dirname(outputPath));
                fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
              }
              // write transformed json
              const outputPath = path.join(
                EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH,
                `${source}__transformed__.json`
              );
              fs.ensureDirSync(path.dirname(outputPath));
              fs.writeFileSync(
                outputPath,
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
