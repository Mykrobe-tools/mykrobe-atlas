/* @flow */

/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import { IconButton } from 'makeandship-js-common/src/components/ui/buttons';
import Loading from 'makeandship-js-common/src/components/ui/loading';

import Footer from '../../ui/footer/Footer';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';

import styles from './OrganisationProfile.module.scss';

import OrganisationMembershipActions from '../ui/OrganisationMembershipActions';
import OrganisationHeader from '../ui/OrganisationHeader';

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

class OrganisationProfile extends React.Component<*> {
  componentDidMount = () => {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation && requestOrganisation(organisationId);
    }
  };

  onJoinClick = (e: any) => {
    e.preventDefault();
    this.onJoin();
  };

  onJoin = () => {
    const { joinOrganisation, organisationId } = this.props;
    joinOrganisation({ id: organisationId });
  };

  onRemove = () => {
    const {
      removeOrganisationMember,
      organisationId,
      organisationCurrentUserMemberId,
    } = this.props;
    if (confirm('Leave organisation?')) {
      removeOrganisationMember({
        memberId: organisationCurrentUserMemberId,
        id: organisationId,
      });
    }
  };

  render() {
    const {
      organisation,
      organisationId,
      organisationIsFetching,
      organisationCurrentUserStatus,
    } = this.props;
    return (
      <div className={styles.container}>
        <OrganisationHeader {...this.props} />
        <div className={styles.container}>
          {!organisation || organisationIsFetching ? (
            <Loading />
          ) : (
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
                  <div
                    className={styles.organisationMembershipActionsContainer}
                  >
                    <OrganisationMembershipActions
                      onJoin={this.onJoin}
                      onRemove={this.onRemove}
                      currentUserStatus={organisationCurrentUserStatus}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="justify-content-sm-center">
                <OrganisationProfileStats stats={organisation.stats} />
              </Row>
            </Container>
          )}
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
