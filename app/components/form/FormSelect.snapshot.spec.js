import React from 'react';
import renderer from 'react-test-renderer';
import FormSelect from './FormSelect';

describe('FormSelect component snapshot', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const onChange = jest.fn();

  it('renders correctly with a single option', () => {
    const value = 'lorem';
    const options = [{ value: 'lorem', label: 'Lorem' }];
    const component = renderer.create(
      <FormSelect
        name={name}
        title={title}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with multiple options', () => {
    const value = 'dolorSitAmet';
    const options = [
      { value: 'lorem', label: 'Lorem' },
      { value: 'ipsum', label: 'Ipsum' },
      { value: 'dolorSitAmet', label: 'Dolor Sit Amet' },
    ];
    const component = renderer.create(
      <FormSelect
        name={name}
        title={title}
        options={options}
        value={value}
        onChange={onChange}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
