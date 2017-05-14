/* @flow */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

import styles from './Common.css';
import * as OrganisationActions from '../../actions/OrganisationActions';
import type { OrganisationType } from '../../types/OrganisationTypes';
import Loading from '../ui/Loading';

class Edit extends React.Component {
  id: string;

  componentWillMount() {
    const {requestOrganisation} = this.props;
    const {id} = this.props.params;
    this.id = id;
    requestOrganisation(this.id);
  }

  componentWillUnmount() {
    const {deleteFailureReason} = this.props;
    deleteFailureReason();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { updateOrganisation } = this.props;
    const organisationObject: OrganisationType = {
      id: this.id,
      name: this.refs.name.value
    };
    updateOrganisation(organisationObject);
  }

  deleteOrganisation = (e) => {
    const {deleteOrganisation} = this.props;
    const organisationObject: OrganisationType = {
      id: this.id
    };
    if (confirm('Delete organisation?')) {
      deleteOrganisation(organisationObject);
    }
  }

  render() {
    const {organisations} = this.props;
    const {failureReason} = this.props.organisations;
    const organisation: ?OrganisationType = organisations.data.organisation;
    if (organisations.isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>
              Edit Organisation
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Loading />
            </div>
          </div>
        </div>
      );
    }
    console.log(organisation);
    if (!organisation) {
      return null;
    }
    const {name} = organisation;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Edit Organisation
          </div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <form onSubmit={(e) => {
              this.handleSubmit(e);
            }}>
              {failureReason && (
                <div className={styles.formErrors}>
                  {failureReason}
                </div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="name">Name</label>
                <input className={styles.input} type="text" id="name" ref="name" placeholder="Org name" defaultValue={name} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="organisation">Template</label>
                <div className={styles.selectWrap}>
                  <select className={styles.select} ref="template" id="template" value="">
                    <option />
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span><i className="fa fa-chevron-circle-right" /> Update organisation</span>
                </button>
                <div>
                  <Link to="/organisation/list">View all organisations</Link>
                </div>
                <div className={styles.destructiveAction}>
                  <a onClick={this.deleteOrganisation}><i className="fa fa-trash" /> Delete organisation</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organisations: state.organisations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    requestOrganisation: OrganisationActions.requestOrganisation,
    updateOrganisation: OrganisationActions.updateOrganisation,
    deleteFailureReason: OrganisationActions.deleteFailureReason,
    deleteOrganisation: OrganisationActions.deleteOrganisation
  }, dispatch);
}

Edit.propTypes = {
  params: PropTypes.object.isRequired,
  organisations: PropTypes.object.isRequired,
  requestOrganisation: PropTypes.func.isRequired,
  updateOrganisation: PropTypes.func.isRequired,
  deleteFailureReason: PropTypes.func.isRequired,
  deleteOrganisation: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Edit);
