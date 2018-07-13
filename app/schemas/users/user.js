/* @flow */

export default {
  title: 'Edit User',
  type: 'object',
  properties: {
    email: {
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
  required: ['email', 'firstname', 'lastname'],
};
