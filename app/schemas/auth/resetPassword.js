/* @flow */

export default {
  title: 'Reset password',
  type: 'object',
  properties: {
    password: {
      type: 'string',
      title: 'Password',
    },
    confirmPassword: {
      type: 'string',
      title: 'Confirm password',
    },
  },
  required: ['password', 'confirmPassword'],
};
