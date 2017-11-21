import React from 'react';
import renderer from 'react-test-renderer';
import path from 'path';

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

import ResistanceDrugs from '../../components/resistance/drugs/ResistanceDrugs';
import ResistanceEvidence from '../../components/resistance/evidence/ResistanceEvidence';
import ResistanceProfile from '../../components/resistance/profile/ResistanceProfile';
import ResistanceSpecies from '../../components/resistance/species/ResistanceSpecies';

const BAM_FOLDER = `${process.env.HOME}/Dropbox/bams/`;
const INCLUDE_SLOW_TESTS =
  process.env.INCLUDE_SLOW_TESTS && process.env.INCLUDE_SLOW_TESTS === 'true';

const config = new MykrobeConfig();

INCLUDE_SLOW_TESTS && jest.setTimeout(10 * 60 * 1000); // 10 minutes

beforeEach(() => {
  process.env.NODE_ENV = 'development';
});

afterEach(() => {
  delete process.env.NODE_ENV;
});

const testRenderUI = transformed => {
  const mockAnalyser = {
    transformed,
  };
  let component, tree;

  // TODO; don't use snapshots since they will differ when running slow tests
  // instead, test individual properties directly within the JSON

  component = renderer.create(<ResistanceDrugs analyser={mockAnalyser} />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(<ResistanceEvidence analyser={mockAnalyser} />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(<ResistanceProfile analyser={mockAnalyser} />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(<ResistanceSpecies analyser={mockAnalyser} />);
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
};

describe('AnalyserLocalFile', () => {
  it('should analyse and render a json file', done => {
    const analyser = new AnalyserLocalFile(config);
    const filePath = path.join(BAM_FOLDER, 'tb', 'C00009037_R00000039.json');
    analyser
      .analyseFile(filePath)
      .on('progress', progress => {
        console.log('progress', progress);
      })
      .on('done', result => {
        const { transformed } = result;
        expect(transformed.species).toEqual(['Mycobacterium_tuberculosis']);
        expect(transformed.lineage).toEqual(['European_American']);
        expect(transformed.resistant).toEqual([
          'Rifampicin',
          'Ethambutol',
          'Quinolones',
        ]);
        testRenderUI(transformed);
        done();
      })
      .on('error', error => {
        throw error;
      });
  });
  INCLUDE_SLOW_TESTS &&
    it('should analyse and render a bam file', done => {
      const analyser = new AnalyserLocalFile(config);
      const filePath = path.join(BAM_FOLDER, 'tb', 'C00009037_R00000039.bam');
      analyser
        .analyseFile(filePath)
        .on('progress', progress => {
          console.log('progress', progress);
          expect(progress).toBeDefined();
        })
        .on('done', result => {
          const { json, transformed } = result;
          console.log('json', JSON.stringify(json, null, 2));
          expect(transformed.species).toEqual(['Mycobacterium_tuberculosis']);
          expect(transformed.lineage).toEqual(['European_American']);
          expect(transformed.resistant).toEqual([
            'Rifampicin',
            'Ethambutol',
            'Quinolones',
          ]);
          testRenderUI(transformed);
          done();
        })
        .on('error', error => {
          throw error;
        });
    });
});
