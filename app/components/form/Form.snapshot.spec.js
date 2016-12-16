import React from 'react';
import renderer from 'react-test-renderer';
import Form from './Form';

describe('Form component snapshot', () => {
  const children = '<p>Lorem ipsum</p>';
  const onSubmit = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Form
        children={children}
        onSubmit={onSubmit} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('runs submit event', () => {
    const component = renderer.create(
      <Form
        children={children}
        onSubmit={onSubmit} />
    );
    let tree = component.toJSON();
    tree.props.onSubmit();
    expect(onSubmit).toBeCalled();
  })
});
