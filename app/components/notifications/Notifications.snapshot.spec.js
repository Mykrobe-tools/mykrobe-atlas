import React from 'react';
import renderer from 'react-test-renderer';
import {Notifications} from './Notifications';

describe('Notifications component snapshot', () => {
  const notifications = [
    {
      id: 0,
      content: "Lorem",
      category: "success"
    },
    {
      id: 1,
      content: "Ipsum",
      category: "error"
    }
  ];

  it('renders correctly', () => {
    const component = renderer.create(
      <Notifications
        notifications={notifications} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
