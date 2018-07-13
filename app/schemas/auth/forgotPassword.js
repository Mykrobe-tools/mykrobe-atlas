/* @flow */

export default {
  title: 'Forgot password',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
  },
  required: ['email'],
};
