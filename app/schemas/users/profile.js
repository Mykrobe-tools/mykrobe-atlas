/* @flow */

export default {
  title: 'Profile',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    firstname: {
      type: 'string',
      title: 'First name',
    },
    lastname: {
      type: 'string',
      title: 'Last name',
    },
  },
  required: ['username', 'firstname', 'lastname'],
};
