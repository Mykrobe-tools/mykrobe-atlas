/* @flow */

import { experimentSchema } from './index';
import { keysForSchema, completenessForSchemaAndData } from './util';

describe('experiment schema util', () => {
  it('should derive keys as expected', async () => {
    expect(keysForSchema(experimentSchema)).toMatchSnapshot();
  });
  it('should determine completeness as expected', async () => {
    const formData = {
      metadata: {
        patient: {
          homeless: true,
          smoker: true,
        },
      },
    };
    expect(
      completenessForSchemaAndData(experimentSchema, formData)
    ).toMatchSnapshot();
  });
});
