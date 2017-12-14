import * as React from 'react';
import renderer from 'react-test-renderer';
import Metadata from './Metadata';

jest.mock('../header/Key', () => {
  return '';
});
jest.mock('./MetadataForm', () => {
  return '';
});

const analyser = { analysing: true };
const match = { params: { id: 123 } };

describe('Metadata component snapshot', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <Metadata analyser={analyser} match={match} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
