/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuthActions from '../../actions/AuthActions';
import type { AuthVerificationType } from '../../types/AuthTypes';
import Loading from '../ui/Loading';

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
      verify: AuthActions.verify,
    },
    dispatch
  );
}

Verify.propTypes = {
  verify: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Verify);
