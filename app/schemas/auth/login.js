/* @flow */

export default {
  title: 'Log in',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    password: {
      type: 'string',
      title: 'Password',
    },
  },
  required: ['email', 'password'],
};
