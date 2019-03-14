/* @flow */

/*
ingore errors like

INFO:mykrobe.cmds.amr:Running AMR prediction with panels …
[08 Jan 2019 12:20:42-wac] Saving graph to: …
WARNING:mykrobe.cortex.mccortex:Not running mccortex…
[12 Mar 2019 15:41:07-tiZ][seq_reader.c:277] Warn: Input file has min quality score 59 but qoffset is set to 33…
  Have you predefined an incorrect fastq offset? Or is cortex guessing it wrong?

*/

const PREFIX_WHITELIST = [
  'INFO',
  'DEBUG',
  'WARN',
  '[',
  'Have you predefined an incorrect fastq offset',
];

const isAnalyserError = (line: string): boolean => {
  if (!line) {
    return false;
  }
  const trimmed = line.trim();
  for (let i = 0; i < PREFIX_WHITELIST.length; i++) {
    if (trimmed.startsWith(PREFIX_WHITELIST[i])) {
      return false;
    }
  }
  return true;
};

export default isAnalyserError;
