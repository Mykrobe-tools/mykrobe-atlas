import path from 'path';

import {
  ensurePredictorBinaries,
  ensureBams,
  INCLUDE_SLOW_TESTS,
  BAM_FOLDER_PATH,
} from '../../../desktop/util';

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

const bamsExpect = require('../../../test/__fixtures__/bams.expect.json');

// prerequisites

ensurePredictorBinaries();
ensureBams();

const config = new MykrobeConfig();

INCLUDE_SLOW_TESTS && jest.setTimeout(10 * 60 * 1000); // 10 minutes

beforeEach(() => {
  process.env.NODE_ENV = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV;
});

const asLowerCase = o => {
  if (Array.isArray(o)) {
    return o.map(value => value.toLowerCase());
  }
  return o.toLowerCase();
};

describe('AnalyserLocalFile', () => {
  for (let i = 0; i < bamsExpect.length; i++) {
    const bamsExpectEntry = bamsExpect[i];
    const extension = bamsExpectEntry.source
      .substr(bamsExpectEntry.source.lastIndexOf('.') + 1)
      .toLowerCase();
    const isJson = extension === 'json';
    if (!isJson && !INCLUDE_SLOW_TESTS) {
      console.log(`Skipping slow test for ${bamsExpectEntry.source}`);
      continue;
    }
    it(`should analyse source file ${bamsExpectEntry.source}`, async done => {
      const analyser = new AnalyserLocalFile(config);
      const filePath = path.join(BAM_FOLDER_PATH, bamsExpectEntry.source);
      analyser
        .analyseFile(filePath)
        .on('progress', progress => {
          console.log('progress', progress);
        })
        .on('done', result => {
          const { transformed } = result;
          expect(asLowerCase(transformed.speciesPretty)).toEqual(
            bamsExpectEntry.expect.species
          );
          expect(asLowerCase(transformed.resistant)).toEqual(
            bamsExpectEntry.expect.all.resistant
          );
          expect(asLowerCase(transformed.susceptible)).toEqual(
            bamsExpectEntry.expect.all.susceptible
          );
          done();
        })
        .on('error', error => {
          throw error;
        });
    });
  }
});
