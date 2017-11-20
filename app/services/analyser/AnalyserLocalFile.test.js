// import renderer from 'react-test-renderer';
import path from 'path';

import AnalyserLocalFile from './AnalyserLocalFile';
import MykrobeConfig from '../MykrobeConfig';

// import ResistanceSpecies from '../../components/resistance/ResistanceSpecies';

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

describe('AnalyserLocalFile', () => {
  it('should analyse a json file', done => {
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
        // const component = renderer.create(
        //   <ResistanceSpecies
        //     analyser={mockAnalyser}
        //   />
        // );
        // let tree = component.toJSON();
        // expect(tree).toMatchSnapshot();
        done();
      })
      .on('error', error => {
        throw error;
      });
  });
  INCLUDE_SLOW_TESTS &&
    it('should analyse a bam', done => {
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
          done();
        })
        .on('error', error => {
          throw error;
        });
    });
});
