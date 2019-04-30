/* @flow */

export default {
  title: 'Sign up',
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
    password: {
      type: 'string',
      title: 'Password',
    },
    confirmPassword: {
      type: 'string',
      title: 'Confirm password',
    },
  },
  required: [
    'firstname',
    'lastname',
    'username',
    'password',
    'confirmPassword',
  ],
};
