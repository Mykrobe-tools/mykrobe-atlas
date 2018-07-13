/* @flow */

import * as APIConstants from './APIConstants';

describe('APIConstants', () => {
  it('Defines API_SAMPLE_EXTENSIONS correctly', () => {
    expect(APIConstants.API_SAMPLE_EXTENSIONS_ARRAY).toEqual([
      'bam',
      'gz',
      'fastq',
    ]);
    expect(APIConstants.API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS).toEqual([
      '.bam',
      '.gz',
      '.fastq',
    ]);
    expect(APIConstants.API_SAMPLE_EXTENSIONS_STRING_WITH_DOTS).toEqual(
      '.bam,.gz,.fastq'
    );
    expect(APIConstants.API_SAMPLE_EXTENSIONS_STRING).toEqual('bam,gz,fastq');
  });
});
