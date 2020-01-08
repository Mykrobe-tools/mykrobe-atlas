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

import styles from '../../organisations/Common.scss';

class OrganisationProfile extends React.Component<*> {
  renderActions = () => {
    const { currentUserStatus, currentUserRole } = this.props;
    return (
      <div className={styles.actionsContainer}>
        {!currentUserStatus && (
          <PrimaryButton outline icon={'plus-circle'}>
            Ask to join
          </PrimaryButton>
        )}
        {currentUserStatus === 'member' && (
          <div>
            <i className={'fa fa-check-circle'} /> You are a member{' '}
            <SecondaryButton icon={'ban'}>Leave</SecondaryButton>
          </div>
        )}
        {currentUserStatus === 'requested' && (
          <div>
            <i className={'fa fa-bell'} /> Membership requested{' '}
            <SecondaryButton icon={'repeat'}>Resend</SecondaryButton>
            <SecondaryButton icon={'times-circle'}>Cancel</SecondaryButton>{' '}
          </div>
        )}
        {currentUserStatus === 'invited' && (
          <div>
            <i className={'fa fa-clock-o'} /> You have been invited to join{' '}
            <IconButton>Accept and join</IconButton>
          </div>
        )}
        {currentUserStatus === 'declined' && (
          <div>
            <i className={'fa fa-exclamation-circle'} /> Membership declined{' '}
            <PrimaryButton outline icon={'plus-circle'}>
              Ask to join
            </PrimaryButton>
          </div>
        )}
        {currentUserRole === 'admin' && (
          <IconButton outline icon={'pencil'}>
            Edit
          </IconButton>
        )}
      </div>
    );
  };
  render() {
    const { organisation, organisationIsFetching } = this.props;
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
                <h1>{organisation.name}</h1>
                <p>{organisation.description}</p>
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
