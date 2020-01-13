/* @flow */

import * as React from 'react';

import styles from './OrganisationStatusIcon.scss';

const OrganisationStatusIcon = ({ status }: React.ElementProps<*>): any => {
  if (status === 'member') {
    return <i className={`${styles.member} fa fa-check-circle`} />;
  } else if (status === 'unapproved') {
    return <i className={`${styles.default} fa fa-bell`} />;
  } else if (status === 'requested') {
    return <i className={`${styles.default} fa fa-clock-o`} />;
  } else if (status === 'rejected') {
    return <i className={`${styles.rejected} fa fa-exclamation-circle`} />;
  }
  return null;
};

export default OrganisationStatusIcon;
