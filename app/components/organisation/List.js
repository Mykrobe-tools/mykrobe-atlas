/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as OrganisationActions from '../../actions/OrganisationActions.js';

import styles from './Common.css';
import Loading from '../ui/Loading';

class Profile extends React.Component {
  componentWillMount() {
    const { requestAllOrganisations } = this.props;
    requestAllOrganisations();
  }
  render() {
    const { organisations } = this.props;
    if (organisations.isFetching) {
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
                {organisations.data.allOrganisations &&
                  organisations.data.allOrganisations.map(organisation => {
                    return (
                      <tr key={organisation.id}>
                        <td className={styles.tableCell}>
                          {organisation.name}
                        </td>
                        <td className={styles.tableCell}>
                          <Link
                            className={styles.link}
                            to={`/organisation/edit/${organisation.id}`}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
    organisations: state.organisations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      requestAllOrganisations: OrganisationActions.requestAllOrganisations,
    },
    dispatch
  );
}

Profile.propTypes = {
  organisations: PropTypes.object.isRequired,
  requestAllOrganisations: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
