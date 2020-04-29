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
  'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_1.bam.bai',
  'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_2.bam.bai',
  'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup.bam.bai',
  'ERR1234568.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup.bam.bai',
];

describe('detectFileSeq', () => {
  it(`should handle bad input`, () => {
    expect(detectFileSeqForFileNameInDir(null, dir)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir(undefined, dir)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir(undefined, undefined)).toBeFalsy();
    expect(detectFileSeqForFileNameInDir('', [])).toBeFalsy();
  });

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

  it(`should detect ...rmdup_2.bam.bai`, () => {
    const result = detectFileSeqForFileNameInDir(
      'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_1.bam.bai',
      dir
    );
    expect(result).toEqual(
      'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_2.bam.bai'
    );
  });

  it(`should not detect ERR1234568...`, () => {
    const result = detectFileSeqForFileNameInDir(
      'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup.bam.bai',
      dir
    );
    expect(result).toBeFalsy();
  });
});
