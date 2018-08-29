/* @flow */

import fs from 'fs';
import path from 'path';
import AnalyserJsonTransformer from './AnalyserJsonTransformer';

const samples = [
  'INH_monoresistant.fastq.gz.json',
  'MDR.fastq.gz.json',
  'Mycobacterium_kansasii.bam.json',
  'RIF_monoresistant.fastq.gz.json',
  'XDR.fastq.gz.json',
];

const BASE_PATH = path.join(
  __dirname,
  '../../../../test/__fixtures__/exemplar-samples'
);

describe('AnalyserJsonTransformer', () => {
  it('should handle "requestExperiments" action', async () => {
    const transformer = new AnalyserJsonTransformer();
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const raw = fs.readFileSync(path.join(BASE_PATH, sample), 'utf8');
      const json = JSON.parse(raw);
      const transformed = await transformer.transformModel(json);
      expect(transformed).toMatchSnapshot();
    }
  });
});
