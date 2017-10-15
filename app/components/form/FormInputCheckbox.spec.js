import React from 'react';
import { mount } from 'enzyme';
import FormInputCheckbox from './FormInputCheckbox';

describe('FormInputCheckbox component', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const onChange = jest.fn();

  it('fires change events', () => {
    const selectedOptions = ['lorem', 'dolorSitAmet'];
    const options = [
      { value: 'lorem', label: 'Lorem' },
      { value: 'ipsum', label: 'Ipsum' },
      { value: 'dolorSitAmet', label: 'Dolor Sit Amet' },
    ];
    const component = mount(
      <FormInputCheckbox
        name={name}
        title={title}
        options={options}
        selectedOptions={selectedOptions}
        onChange={onChange}
      />
    );
    component
      .find('input[value="ipsum"]')
      .simulate('change', { target: { checked: true } });
    expect(onChange).toBeCalled();
  });
});
