/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AuthVerificationType } from '../../types/AuthTypes';
import Loading from '../ui/Loading';

import { verify, deleteError } from '../../modules/auth';

import styles from './Common.css';

class Verify extends React.Component {
  componentWillMount() {
    const { verify } = this.props;
    const { verificationToken } = this.props.match.params;
    const userObject: AuthVerificationType = {
      verificationToken,
    };
    verify(userObject);
  }

  componentWillUnmount() {
    const { deleteError } = this.props;
    deleteError();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Verify</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <Loading />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      verify,
      deleteError,
    },
    dispatch
  );
}

Verify.propTypes = {
  verify: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
