import React from 'react';
import renderer from 'react-test-renderer';
import FormButton from './FormButton';

describe('FormButton component snapshot', () => {
  const label = 'Lorem ipsum';
  const type = 'submit';
  const onClick = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <FormButton
        label={label}
        type={type}
        onClick={onClick} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('runs click event', () => {
    const component = renderer.create(
      <FormButton
        label={label}
        type={type}
        onClick={onClick} />
    );
    let tree = component.toJSON();
    const btn = tree.children[0];
    btn.props.onClick();
    expect(onClick).toBeCalled();
  });
});
