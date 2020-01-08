/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import {
  IconButton,
  PrimaryButton,
  SecondaryButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import HeaderContainer from '../../ui/header/HeaderContainer';
import Footer from '../../ui/footer/Footer';

import styles from './OrganisationProfile.scss';

import OrganisationStatusIcon from './OrganisationStatusIcon';

class OrganisationProfile extends React.Component<*> {
  renderActions = () => {
    const { currentUserStatus } = this.props;
    return (
      <div className={styles.actionsContainer}>
        {!currentUserStatus && (
          <PrimaryButton outline icon={'plus-circle'}>
            Ask to join
          </PrimaryButton>
        )}
        {currentUserStatus === 'member' && (
          <React.Fragment>
            <div>
              <OrganisationStatusIcon status={currentUserStatus} /> You are a
              member{' '}
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
              <OrganisationStatusIcon status={currentUserStatus} /> You are
              invited
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
  };
  render() {
    const {
      organisation,
      organisationIsFetching,
      currentUserRole,
    } = this.props;
    if (organisationIsFetching) {
      return null;
    }
    return (
      <div className={styles.container}>
        <HeaderContainer title={organisation.name} />
        <div className={styles.container}>
          <Container fluid>
            <Row>
              <Col sm={2} />
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
                {this.renderActions()}
              </Col>
              <Col sm={2} />
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
