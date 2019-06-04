/* @flow */

import fs from 'fs-extra';
import path from 'path';

import { newickContainsNodeId } from './newick';

const filePath = path.join(
  __dirname,
  '../../../../test/__fixtures__/phylocanvas.nwk'
);
console.log('filePath', filePath);
const data = fs.readFileSync(filePath);
const newick = data.toString();

describe('experiments util newickContainsNodeId', () => {
  it('should determine if newick contains node id', () => {
    expect(newickContainsNodeId(newick, 'test')).toBeFalsy();
    expect(newickContainsNodeId(newick, 'SPN4000')).toBeTruthy();
  });
});
