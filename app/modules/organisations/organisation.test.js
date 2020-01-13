/* @flow */

import { userIsOrganisationOwner } from './organisation';

const organisation = {
  owners: [
    {
      userId: '1',
      firstname: 'Lorem 1',
      lastname: 'Ispum 1',
      email: 'test1@example.com',
      username: 'test1@example.com',
    },
  ],
  members: [],
  unapprovedMembers: [
    {
      userId: '2',
      firstname: 'Lorem 2',
      lastname: 'Ispum 2',
      email: 'test2@example.com',
      username: 'test2@example.com',
    },
  ],
  rejectedMembers: [],
  name: 'Test',
  slug: 'test',
  membersGroupId: '123',
  ownersGroupId: '456',
  id: '1',
};

const currentUser = {
  id: '1',
};

const otherUser = {
  id: '2',
};

describe('organisation module', () => {
  it('should handle bad input', () => {
    expect(userIsOrganisationOwner()).toBeFalsy();
    expect(userIsOrganisationOwner(currentUser)).toBeFalsy();
    expect(userIsOrganisationOwner(undefined, organisation)).toBeFalsy();
  });
  it('should identify owners', () => {
    expect(userIsOrganisationOwner(currentUser, organisation)).toBeTruthy();
    expect(userIsOrganisationOwner(otherUser, organisation)).toBeFalsy();
  });
});
