import * as React from 'react';
import renderer from 'react-test-renderer';
import FormInputCheckbox from './FormInputCheckbox';

describe('FormInputCheckbox component snapshot', () => {
  const name = 'loremIpsum';
  const title = 'Lorem Ipsum';
  const onChange = jest.fn();

  it('renders correctly with a single input', () => {
    const selectedOptions = [];
    const options = [{ value: 'lorem', label: 'Lorem' }];
    const component = renderer.create(
      <FormInputCheckbox
        name={name}
        title={title}
        options={options}
        selectedOptions={selectedOptions}
        onChange={onChange}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with multiple inputs', () => {
    const selectedOptions = ['lorem', 'dolorSitAmet'];
    const options = [
      { value: 'lorem', label: 'Lorem' },
      { value: 'ipsum', label: 'Ipsum' },
      { value: 'dolorSitAmet', label: 'Dolor Sit Amet' },
    ];
    const component = renderer.create(
      <FormInputCheckbox
        name={name}
        title={title}
        options={options}
        selectedOptions={selectedOptions}
        onChange={onChange}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
