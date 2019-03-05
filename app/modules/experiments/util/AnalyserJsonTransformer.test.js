/* @flow */

import fs from 'fs';
import path from 'path';

import { EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH } from '../../../../desktop/util';

import AnalyserJsonTransformer from './AnalyserJsonTransformer';
import susceptibilityTransformer from './transformers/susceptibility';

const samples = [
  'INH_monoresistant.fastq.gz.json',
  'MDR.fastq.gz.json',
  'Mycobacterium_kansasii.bam.json',
  'RIF_monoresistant.fastq.gz.json',
  'XDR.fastq.gz.json',
];

describe('AnalyserJsonTransformer', () => {
  it('should transform as expected', async () => {
    const transformer = new AnalyserJsonTransformer();
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const raw = fs.readFileSync(
        path.join(EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH, sample),
        'utf8'
      );
      const json = JSON.parse(raw);
      const transformed = await transformer.transformModel(json);
      expect(transformed).toMatchSnapshot();
    }
  });
});

describe('AnalyserJsonTransformer susceptibilityTransformer', () => {
  it('should transform as expected', async () => {
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      const raw = fs.readFileSync(
        path.join(EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH, sample),
        'utf8'
      );
      const json = JSON.parse(raw);
      const keys = Object.keys(json);
      const first = json[keys[0]];
      const susceptibility = first['susceptibility'];
      const transformed = susceptibilityTransformer(susceptibility);
      expect(transformed).toMatchSnapshot();
    }
  });
});
