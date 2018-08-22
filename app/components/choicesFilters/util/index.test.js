/* @flow */

import { shortesTitleForChoiceWithKeyInChoices } from './index';
const choices = require('../__fixtures__/choices');

describe('choicesFilters util', () => {
  it(`should generate short titles`, () => {
    const title = shortesTitleForChoiceWithKeyInChoices(
      'metadata.treatment.continuation.start',
      choices
    );
    const title2 = shortesTitleForChoiceWithKeyInChoices(
      'metadata.phenotyping.linezolid.susceptibility',
      choices
    );
    const title3 = shortesTitleForChoiceWithKeyInChoices(
      'metadata.sample.prospectiveIsolate',
      choices
    );
    expect(title).toEqual('Continuation Start Date › Date started');
    expect(title2).toEqual('Linezolid › Susceptible');
    expect(title3).toEqual('Prospective Isolate');
  });
});
