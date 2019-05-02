/* @flow */

export default {
  title: 'Forgot password',
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
  },
  required: ['email'],
};
