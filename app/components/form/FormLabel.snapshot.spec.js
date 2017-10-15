import React from 'react';
import renderer from 'react-test-renderer';
import FormLabel from './FormLabel';

describe('FormLabel component snapshot', () => {
  const htmlFor = 'loremIpsum';
  const label = 'Lorem Ipsum';
  const children = '<a href="#">Dolor Sit Amet</a>';

  it('renders correctly', () => {
    const component = renderer.create(
      <FormLabel htmlFor={htmlFor} children={children} label={label} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
