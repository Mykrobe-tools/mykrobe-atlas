import React from 'react';
import renderer from 'react-test-renderer';
import Metadata from './Metadata';

jest.mock('../header/Key', () => {
  return '';
});
jest.mock('./MetadataForm', () => {
  return '';
});

const analyser = {analysing: true};

describe('Metadata component snapshot', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <Metadata analyser={analyser} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
