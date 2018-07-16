/* @flow */

export default {
  title: 'Organisation',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    template: {
      type: 'string',
      title: 'Template',
      enum: ['MGIT', 'LJ', 'Microtitre plate', 'MODS'],
    },
  },
  required: ['name', 'template'],
};
