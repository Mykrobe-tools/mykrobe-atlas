/* @flow */

import * as React from 'react';
import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/buttons';
import Table from 'makeandship-js-common/src/components/ui/table';
import TrLink from 'makeandship-js-common/src/components/ui/table/TrLink';

import OrganisationHeader from '../ui/OrganisationHeader';
import OrganisationMembershipActions from '../ui/OrganisationMembershipActions';
import OrganisationStatusIcon from '../../organisation/ui/OrganisationStatusIcon';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';
import { notImplemented } from '../../../util';

import styles from './OrganisationMembers.module.scss';

const headings = [
  {
    title: 'Email',
  },
  {
    title: 'Last name',
  },
  {
    title: 'First name',
  },
  {
    title: 'Status',
  },
  {
    title: '',
  },
];

const OrganisationMemberActions = ({
  organisationId,
  member,
  onApprove,
  onReject,
  onPromote,
  onDemote,
  onRemove,
}: React.ElementProps<*>): React.Element<*> => {
  const { id, organisationUserStatus: memberOrganisationUserStatus } = member;
  return (
    <UncontrolledDropdown>
      <DropdownToggle
        tag={'a'}
        href="#"
        className={styles.dropdownToggle}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownToggle>
      <DropdownMenu>
        {(memberOrganisationUserStatus === 'unapproved' ||
          memberOrganisationUserStatus === 'rejected') && (
          <DropdownItem
            onClick={(e) => {
              e.preventDefault();
              onApprove(id);
            }}
          >
            <i className="fa fa-check-circle" /> Approve
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'unapproved' && (
          <DropdownItem
            onClick={(e) => {
              e.preventDefault();
              onReject(id);
            }}
          >
            <i className="fa fa-times-circle" /> Reject
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'owner' && (
          <DropdownItem
            onClick={(e) => {
              e.preventDefault();
              onDemote(id);
            }}
          >
            <i className="fa fa-chevron-circle-down" /> Demote to member
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'member' && (
          <DropdownItem
            onClick={(e) => {
              e.preventDefault();
              onPromote(id);
            }}
          >
            <i className="fa fa-chevron-circle-up" /> Promote to owner
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'member' && (
          <DropdownItem
            onClick={(e) => {
              e.preventDefault();
              onRemove(id);
            }}
          >
            <i className="fa fa-ban" /> Remove
          </DropdownItem>
        )}
        <DropdownItem
          tag={Link}
          to={`/organisations/${organisationId}/members/${id}`}
          onClick={notImplemented}
        >
          <i className="fa fa-chevron-circle-right" /> View
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to={`/organisations/${organisationId}/members/${id}/edit`}
          onClick={notImplemented}
        >
          <i className="fa fa-pencil" /> Edit
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

class OrganisationMembers extends React.Component<*> {
  componentDidMount = () => {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation && requestOrganisation(organisationId);
    }
  };

  onNewMemberClick = (e: any) => {
    e.preventDefault();
    notImplemented();
  };

  onJoinClick = (e: any) => {
    e.preventDefault();
    this.onJoin();
  };

  onJoin = () => {
    const { joinOrganisation, organisationId } = this.props;
    joinOrganisation({ id: organisationId });
  };

  onChangeListOrder = () => {
    notImplemented();
  };

  onApprove = (memberId: string) => {
    const { organisationId, approveJoinOrganisationRequest } = this.props;
    approveJoinOrganisationRequest({
      memberId,
      id: organisationId,
    });
  };

  onReject = (memberId: string) => {
    const { organisationId, rejectJoinOrganisationRequest } = this.props;
    if (confirm('Reject request?')) {
      rejectJoinOrganisationRequest({
        memberId,
        id: organisationId,
      });
    }
  };

  onPromote = (memberId: string) => {
    const { organisationId, promoteOrganisationMember } = this.props;
    promoteOrganisationMember({
      memberId,
      id: organisationId,
    });
  };

  onDemote = (memberId: string) => {
    const { organisationId, demoteOrganisationOwner } = this.props;
    demoteOrganisationOwner({
      memberId,
      id: organisationId,
    });
  };

  onRemoveCurrentUser = () => {
    const { organisationCurrentUserMemberId } = this.props;
    this.onRemove(organisationCurrentUserMemberId);
  };

  onRemove = (memberId: string) => {
    const { organisationId, removeOrganisationMember } = this.props;
    if (confirm('Remove member?')) {
      removeOrganisationMember({
        memberId,
        id: organisationId,
      });
    }
  };

  renderRow = (member: any) => {
    const { organisationId, organisationCurrentUserIsOwner } = this.props;
    const { id, firstname, lastname, email, organisationUserStatus } = member;
    return (
      <TrLink key={id} to={`/organisations/${organisationId}/members/${id}`}>
        <td>{email}</td>
        <td>{lastname}</td>
        <td>{firstname}</td>
        <td>
          <OrganisationStatusIcon status={organisationUserStatus} />{' '}
          {organisationUserStatus || '–'}
        </td>
        <td>
          {organisationCurrentUserIsOwner && (
            <OrganisationMemberActions
              organisationId={organisationId}
              organisationUserStatus={organisationUserStatus}
              member={member}
              onApprove={this.onApprove}
              onReject={this.onReject}
              onPromote={this.onPromote}
              onDemote={this.onDemote}
              onRemove={this.onRemove}
            />
          )}
        </td>
      </TrLink>
    );
  };

  render() {
    const {
      organisation,
      organisationAllMembers,
      organisationIsFetching,
      organisationMembersIsFetching,
      organisationCurrentUserIsOwner,
      organisationCurrentUserStatus,
    } = this.props;
    return (
      <div className={styles.container}>
        <OrganisationHeader {...this.props} />
        <div className={styles.container}>
          <Container fluid>
            <PageHeader border={false}>
              <div className={pageHeaderStyles.title}>Members</div>
              <div>
                <OrganisationMembershipActions
                  size="sm"
                  currentUserStatus={organisationCurrentUserStatus}
                  onJoin={this.onJoin}
                  onRemove={this.onRemoveCurrentUser}
                >
                  {organisationCurrentUserIsOwner && (
                    <PrimaryButton
                      onClick={this.onNewMemberClick}
                      outline
                      size="sm"
                      icon="plus-circle"
                    >
                      New Member
                    </PrimaryButton>
                  )}
                </OrganisationMembershipActions>
              </div>
            </PageHeader>
            <Table
              headings={headings}
              data={organisationAllMembers}
              renderRow={this.renderRow}
              onChangeOrder={this.onChangeListOrder}
              isFetching={
                !organisation ||
                organisationIsFetching ||
                organisationMembersIsFetching
              }
            />
          </Container>
        </div>
      </div>
    );
  }
}

OrganisationMembers.propTypes = {
  ...withOrganisationPropTypes,
};

export default OrganisationMembers;
