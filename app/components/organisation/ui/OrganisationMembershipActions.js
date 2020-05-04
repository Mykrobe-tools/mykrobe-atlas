/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import {
  PrimaryButton,
  SecondaryButton,
} from 'makeandship-js-common/src/components/ui/buttons';

import styles from './OrganisationMembershipActions.module.scss';

import OrganisationStatusIcon from '../ui/OrganisationStatusIcon';

const OrganisationMembershipActions = ({
  currentUserStatus,
  onJoin,
  onRemove,
  size,
  children,
}: React.ElementProps<*>): React.Element<*> => {
  const onJoinClick = (e) => {
    e.preventDefault();
    onJoin();
  };

  const onRemoveClick = (e) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <div className={styles.container}>
      {!currentUserStatus && (
        <PrimaryButton
          size={size}
          onClick={onJoinClick}
          outline
          icon={'plus-circle'}
        >
          Ask to join
        </PrimaryButton>
      )}
      {currentUserStatus === 'owner' && (
        <React.Fragment>
          <div>
            <OrganisationStatusIcon status={currentUserStatus} /> You are an
            owner{' '}
          </div>
          <SecondaryButton size={size} onClick={onRemoveClick} icon={'ban'}>
            Leave
          </SecondaryButton>
        </React.Fragment>
      )}
      {currentUserStatus === 'member' && (
        <React.Fragment>
          <div>
            <OrganisationStatusIcon status={currentUserStatus} /> You are a
            member
          </div>
          <SecondaryButton size={size} onClick={onRemoveClick} icon={'ban'}>
            Leave
          </SecondaryButton>
        </React.Fragment>
      )}
      {currentUserStatus === 'unapproved' && (
        <React.Fragment>
          <div>
            <OrganisationStatusIcon status={currentUserStatus} /> Membership
            pending approval
          </div>
          <SecondaryButton size={size} onClick={onJoinClick} icon={'repeat'}>
            Resend
          </SecondaryButton>
          <SecondaryButton
            size={size}
            onClick={onRemoveClick}
            icon={'times-circle'}
          >
            Cancel
          </SecondaryButton>{' '}
        </React.Fragment>
      )}
      {currentUserStatus === 'rejected' && (
        <React.Fragment>
          <div>
            <OrganisationStatusIcon status={currentUserStatus} /> Membership
            rejected
          </div>
          <SecondaryButton
            size={size}
            onClick={onJoinClick}
            icon={'plus-circle'}
          >
            Ask to join
          </SecondaryButton>
        </React.Fragment>
      )}
      {children}
    </div>
  );
};

OrganisationMembershipActions.propTypes = {
  currentUserStatus: PropTypes.string,
  onJoin: PropTypes.func,
  onRemove: PropTypes.func,
};

export default OrganisationMembershipActions;
