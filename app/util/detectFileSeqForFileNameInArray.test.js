/* @flow */

import detectFileSeqForFileNameInArray from './detectFileSeqForFileNameInArray';

const fileNameArray = [
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

describe('detectFileSeqForFileNameInArray', () => {
  describe('when invalid', () => {
    it(`should return falsy witout error`, () => {
      expect(detectFileSeqForFileNameInArray(null, fileNameArray)).toBeFalsy();
      expect(
        detectFileSeqForFileNameInArray(undefined, fileNameArray)
      ).toBeFalsy();
      expect(detectFileSeqForFileNameInArray(undefined, undefined)).toBeFalsy();
      expect(detectFileSeqForFileNameInArray('', [])).toBeFalsy();
    });
  });
  describe('when valid', () => {
    it(`should detect MDR_2`, () => {
      const result = detectFileSeqForFileNameInArray(
        'MDR_1.fastq.gz',
        fileNameArray
      );
      expect(result).toEqual('MDR_2.fastq.gz');
    });

    it(`should detect MDR_1`, () => {
      const result = detectFileSeqForFileNameInArray(
        'MDR_2.fastq.gz',
        fileNameArray
      );
      expect(result).toEqual('MDR_1.fastq.gz');
    });

    it(`should detect ...rmdup_2.bam.bai`, () => {
      const result = detectFileSeqForFileNameInArray(
        'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_1.bam.bai',
        fileNameArray
      );
      expect(result).toEqual(
        'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_2.bam.bai'
      );
    });

    it(`should not detect ERR1234568...`, () => {
      const result = detectFileSeqForFileNameInArray(
        'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup.bam.bai',
        fileNameArray
      );
      expect(result).toBeFalsy();
    });
  });
});
