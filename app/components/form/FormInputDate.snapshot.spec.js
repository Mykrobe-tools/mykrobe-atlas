import React from 'react';
import renderer from 'react-test-renderer';
import FormInputDate from './FormInputDate';

jest.mock('react-datepicker', () => { return '';});

describe('FormInputDate component snapshot', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const value = '2016-01-01';
  const onChange = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <FormInputDate
        name={name}
        title={title}
        value={value}
        onChange={onChange} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
