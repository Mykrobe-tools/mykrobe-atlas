/* @flow */

import prettyFileName from './prettyFileName';

describe('prettyFileName', () => {
  describe('when invalid', () => {
    it(`should return falsy witout error`, () => {
      expect(prettyFileName(null)).toBeFalsy();
      expect(prettyFileName(undefined)).toBeFalsy();
      expect(prettyFileName('')).toBeFalsy();
    });
  });
  describe('when valid', () => {
    it(`should return pretty file name by stripping valid extensions`, () => {
      expect(prettyFileName('MDR_1.fastq.gz')).toEqual('MDR_1');
      expect(prettyFileName('MDR_1.FASTQ')).toEqual('MDR_1');
      expect(prettyFileName('Mycobacterium_kansasii.bam')).toEqual(
        'Mycobacterium_kansasii'
      );
      expect(prettyFileName('XDR.fastq.gz')).toEqual('XDR');
      expect(prettyFileName('XDR.FASTQ.gz')).toEqual('XDR');
      expect(
        prettyFileName(
          'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_1.bam.bai'
        )
      ).toEqual(
        'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup_1'
      );
      expect(
        prettyFileName(
          'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup.bam.bai'
        )
      ).toEqual(
        'ERR1234567.versus.GCA_000123456.7_ASM12345v2_genomic.aln.sorted.rmdup'
      );
    });
  });
});
