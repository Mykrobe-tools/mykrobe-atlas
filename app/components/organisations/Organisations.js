/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  getOrganisations,
  getOrganisationIsFetching,
  requestOrganisations,
  newOrganisation,
} from '../../modules/organisations';

import styles from './Common.scss';
import Loading from '../ui/Loading';
import Header from '../header/Header';

class Profile extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisations } = this.props;
    requestOrganisations();
  }
  onNewOrganisationClick = () => {
    const { newOrganisation } = this.props;
    newOrganisation();
  };
  render() {
    const { organisations, isFetching } = this.props;
    if (isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Organisations</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Loading />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <Header title={'Organisations'} />
        <Container fluid>
          <div className={styles.contentContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.tableHeading}>Name</th>
                  <th className={styles.tableHeading}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {organisations.map(organisation => (
                  <tr key={organisation.id}>
                    <td className={styles.tableCell}>{organisation.name}</td>
                    <td className={styles.tableCell}>
                      <Link
                        className={styles.link}
                        to={`/organisations/${organisation.id}`}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.formActions}>
              <div>
                <a onClick={this.onNewOrganisationClick}>
                  Add new organisation
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organisations: getOrganisations(state),
    isFetching: getOrganisationIsFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestOrganisations,
      newOrganisation,
    },
    dispatch
  );
}

Profile.propTypes = {
  organisations: PropTypes.array.isRequired,
  requestOrganisations: PropTypes.func.isRequired,
  newOrganisation: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
