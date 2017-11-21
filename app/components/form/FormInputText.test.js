import * as React from 'react';
import renderer from 'react-test-renderer';
import FormInputText from './FormInputText';

describe('FormInputText component snapshot', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const type = 'text';
  const placeholder = 'Lorem Ipsum Dolor Sit Amet';
  const value = 'Dolor sit amet';
  const onChange = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <FormInputText
        name={name}
        title={title}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
