import React from 'react';
import { mount } from 'enzyme';
import FormSelect from './FormSelect';

describe('FormSelect component', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const onChange = jest.fn();

  it('fires change events', () => {
    const selectedOption = 'dolorSitAmet';
    const options = [
      {value: 'lorem', label: 'Lorem'},
      {value: 'ipsum', label: 'Ipsum'},
      {value: 'dolorSitAmet', label: 'Dolor Sit Amet'}
    ];
    const component = mount(
      <FormSelect
        name={name}
        title={title}
        options={options}
        selectedOption={selectedOption}
        onChange={onChange} />
    );
    component.find('select').simulate('change', { target: { value: 'ipsum'}});
    expect(onChange).toBeCalled();
  });
});
