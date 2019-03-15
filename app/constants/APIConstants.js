/* @flow */

// Note: for Electron app, these are also defined in both `extend-info.plist` and `package.json`

export const API_SAMPLE_EXTENSIONS_ARRAY = IS_ELECTRON
  ? ['json', 'bam', 'gz', 'fastq']
  : ['bam', 'gz', 'fastq'];

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
