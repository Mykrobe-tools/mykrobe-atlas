/* @flow */

import {
  detectFileSeqForFilePathInDir,
  detectFileSeqForFileNameInDir,
} from './detectFileSeq';

const dir = [
  '.DS_Store',
  'MDR_1.fastq.gz',
  'MDR_2.fastq.gz',
  'Mycobacterium_kansasii.bam',
  'README.md',
  'XDR.fastq.gz',
];

describe('detectFileSeq', () => {
  it(`should detect MDR_2`, () => {
    const result = detectFileSeqForFileNameInDir('MDR_1.fastq.gz', dir);
    expect(result).toEqual('MDR_2.fastq.gz');
  });
  it(`should detect MDR_1`, () => {
    const result = detectFileSeqForFileNameInDir('MDR_2.fastq.gz', dir);
    expect(result).toEqual('MDR_1.fastq.gz');
  });
  it(`should detect MDR_2 with path`, () => {
    const result = detectFileSeqForFilePathInDir(
      '/path/to/MDR_1.fastq.gz',
      dir
    );
    expect(result).toEqual('/path/to/MDR_2.fastq.gz');
  });
  it(`should detect MDR_1 with path`, () => {
    const result = detectFileSeqForFilePathInDir(
      '/path/to/MDR_2.fastq.gz',
      dir
    );
    expect(result).toEqual('/path/to/MDR_1.fastq.gz');
  });
  it(`should handle bad input`, () => {
    expect(detectFileSeqForFileNameInDir(null, dir)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir(undefined, dir)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir(undefined, undefined)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir('', [])).toBeFalsy();
  });
});
