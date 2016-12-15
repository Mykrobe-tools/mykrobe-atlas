import React from 'react';
import renderer from 'react-test-renderer';
import Notification from './Notification';

describe('Notification component snapshot', () => {
  const id = 1;
  const category = 'success';
  const content = 'Lorem Ipsum';
  const onClick = jest.fn();

  it('renders correctly', () => {
    const component = renderer.create(
      <Notification
        id={id}
        category={category}
        content={content}
        onClick={onClick} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
