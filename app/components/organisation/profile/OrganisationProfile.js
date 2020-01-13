/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import {
  IconButton,
  PrimaryButton,
  SecondaryButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import HeaderContainer from '../../ui/header/HeaderContainer';
import Footer from '../../ui/footer/Footer';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';

import styles from './OrganisationProfile.scss';

import OrganisationStatusIcon from './OrganisationStatusIcon';

export const OrganisationProfileStatBadgeIcon = ({
  type,
}: React.ElementProps<*>): any => {
  if (type === 'gold') {
    return <i className={`${styles.badgeTypeGold} fa fa-trophy`} />;
  } else if (type === 'warn') {
    return <i className={`${styles.badgeTypeWarn} fa fa-warning`} />;
  }
  return null;
};

export const OrganisationProfileStatBadge = ({
  badge,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.statBadgeContainer}>
    <OrganisationProfileStatBadgeIcon type={badge.type} />
    <div>{badge.description}</div>
    <Link to={badge.to}>
      <i className="fa fa-chevron-circle-right" /> {badge.link}
    </Link>
  </div>
);

export const OrganisationProfileStat = ({
  stat,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.statContainer}>
    <div className={styles.statValue}>
      {stat.value}
      <span className={styles.statValueUnit}>{stat.valueUnit}</span>
    </div>
    <OrganisationProfileStatBadge badge={stat.badge} />
  </div>
);

export const OrganisationProfileStats = ({
  stats,
}: React.ElementProps<*>): React.Element<*> | null =>
  stats
    ? stats.map((stat, index) => (
        <Col
          key={`${index}`}
          sm={4}
          className={index > 0 ? 'border-left' : null}
        >
          <OrganisationProfileStat stat={stat} />
        </Col>
      ))
    : null;

export const OrganisationProfileActions = ({
  currentUserStatus,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.actionsContainer}>
    {!currentUserStatus && (
      <PrimaryButton outline icon={'plus-circle'}>
        Ask to join
      </PrimaryButton>
    )}
    {currentUserStatus === 'owner' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> You are an owner{' '}
        </div>
        <SecondaryButton icon={'ban'}>Leave</SecondaryButton>
      </React.Fragment>
    )}
    {currentUserStatus === 'member' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> You are a member{' '}
        </div>
        <SecondaryButton icon={'ban'}>Leave</SecondaryButton>
      </React.Fragment>
    )}
    {currentUserStatus === 'unapproved' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> Membership
          pending approval
        </div>
        <SecondaryButton icon={'repeat'}>Resend</SecondaryButton>
        <SecondaryButton icon={'times-circle'}>Cancel</SecondaryButton>{' '}
      </React.Fragment>
    )}
    {currentUserStatus === 'rejected' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> Membership
          rejected
        </div>
        <SecondaryButton icon={'plus-circle'}>Ask to join</SecondaryButton>
      </React.Fragment>
    )}
  </div>
);

class OrganisationProfile extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  render() {
    const {
      organisation,
      organisationId,
      organisationIsFetching,
      organisationCurrentUserStatus,
      organisationCurrentUserIsOwner,
      organisationCurrentUserIsMember,
      organisationCurrentUserIsUnapprovedMember,
      organisationCurrentUserIsRejectedMember,
    } = this.props;
    if (!organisation || organisationIsFetching) {
      return null;
    }
    return (
      <div className={styles.container}>
        <HeaderContainer title={organisation.name} />
        <div className={styles.container}>
          <pre>
            {JSON.stringify(
              {
                organisationCurrentUserIsOwner,
                organisationCurrentUserIsMember,
                organisationCurrentUserIsUnapprovedMember,
                organisationCurrentUserIsRejectedMember,
                organisationCurrentUserStatus,
              },
              null,
              2
            )}
          </pre>
          <Container fluid>
            <Row className="justify-content-sm-center">
              <Col sm={8}>
                <div className={styles.organisationProfile}>
                  <h1 className={styles.name}>{organisation.name}</h1>
                  <p className={styles.description}>
                    {organisation.description}
                  </p>
                  {organisationCurrentUserStatus === 'owner' && (
                    <div className={`${styles.actionsContainer} mb-3`}>
                      <IconButton
                        outline
                        icon={'pencil'}
                        tag={Link}
                        to={`/organisations/${organisationId}/edit`}
                      >
                        Edit
                      </IconButton>
                    </div>
                  )}
                </div>
                <OrganisationProfileActions
                  currentUserStatus={organisationCurrentUserStatus}
                />
              </Col>
            </Row>
            <Row className="justify-content-sm-center">
              <OrganisationProfileStats stats={organisation.stats} />
            </Row>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

OrganisationProfile.propTypes = {
  ...withOrganisationPropTypes,
  currentUserStatus: PropTypes.string,
  currentUserRole: PropTypes.string,
};

export default OrganisationProfile;
