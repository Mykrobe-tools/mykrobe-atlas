/* @flow */

export default {
  title: 'Log in',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    password: {
      type: 'string',
      title: 'Password',
    },
  },
  required: ['username', 'password'],
};
