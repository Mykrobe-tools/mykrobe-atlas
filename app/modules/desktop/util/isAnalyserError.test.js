/* @flow */

import isAnalyserError from './isAnalyserError';

describe('isAnalyserError', () => {
  it(`should handle bad input`, () => {
    expect(isAnalyserError()).toBeFalsy();
    expect(isAnalyserError(null)).toBeFalsy();
    expect(isAnalyserError('')).toBeFalsy();
  });

  it(`should detect benign messages`, () => {
    expect(
      isAnalyserError(
        'INFO:mykrobe.cmds.amr:Running AMR prediction with panels'
      )
    ).toBeFalsy();
    expect(
      isAnalyserError('[08 Jan 2019 12:20:42-wac] Saving graph')
    ).toBeFalsy();
    expect(
      isAnalyserError('WARNING:mykrobe.cortex.mccortex:Not running mccortex')
    ).toBeFalsy();
    expect(
      isAnalyserError(
        '[12 Mar 2019 15:41:07-tiZ][seq_reader.c:277] Warn: Input file has'
      )
    ).toBeFalsy();
    expect(
      isAnalyserError(
        '  Have you predefined an incorrect fastq offset? Or is cortex guessing it wrong?'
      )
    ).toBeFalsy();
  });

  it(`should detect error messages`, () => {
    expect(isAnalyserError('Unexpected')).toBeTruthy();
  });
});
