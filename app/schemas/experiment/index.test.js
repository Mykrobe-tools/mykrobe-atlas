/* @flow */

import { filteredSchemaWithSubsections } from './index';

describe('experiment schema', () => {
  it('should filter as expected', async () => {
    expect(filteredSchemaWithSubsections(['patient'])).toMatchSnapshot();
    expect(filteredSchemaWithSubsections(['sample'])).toMatchSnapshot();
    expect(filteredSchemaWithSubsections(['genotyping'])).toMatchSnapshot();
    expect(filteredSchemaWithSubsections(['phenotyping'])).toMatchSnapshot();
    expect(filteredSchemaWithSubsections(['treatment'])).toMatchSnapshot();
    expect(filteredSchemaWithSubsections(['outcome'])).toMatchSnapshot();
  });
});
