/* @flow */

import * as React from 'react';

import styles from './OrganisationStatusIcon.scss';

const OrganisationStatusIcon = ({ status }: React.ElementProps<*>): any => {
  if (status === 'member') {
    return <i className={`${styles.member} fa fa-check-circle`} />;
  } else if (status === 'requested') {
    return <i className={`${styles.default} fa fa-bell`} />;
  } else if (status === 'invited') {
    return <i className={`${styles.default} fa fa-clock-o`} />;
  } else if (status === 'declined') {
    return <i className={`${styles.declined} fa fa-exclamation-circle`} />;
  }
  return null;
};

export default OrganisationStatusIcon;
