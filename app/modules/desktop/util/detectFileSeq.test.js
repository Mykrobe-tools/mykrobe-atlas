/* @flow */

import { detectFileSeqForFilePathInDir } from './detectFileSeq';

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
  describe('when valid', () => {
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
  });
});
