/* @flow */

import { experimentSchema } from './index';
import { keysForSchema } from './util';

describe('experiment schema util', () => {
  it('should derive keys as expected', async () => {
    expect(keysForSchema(experimentSchema)).toMatchSnapshot();
  });
});
