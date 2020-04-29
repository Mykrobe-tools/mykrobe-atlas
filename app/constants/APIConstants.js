/* @flow */

// Note: for Electron app, these are also defined in both `extend-info.plist` and `package.json`

const API_SAMPLE_EXTENSIONS_ARRAY_BASE = [
  'bai',
  'bam',
  'fa',
  'fasta',
  'fastq',
  'fna',
  'fq',
  'gz',
];

export const API_SAMPLE_EXTENSIONS_ARRAY = IS_ELECTRON
  ? [...API_SAMPLE_EXTENSIONS_ARRAY_BASE, 'json']
  : API_SAMPLE_EXTENSIONS_ARRAY_BASE;

const withDots: Array<string> = API_SAMPLE_EXTENSIONS_ARRAY.map(
  (extension: string) => `.${extension}`
);
export const API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS = withDots;
export const API_SAMPLE_EXTENSIONS_STRING_WITH_DOTS = API_SAMPLE_EXTENSIONS_ARRAY_WITH_DOTS.join(
  ','
);
export const API_SAMPLE_EXTENSIONS_STRING = API_SAMPLE_EXTENSIONS_ARRAY.join(
  ','
);
