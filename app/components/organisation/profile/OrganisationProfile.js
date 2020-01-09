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

import styles from './OrganisationProfile.scss';

import OrganisationStatusIcon from './OrganisationStatusIcon';

export const OrganisationProfileStatBadge = ({
  badge,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.statBadgeContainer}>
    {badge.type}
    <p>{badge.description}</p>
    <Link to={badge.to}>{badge.link}</Link>
  </div>
);

export const OrganisationProfileStat = ({
  stat,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.statContainer}>
    <div className={styles.statValue}>
      {stat.value}
      <span className={stat.valueUnit}>{stat.valueUnit}</span>
      <OrganisationProfileStatBadge badge={stat.badge} />
    </div>
  </div>
);

export const OrganisationProfileStats = ({
  stats,
}: React.ElementProps<*>): React.Element<*> =>
  stats.map((stat, index) => (
    <Col key={`${index}`} sm={4} className={index > 0 ? 'border-left' : null}>
      <OrganisationProfileStat stat={stat} />
    </Col>
  ));

export const OrganisationProfileActions = ({
  currentUserStatus,
}: React.ElementProps<*>): React.Element<*> => (
  <div className={styles.actionsContainer}>
    {!currentUserStatus && (
      <PrimaryButton outline icon={'plus-circle'}>
        Ask to join
      </PrimaryButton>
    )}
    {currentUserStatus === 'member' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> You are a member{' '}
        </div>
        <SecondaryButton icon={'ban'}>Leave</SecondaryButton>
      </React.Fragment>
    )}
    {currentUserStatus === 'requested' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> Membership
          requested
        </div>
        <SecondaryButton icon={'repeat'}>Resend</SecondaryButton>
        <SecondaryButton icon={'times-circle'}>Cancel</SecondaryButton>{' '}
      </React.Fragment>
    )}
    {currentUserStatus === 'invited' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> You are invited
        </div>
        <IconButton>Accept and join</IconButton>
      </React.Fragment>
    )}
    {currentUserStatus === 'declined' && (
      <React.Fragment>
        <div>
          <OrganisationStatusIcon status={currentUserStatus} /> Membership
          declined
        </div>
        <SecondaryButton icon={'plus-circle'}>Ask to join</SecondaryButton>
      </React.Fragment>
    )}
  </div>
);

class OrganisationProfile extends React.Component<*> {
  render() {
    const {
      organisation,
      organisationIsFetching,
      currentUserRole,
      currentUserStatus,
    } = this.props;
    if (organisationIsFetching) {
      return null;
    }
    return (
      <div className={styles.container}>
        <HeaderContainer title={organisation.name} />
        <div className={styles.container}>
          <Container fluid>
            <Row className="justify-content-sm-center">
              <Col sm={8}>
                <h1 className={styles.name}>{organisation.name}</h1>
                <p className={styles.description}>{organisation.description}</p>
                {currentUserRole === 'admin' && (
                  <div className={`${styles.actionsContainer} mb-3`}>
                    <IconButton outline icon={'pencil'}>
                      Edit
                    </IconButton>
                  </div>
                )}
                <OrganisationProfileActions
                  currentUserStatus={currentUserStatus}
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
  organisation: PropTypes.object,
  currentUserStatus: PropTypes.string,
  currentUserRole: PropTypes.string,
};

export default OrganisationProfile;
