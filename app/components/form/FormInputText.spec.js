import React from 'react';
import { mount } from 'enzyme';
import FormInputText from './FormInputText';

describe('FormInputText component', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const type = 'text';
  const placeholder = 'Lorem Ipsum Dolor Sit Amet';
  const value = 'Dolor sit amet';
  const onChange = jest.fn();

  it('fires change events', () => {
    const component = mount(
      <FormInputText
        name={name}
        title={title}
        value={value}
        placeholder={placeholder}
        type={type}
        onChange={onChange} />
    );
    component.find('input').simulate('change', {target: {value: 'Lorem'}});
    expect(onChange).toBeCalled();
  });
});
