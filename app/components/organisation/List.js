/* @flow */

// TODO: split and separate all organisations vs single
// organisations
// organisation

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import {
  getOrganisations,
  getOrganisationIsFetching,
  requestOrganisations,
} from '../../modules/organisations';

import styles from './Common.css';
import Loading from '../ui/Loading';

class Profile extends React.Component {
  componentWillMount() {
    const { requestOrganisations } = this.props;
    requestOrganisations();
  }
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
        <div className={styles.header}>
          <div className={styles.title}>Organisations</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
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
                        to={`/organisation/edit/${organisation.id}`}
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
                <Link to="/organisation/add">Add new organisation</Link>
              </div>
            </div>
          </div>
        </div>
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
    },
    dispatch
  );
}

Profile.propTypes = {
  organisations: PropTypes.array.isRequired,
  requestOrganisations: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
