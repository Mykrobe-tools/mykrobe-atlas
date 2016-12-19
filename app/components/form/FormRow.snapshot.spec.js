import React from 'react';
import renderer from 'react-test-renderer';
import FormRow from './FormRow';

describe('FormRow component snapshot', () => {
  const children = '<a href="#">Dolor Sit Amet</a>';

  it('renders correctly', () => {
    const component = renderer.create(
      <FormRow children={children} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
