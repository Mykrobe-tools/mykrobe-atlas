/* @flow */

import fs from 'fs';
import path from 'path';

import { EXEMPLAR_SEQUENCE_DATA_ARTEFACT_JSON_FOLDER_PATH } from '../../../../desktop/test/util';

import AnalyserJsonTransformer from './AnalyserJsonTransformer';
import susceptibilityTransformer from './transformers/susceptibility';

const samples = [
  'INH_monoresistant.fastq.gz.json',
  'MDR.fastq.gz.json',
  'Mycobacterium_kansasii.bam.json',
  'RIF_monoresistant.fastq.gz.json',
  'XDR.fastq.gz.json',
];

const metadataPhenotyping = {
  rifampicin: {
    susceptibility: 'Sensitive',
    method: 'Other',
  },
  ethambutol: {
    susceptibility: 'Resistant',
    method: 'Microtitre plate',
  },
  pyrazinamide: {
    susceptibility: 'Inconclusive',
    method: 'Microtitre plate',
  },
  isoniazid: {
    susceptibility: 'Not tested',
    method: 'Other',
  },
  rifabutin: {
    susceptibility: 'Inconclusive',
    method: 'MGIT',
  },
  ofloxacin: {
    susceptibility: 'Resistant',
    method: 'Other',
  },
  ciprofloxacin: {
    method: 'Not known',
  },
  levofloxacin: {
    method: 'Microtitre plate',
    susceptibility: 'Resistant',
  },
  gatifloxacin: {
    susceptibility: 'Sensitive',
    method: 'Microtitre plate',
  },
  amikacin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  kanamycin: {
    susceptibility: 'Sensitive',
  },
  gentamicin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  streptomycin: {
    susceptibility: 'Sensitive',
    method: 'Microtitre plate',
  },
  capreomycin: {
    susceptibility: 'Resistant',
    method: 'MGIT',
  },
  clofazimine: {
    susceptibility: 'Sensitive',
    method: 'MODS',
  },
  pas: {
    susceptibility: 'Not tested',
    method: 'Microtitre plate',
  },
  linezolid: {
    susceptibility: 'Resistant',
  },
  ethionamideProthionamide: {
    susceptibility: 'Inconclusive',
  },
  rerizidone: {
    susceptibility: 'Inconclusive',
  },
  amoxicilinClavulanate: {
    susceptibility: 'Resistant',
  },
  thioacetazone: {
    method: 'Microtitre plate',
    susceptibility: 'Inconclusive',
  },
  imipenemImipenemcilastatin: {
    susceptibility: 'Resistant',
  },
  meropenem: {
    susceptibility: 'Sensitive',
  },
  clarythromycin: {
    susceptibility: 'Resistant',
  },
  highDoseIsoniazid: {
    susceptibility: 'Sensitive',
  },
  bedaquiline: {
    susceptibility: 'Sensitive',
  },
  delamanid: {
    susceptibility: 'Inconclusive',
  },
  prothionamide: {
    susceptibility: 'Resistant',
  },
  pretothionamide: {
    susceptibility: 'Resistant',
  },
  pretomanid: {
    susceptibility: 'Sensitive',
  },
};

describe('AnalyserJsonTransformer', () => {
  describe('when valid', () => {
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
});

describe('AnalyserJsonTransformer susceptibilityTransformer', () => {
  describe('when valid', () => {
    describe('and in Predicator format', () => {
      it('should return data transformed as expected', async () => {
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
    describe('and in Metadata format', () => {
      it('should return data transformed as expected', async () => {
        const transformed = susceptibilityTransformer(metadataPhenotyping);
        expect(transformed).toMatchSnapshot();
        console.log(JSON.stringify({ transformed }, null, 2));
      });
    });
  });
});
