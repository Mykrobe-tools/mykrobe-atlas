/* @flow */

import {
  organisationUserIsOwner,
  organisationUserIsMember,
  organisationUserIsUnapprovedMember,
  organisationUserIsRejectedMember,
} from './organisationMembers';

const currentUser = {
  id: '1',
};

const memberUser = {
  id: '2',
};

const unapprovedUser = {
  id: '3',
};

const rejectedUser = {
  id: '4',
};

const organisation = {
  owners: [
    {
      userId: currentUser.id,
    },
  ],
  members: [
    {
      userId: memberUser.id,
    },
  ],
  unapprovedMembers: [
    {
      userId: unapprovedUser.id,
    },
  ],
  rejectedMembers: [
    {
      userId: rejectedUser.id,
    },
  ],
  name: 'Test',
  slug: 'test',
  membersGroupId: '123',
  ownersGroupId: '456',
  id: '1',
};

describe('organisationMembers module', () => {
  it('should handle bad input', () => {
    expect(organisationUserIsOwner()).toBeFalsy();
    expect(organisationUserIsOwner(organisation)).toBeFalsy();
    expect(organisationUserIsOwner(undefined, currentUser)).toBeFalsy();
  });
  it('should identify owners', () => {
    expect(organisationUserIsOwner(organisation, currentUser)).toBeTruthy();
    expect(organisationUserIsOwner(organisation, memberUser)).toBeFalsy();
    expect(organisationUserIsOwner(organisation, unapprovedUser)).toBeFalsy();
    expect(organisationUserIsOwner(organisation, rejectedUser)).toBeFalsy();
  });
  it('should identify members', () => {
    expect(organisationUserIsMember(organisation, currentUser)).toBeFalsy();
    expect(organisationUserIsMember(organisation, memberUser)).toBeTruthy();
    expect(organisationUserIsMember(organisation, unapprovedUser)).toBeFalsy();
    expect(organisationUserIsMember(organisation, rejectedUser)).toBeFalsy();
  });
  it('should identify unapproved members', () => {
    expect(
      organisationUserIsUnapprovedMember(organisation, currentUser)
    ).toBeFalsy();
    expect(
      organisationUserIsUnapprovedMember(organisation, memberUser)
    ).toBeFalsy();
    expect(
      organisationUserIsUnapprovedMember(organisation, unapprovedUser)
    ).toBeTruthy();
    expect(
      organisationUserIsUnapprovedMember(organisation, rejectedUser)
    ).toBeFalsy();
  });
  it('should identify rejected members', () => {
    expect(
      organisationUserIsRejectedMember(organisation, currentUser)
    ).toBeFalsy();
    expect(
      organisationUserIsRejectedMember(organisation, memberUser)
    ).toBeFalsy();
    expect(
      organisationUserIsRejectedMember(organisation, unapprovedUser)
    ).toBeFalsy();
    expect(
      organisationUserIsRejectedMember(organisation, rejectedUser)
    ).toBeTruthy();
  });
});
