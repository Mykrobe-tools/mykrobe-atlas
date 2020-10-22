/* @flow */

import {
  fileNamesAndPathsForSource,
  EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH,
} from './util';

describe('Desktop test util', () => {
  describe('fileNamesAndPathsForSource', () => {
    describe('when valid', () => {
      describe('and provided a string', () => {
        it('should return expected results for a sample file', async () => {
          const {
            displayName,
            fileNames,
            filePaths,
            isJson,
          } = fileNamesAndPathsForSource('foo.fastq.gz');
          expect(displayName).toEqual(`foo.fastq.gz`);
          expect(fileNames).toEqual([`foo.fastq.gz`]);
          expect(filePaths).toEqual([
            `${EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH}/foo.fastq.gz`,
          ]);
          expect(isJson).toBeFalsy();
        });
        it('should return expected results for a json file', async () => {
          const {
            displayName,
            fileNames,
            filePaths,
            isJson,
          } = fileNamesAndPathsForSource('foo.json');
          expect(displayName).toEqual(`foo.json`);
          expect(fileNames).toEqual([`foo.json`]);
          expect(filePaths).toEqual([
            `${EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH}/foo.json`,
          ]);
          expect(isJson).toBeTruthy();
        });
      });
      describe('and provided an array', () => {
        it('should return expected results', async () => {
          const {
            displayName,
            fileNames,
            filePaths,
            isJson,
          } = fileNamesAndPathsForSource([
            'foo/bar/foo.fastq.gz',
            'foo/bar/baz/bar.fastq.gz',
          ]);
          expect(displayName).toEqual(`foo.fastq.gz, bar.fastq.gz`);
          expect(fileNames).toEqual([`foo.fastq.gz`, `bar.fastq.gz`]);
          expect(filePaths).toEqual([
            `${EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH}/foo/bar/foo.fastq.gz`,
            `${EXEMPLAR_SEQUENCE_DATA_FOLDER_PATH}/foo/bar/baz/bar.fastq.gz`,
          ]);
          expect(isJson).toBeFalsy();
        });
      });
    });
  });
});
