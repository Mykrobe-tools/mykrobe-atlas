/* @flow */

import * as APIConstants from './APIConstants';

describe('APIConstants', () => {
  it('Defines API_SAMPLE_EXTENSIONS correctly', () => {
    expect(APIConstants.API_SAMPLE_EXTENSIONS_ARRAY).toEqual([
      'bai',
      'bam',
      'fa',
      'fasta',
      'fastq',
      'fna',
      'fq',
      'gz',
    ]);
    expect(APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS).toEqual([
      '.bai',
      '.bam',
      '.fa',
      '.fasta',
      '.fastq',
      '.fna',
      '.fq',
      '.gz',
    ]);
    expect(APIConstants.API_SAMPLE_EXTENSIONS_STRING_WITH_DOTS).toEqual(
      '.bai,.bam,.fa,.fasta,.fastq,.fna,.fq,.gz'
    );
    expect(APIConstants.API_SAMPLE_EXTENSIONS_STRING).toEqual(
      'bai,bam,fa,fasta,fastq,fna,fq,gz'
    );
  });
});
